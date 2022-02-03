import { getIO } from './socket';
import { logger } from './logger';
import { StartWaPhoneSession } from './wbotService';

const wbotMonitor = async (wbot, wa_phone) => {
  const io = getIO();
  const sessionName = wa_phone.name;

  try {
    wbot.on('change_state', async newState => {
      logger.info(`Monitor session: ${sessionName}, ${newState}`);
      try {
        await wa_phone.update({ status: newState });
      } catch (err) {
        logger.error(err);
      }

      io.emit('WaPhoneSessionSocket', {
        action: 'update',
        session: wa_phone
      });
    });

    wbot.on('change_battery', async batteryInfo => {
      const { battery, plugged } = batteryInfo;
      logger.info(`Battery session: ${sessionName} ${battery}% - Charging? ${plugged}`);

      try {
        await wa_phone.update({ battery, plugged });
      } catch (err) {
        logger.error(err);
      }

      io.emit('WaPhoneSessionSocket', {
        action: 'update',
        session: wa_phone
      });
    });

    wbot.on('disconnected', async reason => {
      logger.info(`Disconnected session: ${sessionName}, reason: ${reason}`);
      try {
        await wa_phone.update({ status: 'OPENING', session: '', qrcode: '' });
      } catch (err) {
        logger.error(err);
      }

      io.emit('WaPhoneSessionSocket', {
        action: 'update',
        session: wa_phone
      });

      setTimeout(() => StartWaPhoneSession(wa_phone), 2000);
    });
  } catch (err) {
    logger.error(err);
  }
};

export default wbotMonitor;
