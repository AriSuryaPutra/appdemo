import { getWbot } from '../libs/wbot';
import { PicConvert, WaPhone, Account } from '../models';
import agass from '../config/koneksi/agass.js';

export const successResponse = (req, res, message = 'Ok', data, code = 200, response_code = 'success') => {
  res.status(code).send({
    ...data,
    success: true,
    message,
    response_code
  });
};

export const errorResponse = (req, res, message = 'Something went wrong', code = 500, response_code = 'error', error) => {
  res.status(code).send({
    success: false,
    message,
    response_code,
    error
  });
};

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isEmpty = obj => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
};

export const validateFields = (object, fields) => {
  const errors = [];
  fields.forEach(f => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(', ')} are required fields.` : '';
};

export const uniqueId = (length = 13) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const GetDefaultWaPhone = async () => {
  try {
    const defaultWaPhone = await WaPhone.findOne({
      where: { is_default: true }
    });

    if (!defaultWaPhone) {
      throw new Error('ERROR_DEVICE_NOT_FOUND');
    }

    return defaultWaPhone;
  } catch (err) {
    throw new Error('ERROR_DEVICE_DEFAULT_NOT_FOUND');
  }
};

export const CheckIsValidContact = async number => {
  const defaultWhatsapp = await GetDefaultWaPhone();

  const wbot = getWbot(defaultWhatsapp.uuid);

  try {
    const isValidNumber = await wbot.isRegisteredUser(`${number}@c.us`);
    if (!isValidNumber) {
      throw new Error('ERROR_INVALID_NUMBER');
    }
  } catch (err) {
    if (err.message === 'invalidNumber') {
      throw new Error('ERROR_NUMBER_IS_NOT_REGISTERED');
    }
    throw new Error('ERROR_HELPER_CHECK_IS_VALID_NUMBER');
  }
};

export const GetProfilePicUrl = async number => {
  const defaultWhatsapp = await GetDefaultWaPhone();

  const wbot = getWbot(defaultWhatsapp.uuid);

  const profile_pic_url = await wbot.getProfilePicUrl(`${number}@c.us`);

  return profile_pic_url;
};

export const GetDetailCabang = async kdcab => {
  const cabang = await agass.query(
    `SELECT
        cab.NOCAB AS no_cab
        from cabang AS cab
        WHERE
        cab.KDCAB = :kdcab LIMIT 1`,
    {
      plain: true,
      replacements: {
        kdcab: kdcab
      },
      type: QueryTypes.SELECT
    }
  );

  return cabang;
};

export const ConvertInitialPic = async pic => {
  try {
    const result = await PicConvert.findOne({
      where: { initial: pic }
    });

    if (!result) {
      const response = {
        initial: pic,
        group: ''
      };
      return response;
    }

    const response = {
      initial: result.convert,
      group: result.group_pic
    };

    return response;
  } catch (err) {
    if (!result) {
      const response = {
        initial: '',
        group: ''
      };
      return response;
    }
  }
};

export const CheckAccountRegistered = async (email, username) => {
  let whereCondition = {};

  if (email) {
    whereCondition = {
      ...whereCondition,
      email: `${email}`
    };
  }

  whereCondition = {
    ...whereCondition,
    username: username
  };

  const account = await Account.findOne({
    where: whereCondition
  });

  if (account) {
    return true;
  } else {
    return false;
  }
};
