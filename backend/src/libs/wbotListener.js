import { join } from 'path';
import { promisify } from 'util';
import { writeFile } from 'fs';
import { WaPhone, WaContact, WaChat, WaChatMessage, WaAutoMessage, User, WaQueue, WaContactField } from '../models';
import { getIO } from './socket';
import { logger } from './logger';
import { debounce } from '../helpers/debounce';
import { isEmpty } from '../helpers';
import { Op } from 'sequelize';
import { subHours } from 'date-fns';

const writeFileAsync = promisify(writeFile);

const UpdateWaChatService = async ({ waChatData, waChatUuid }) => {
  const { status, user_uuid, wa_queue_uuid } = waChatData;

  const wa_chat = await WaChat.findByPk(waChatUuid, {
    include: [
      {
        model: WaContact,
        as: 'wa_contact',
        attributes: ['uuid', 'name', 'number', 'profile_pic_url'],
        include: [{ model: WaContactField, as: 'wa_contact_field' }]
      },
      {
        model: User,
        as: 'user',
        attributes: ['uuid', 'display_name']
      },
      {
        model: WaQueue,
        as: 'wa_queue',
        attributes: ['uuid', 'name', 'color']
      }
    ]
  });

  if (!wa_chat) {
    throw new Error('ERROR_WA_CHAT_NOT_FOUND');
  }

  await SetWaChatMessageAsRead(wa_chat);

  const wa_chat_user_uuid = wa_chat.user ? wa_chat.user.uuid : null;
  const wa_chat_wa_contact_uuid = wa_chat.wa_contact.uuid ? wa_chat.wa_contact.uuid : null;

  const oldStatus = wa_chat.status;
  const oldUserUuid = wa_chat_user_uuid;

  if (oldStatus === 'closed') {
    await CheckWaContactOpenWaChat(wa_chat_wa_contact_uuid);
  }

  await wa_chat.update({
    status,
    wa_queue_uuid,
    user_uuid
  });

  await wa_chat.reload();

  const io = getIO();

  if (wa_chat.status !== oldStatus || wa_chat_user_uuid !== oldUserUuid) {
    io.to(oldStatus).emit('WaChatSocket', {
      action: 'delete',
      wa_chat_uuid: wa_chat.uuid
    });
  }

  io.to(wa_chat.status)
    .to('notification')
    .to(waChatUuid.toString())
    .emit('wa_chat', {
      action: 'update',
      wa_chat
    });

  return { wa_chat, oldStatus, oldUserUuid };
};

const ShowWaPhoneService = async uuid => {
  try {
    const wa_phone = await WaPhone.findByPk(uuid, {
      where: { is_default: true }
    });

    if (!wa_phone) {
      throw new Error('ERROR_DEVICE_NOT_FOUND');
    }

    return wa_phone;
  } catch (err) {
    console.log(err);
    throw new Error('ERROR_DEVICE_CHECK_WA_SERVICE');
  }
};

