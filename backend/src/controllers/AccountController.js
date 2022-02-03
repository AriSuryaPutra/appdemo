import { successResponse, errorResponse } from '../helpers';
import { getIO } from '../libs/socket';
import { ListAccountServices, CreateAccountServices, ShowAccountServices, UpdateAccountServices, RemoveAccountServices } from '../services/Account';
import { AccountAuthServices } from '../services/Auth';

export const list = async (req, res) => {
  try {
    const response = await ListAccountServices(req.query);

    const io = getIO();
    io.emit('AccountSocket', {
      action: 'list',
      data: response
    });

    return successResponse(req, res, 'Success', response);
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const create = async (req, res) => {
  try {
    const response = await CreateAccountServices(req.body);
    if (response) {
      const io = getIO();
      io.emit('AccountSocket', {
        action: 'create',
        data: response
      });

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Account tidak dapat di daftarkan', 500);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const show = async (req, res) => {
  try {
    const { accountUuid } = req.params;

    const response = await ShowAccountServices(accountUuid);

    if (response) {
      const io = getIO();
      io.emit('AccountSocket', {
        action: 'show',
        id: accountUuid,
        data: response
      });

      return successResponse(req, res, 'Success', { account: response });
    } else {
      return errorResponse(req, res, 'Data tidak ditemukan', 500);
    }
  } catch (err) {
    return errorResponse(req, res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const { accountUuid } = req.params;

    const response = await UpdateAccountServices(accountUuid, req.body);

    if (response) {
      const io = getIO();
      io.emit('AccountSocket', {
        action: 'update',
        id: accountUuid,
        data: response
      });

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Data tidak ditemukan', 404);
    }
  } catch (err) {
    return errorResponse(req, res, err.message);
  }
};

export const remove = async (req, res) => {
  try {
    const { accountUuid } = req.params;

    const account = await AccountAuthServices(req);

    if (account.uuid !== accountUuid) {
      const response = await RemoveAccountServices(accountUuid);

      if (response) {
        const io = getIO();
        io.emit('AccountSocket', {
          action: 'remove',
          id: accountUuid,
          data: response
        });
      }

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Tidak dapat menghapus data', 500);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};
