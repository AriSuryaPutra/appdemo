import { join } from 'path';
import { promisify } from 'util';
import { writeFile } from 'fs';
import { getIO } from './socket';
import { logger } from './logger';
import { initWbot } from './wbot';
import { wbotMessageListener } from './wbotListener';
import wbotMonitor from './wbotMonitor';
import { debounce } from '../helpers/Debounce';
import { Contact as WbotContact, Message as WbotMessage, MessageAck, Client } from 'whatsapp-web.js';
import { WaContact, WaChat, WaChatMessage, WaAutoMessage } from '../models';

//import CreateWaChatMessageService from '../WaChatMessageServices/CreateWaChatMessageService';
//import CreateOrUpdateWaContactService from '../WaContactServices/CreateOrUpdateWaContactService';
//import FindOrCreateWaChatService from '../WaChatServices/FindOrCreateWaChatService';
//import ShowWaPhoneService from '../WaPhoneServices/ShowWaPhoneService';
//import UpdateWaChatService from '../WaChatServices/UpdateWaChatService';

export const StartWaPhoneSession = async wa_phone => {
  await wa_phone.update({ status: 'OPENING', qrcode: '' });

  const io = getIO();
  io.emit('WaPhoneSessionSocket', {
    action: 'update',
    session: wa_phone
  });

  try {
    const wbot = await initWbot(wa_phone);
    wbotMessageListener(wbot);
    wbotMonitor(wbot, wa_phone);
    logger.info('Ok Masuk', wa_phone);
  } catch (err) {
    logger.error(err);
  }
};