const FindOrCreateWaChatService = async (waContact, waPhoneUuid, unread, groupWaContact) => {
  let wa_chat = await WaChat.findOne({
    where: {
      status: {
        [Op.or]: ['open', 'pending']
      },
      wa_contact_uuid: groupWaContact ? groupWaContact.uuid : waContact.uuid
    }
  });

  if (wa_chat) {
    await wa_chat.update({ unread });
  }

  if (!wa_chat && groupWaContact) {
    wa_chat = await WaChat.findOne({
      where: {
        wa_contact_uuid: groupWaContact.uuid
      },
      order: [['updated_at', 'DESC']]
    });

    if (wa_chat) {
      await wa_chat.update({
        status: 'pending',
        user_uuid: null,
        unread
      });
    }
  }

  if (!wa_chat && !groupWaContact) {
    wa_chat = await WaChat.findOne({
      where: {
        updated_at: {
          [Op.between]: [+subHours(new Date(), 2), +new Date()]
        },
        wa_contact_uuid: waContact.uuid
      },
      order: [['updated_at', 'DESC']]
    });

    if (wa_chat) {
      await wa_chat.update({
        status: 'pending',
        user_uuid: null,
        wa_queue_uuid: null,
        unread
      });
    }
  }

  if (!wa_chat) {
    wa_chat = await WaChat.create({
      wa_contact_uuid: groupWaContact ? groupWaContact.uuid : waContact.uuid,
      status: 'pending',
      group: !!groupWaContact,
      unread,
      wa_phone_uuid: waPhoneUuid
    });
  }

  wa_chat = await WaChat.findByPk(wa_chat.uuid, {
    include: [
      {
        model: WaContact,
        as: 'wa_contact',
        attributes: ['uuid', 'name', 'number', 'profile_pic_url'],
        include: ['wa_contact_field']
      },
      {
        model: User,
        as: 'user',
        attributes: ['uuid', 'display_name']
      },
      {
        model: WaQueue,
        as: 'wa_queue',
        attributes: ['uuid', 'name', 'color']
      }
    ]
  });

  if (!wa_chat) {
    throw new Error('ERROR_WA_CHAT_NOT_FOUND');
  }

  return wa_chat;
};

const CreateOrUpdateWaContactService = async ({ name, number: rawNumber, profile_pic_url, group, email = '', extra_info = [] }) => {
  const number = group ? rawNumber : rawNumber.replace(/[^0-9]/g, '');

  const io = getIO();
  let wa_contact;

  wa_contact = await WaContact.findOne({ where: { number } });

  if (wa_contact) {
    wa_contact.update({ profile_pic_url });

    io.emit('WaContactSocket', {
      action: 'update',
      wa_contact
    });
  } else {
    wa_contact = await WaContact.create({
      name,
      number,
      profile_pic_url,
      email,
      group,
      wa_contact_field: extra_info
    });

    io.emit('WaContactSocket', {
      action: 'create',
      wa_contact
    });
  }

  return wa_contact;
};

const CreateWaChatMessageService = async ({ waChatMessageData }) => {
  await WaChatMessage.upsert(waChatMessageData);

  const wa_chat_message = await WaChatMessage.findByPk(waChatMessageData.uuid, {
    include: [
      'wa_contact',
      {
        model: WaChat,
        as: 'wa_chat',
        include: ['wa_contact', 'wa_queue']
      },
      {
        model: WaChatMessage,
        as: 'quote_chat_message',
        include: ['wa_contact']
      }
    ]
  });

  if (!wa_chat_message) {
    throw new Error('ERR_CREATING_MESSAGE');
  }

  const io = getIO();
  io.to(wa_chat_message.wa_chat_uuid.toString())
    .to(wa_chat_message.wa_chat.status)
    .to('notification')
    .emit('APP_NOTIF_NEW_MESSAGE', {
      action: 'create',
      wa_chat_message,
      wa_chat: wa_chat_message.wa_chat,
      wa_contact: wa_chat_message.wa_chat.wa_contact
    });

  return wa_chat_message;
};

const verifyAutoMessage = async (wbot, msg, wa_chat, wa_contact) => {
  let pesan = msg.body;

  const date = new Date().getTime();
  const jamKerja = new Date().setHours(16, 59);
  const hitung_jam = date - jamKerja;

  if (hitung_jam < 0) {
    pesan = msg.body;
  } else {
    pesan = '#diluarjamkerja';
  }

  const auto_message = await WaAutoMessage.findOne({
    where: { keyword: pesan }
  });

  if (!auto_message) return null;

  const body = `\u200e${auto_message.value}`;

  const sentMessage = await wbot.sendMessage(`${wa_contact.number}@c.us`, body);

  await verifyMessage(sentMessage, wa_chat, wa_contact);
};

const verifyContact = async msgContact => {
  const profilePicUrl = await msgContact.getProfilePicUrl();

  const waContactData = {
    name: msgContact.name || msgContact.pushname || msgContact.id.user,
    number: msgContact.id.user,
    profile_pic_url: profilePicUrl,
    group: msgContact.isGroup
  };

  const wa_contact = CreateOrUpdateWaContactService(waContactData);

  return wa_contact;
};

