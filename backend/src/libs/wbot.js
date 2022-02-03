import qrCode from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import { getIO } from './socket';
import { logger } from './logger';
import { handleMessage } from './wbotListener';

const sessions = [];

const syncUnreadMessages = async wbot => {
  const chats = await wbot.getChats();

  /* eslint-disable no-restricted-syntax */
  /* eslint-disable no-await-in-loop */
  for (const chat of chats) {
    if (chat.unreadCount > 0) {
      const unread = await chat.fetchMessages({
        limit: chat.unreadCount
      });

      for (const msg of unread) {
        await handleMessage(msg, wbot);
      }

      await chat.sendSeen();
    }
  }
};

export const initWbot = async wa_phone => {
  return new Promise((resolve, reject) => {
    try {
      const io = getIO();
      const sessionName = wa_phone.name;
      let sessionCfg;

      if (wa_phone && wa_phone.session) {
        sessionCfg = JSON.parse(wa_phone.session);
      }

      const wbot = new Client({
        session: sessionCfg,
        puppeteer: {
          headless: true,
          executablePath: process.env.CHROME_BIN || null,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--process-per-site',
            '--disable-gpu'
          ]
        }
      });

      wbot.initialize();

      wbot.on('qr', async qr => {
        logger.info('Session:', sessionName);
        qrCode.generate(qr, { small: true });
        await wa_phone.update({ qrcode: qr, status: 'qrcode', retries: 0 });

        const sessionIndex = sessions.findIndex(s => s.uuid === wa_phone.uuid);
        if (sessionIndex === -1) {
          wbot.uuid = wa_phone.uuid;
          sessions.push(wbot);
        }

        io.emit('WaPhoneSessionSocket', {
          action: 'update',
          session: wa_phone
        });
      });

      wbot.on('authenticated', async session => {
        logger.info(`Session: ${sessionName} AUTHENTICATED`);
        await wa_phone.update({
          session: JSON.stringify(session),
          status: 'CONNECTED',
          qrcode: ''
        });

        io.emit('WaPhoneSessionSocket', {
          action: 'update',
          session: wa_phone
        });
      });

      wbot.on('auth_failure', async msg => {
        logger.info('Session:', sessionName, 'AUTHENTICATION FAILURE! Reason:', msg);

        if (wa_phone.retries > 1) {
          await wa_phone.update({ session: '', retries: 0 });
        }

        const retry = wa_phone.retries;
        await wa_phone.update({
          status: 'DISCONNECTED',
          retries: retry + 1
        });

        io.emit('WaPhoneSessionSocket', {
          action: 'update',
          session: wa_phone
        });

        reject(new Error('Error starting whatsapp session.'));
      });

      wbot.on('ready', async () => {
        logger.info(`Session: ${sessionName} READY`);

        await wa_phone.update({
          status: 'CONNECTED',
          qrcode: '',
          retries: 0
        });

        io.emit('WaPhoneSessionSocket', {
          action: 'update',
          session: wa_phone
        });

        const sessionIndex = sessions.findIndex(s => s.uuid === wa_phone.uuid);
        if (sessionIndex === -1) {
          wbot.uuid = wa_phone.uuid;
          sessions.push(wbot);
        }

        wbot.sendPresenceAvailable();
        await syncUnreadMessages(wbot);

        resolve(wbot);
      });
    } catch (err) {
      logger.error(err);
    }
  });
};

export const getWbot = waPhoneUuid => {
  const sessionIndex = sessions.findIndex(s => s.uuid === waPhoneUuid);

  if (sessionIndex === -1) {
    throw new Error('ERROR_WHATSAPP_SESSION_NOT_INITIALIZED');
  }
  return sessions[sessionIndex];
};

export const removeWbot = waPhoneUuid => {
  try {
    const sessionIndex = sessions.findIndex(s => s.uuid === waPhoneUuid);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].destroy();
      sessions.splice(sessionIndex, 1);
    }
  } catch (err) {
    logger.error(err);
  }
};