const verifyQuotedMessage = async msg => {
  if (!msg.hasQuotedMsg) return null;

  const wbotQuotedMsg = await msg.getQuotedMessage();

  const quotedMsg = await WaChatMessage.findOne({
    where: { uuid: wbotQuotedMsg.id.id }
  });

  if (!quotedMsg) return null;

  return quotedMsg;
};

const verifyMediaMessage = async (msg, wa_chat, wa_contact) => {
  const quotedMsg = await verifyQuotedMessage(msg);

  const media = await msg.downloadMedia();

  if (!media) {
    throw new Error('ERR_WAPP_DOWNLOAD_MEDIA');
  }

  if (!media.filename) {
    const ext = media.mimetype.split('/')[1].split(';')[0];
    media.filename = `${new Date().getTime()}.${ext}`;
  }

  try {
    await writeFileAsync(join(__dirname, '..', '..', 'public', media.filename), media.data, 'base64');
  } catch (err) {
    logger.error(err);
  }

  const quote_message_uuid = isEmpty(quotedMsg) ? null : quotedMsg.uuid;

  const waChatMessageData = {
    uuid: msg.id.id,
    wa_chat_uuid: wa_chat.uuid,
    wa_contact_uuid: msg.fromMe ? undefined : wa_contact.uuid,
    body: msg.body || media.filename,
    from_me: msg.fromMe,
    read: msg.fromMe,
    mediaUrl: media.filename,
    mediaType: media.mimetype.split('/')[0],
    quote_chat_message_uuid: quote_message_uuid
  };

  await wa_chat.update({ last_message: msg.body || media.filename });
  const newMessage = await CreateWaChatMessageService({ waChatMessageData });

  return newMessage;
};

const verifyMessage = async (msg, wa_chat, wa_contact) => {
  const quotedMsg = await verifyQuotedMessage(msg);

  const quote_message_uuid = isEmpty(quotedMsg) ? null : quotedMsg.uuid;

  const waChatMessageData = {
    uuid: msg.id.id,
    wa_chat_uuid: wa_chat.uuid,
    wa_contact_uuid: msg.fromMe ? undefined : wa_contact.uuid,
    body: msg.body,
    from_me: msg.fromMe,
    mediaType: msg.type,
    read: msg.fromMe,
    quote_chat_message_uuid: quote_message_uuid
  };

  await wa_chat.update({ last_message: msg.body });
  await CreateWaChatMessageService({ waChatMessageData });
};

const verifyQueue = async (wbot, msg, wa_chat, wa_contact) => {
  const { wa_queue, greeting_message } = await ShowWaPhoneService(wbot.uuid);

  if (wa_queue.length === 1) {
    await UpdateWaChatService({
      waChatData: { wa_queue_uuid: wa_queue[0].uuid },
      waChatUuid: wa_chat.uuid
    });

    return;
  }

  const selectedOption = msg.body;

  const choosenQueue = wa_queue[+selectedOption - 1];

  if (choosenQueue) {
    await UpdateWaChatService({
      waChatData: { wa_queue_uuid: choosenQueue.uuid },
      waChatUuid: wa_chat.uuid
    });

    const body = `\u200e${choosenQueue.greeting_message}`;

    const sentMessage = await wbot.sendMessage(`${wa_contact.number}@c.us`, body);

    await verifyMessage(sentMessage, wa_chat, wa_contact);
  } else {
    let options = '';

    wa_queue.forEach((queue, index) => {
      options += `*${index + 1}* - ${queue.name}\n`;
    });

    const body = `\u200e${greeting_message}\n${options}`;

    const debouncedSentMessage = debounce(
      async () => {
        const sentMessage = await wbot.sendMessage(`${wa_contact.number}@c.us`, body);
        verifyMessage(sentMessage, wa_chat, wa_contact);
      },
      3000,
      wa_chat.uuid
    );

    debouncedSentMessage();
  }
};

const isValidMsg = msg => {
  if (msg.from === 'status@broadcast') return false;
  if (
    msg.type === 'chat' ||
    msg.type === 'audio' ||
    msg.type === 'ptt' ||
    msg.type === 'video' ||
    msg.type === 'image' ||
    msg.type === 'document' ||
    msg.type === 'vcard' ||
    msg.type === 'sticker'
  )
    return true;
  return false;
};

const handleMessage = async (msg, wbot) => {
  if (!isValidMsg(msg)) {
    return;
  }

  const date = new Date().getTime();
  const jamKerja = new Date().setHours(16, 59);
  const hitung_jam = date - jamKerja;

  try {
    let msgContact;
    let groupContact;

    if (msg.fromMe) {
      // messages sent automatically by wbot have a special character in front of it
      // if so, this message was already been stored in database;
      if (/\u200e/.test(msg.body[0])) return;

      // media messages sent from me from cell phone, first comes with "hasMedia = false" and type = "image/ptt/etc"
      // in this case, return and let this message be handled by "media_uploaded" event, when it will have "hasMedia = true"

      if (!msg.hasMedia && msg.type !== 'chat' && msg.type !== 'vcard') return;

      msgContact = await wbot.getContactById(msg.to);
    } else {
      msgContact = await msg.getContact();
    }

    const chat = await msg.getChat();

    if (chat.isGroup) {
      let msgGroupContact;

      if (msg.fromMe) {
        msgGroupContact = await wbot.getContactById(msg.to);
      } else {
        msgGroupContact = await wbot.getContactById(msg.from);
      }

      groupContact = await verifyContact(msgGroupContact);
    }

    const unreadMessages = msg.fromMe ? 0 : chat.unreadCount;

    const wa_contact = await verifyContact(msgContact);

    const wa_chat = await FindOrCreateWaChatService(wa_contact, wbot.uuid, unreadMessages, groupContact);

    if (msg.hasMedia) {
      await verifyMediaMessage(msg, wa_chat, wa_contact);
    } else {
      await verifyMessage(msg, wa_chat, wa_contact);
    }

    if (!wa_chat.wa_queue && !chat.isGroup && !msg.fromMe && !wa_chat.user_uuid) {
      await verifyAutoMessage(wbot, msg, wa_chat, wa_contact);
    }

    const whatsapp = await ShowWaPhoneService(wbot.uuid);
    if (!wa_chat.wa_queue && !chat.isGroup && !msg.fromMe && !wa_chat.user_uuid && whatsapp.wa_queue.length >= 1 && hitung_jam < 0) {
      await verifyQueue(wbot, msg, wa_chat, wa_contact);
    }
  } catch (err) {
    logger.error(`Error handling whatsapp message: Err: ${err}`);
  }
};

const handleMsgAck = async (msg, ack) => {
  await new Promise(r => setTimeout(r, 500));

  const io = getIO();

  try {
    const messageToUpdate = await WaChatMessage.findByPk(msg.id.id, {
      include: [
        'wa_contact',
        {
          model: WaChatMessage,
          as: 'quote_chat_message',
          include: ['wa_contact']
        }
      ]
    });
    if (!messageToUpdate) {
      return;
    }
    await messageToUpdate.update({ ack });

    io.to(messageToUpdate.wa_chat_uuid.toString()).emit('APP_NOTIF_NEW_MESSAGE', {
      action: 'update',
      wa_chat: messageToUpdate
    });
  } catch (err) {
    logger.error(`Error handling message ack. Err: ${err}`);
  }
};

const wbotMessageListener = wbot => {
  wbot.on('message_create', async msg => {
    handleMessage(msg, wbot);
  });

  wbot.on('media_uploaded', async msg => {
    handleMessage(msg, wbot);
  });

  wbot.on('message_ack', async (msg, ack) => {
    handleMsgAck(msg, ack);
  });
};

export { wbotMessageListener, handleMessage };
