import { successResponse, errorResponse } from '../helpers';
import { getIO } from '../libs/socket';
import {
  ListCustomerServices,
  CreateCustomerServices,
  ShowCustomerServices,
  UpdateCustomerServices,
  RemoveCustomerServices,
  OptionRoleCustomerServices
} from '../services/Customer';
import { AccountAuthServices } from '../services/Auth';

export const list = async (req, res) => {
  try {
    const response = await ListCustomerServices(req.query);

    const io = getIO();
    io.emit('CustomerSocket', {
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
    const response = await CreateCustomerServices(req.body);
    if (response) {
      const io = getIO();
      io.emit('CustomerSocket', {
        action: 'create',
        data: response
      });

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'User tidak dapat di daftarkan', 403);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const show = async (req, res) => {
  try {
    const { customerUuid } = req.params;

    const response = await ShowCustomerServices(customerUuid);

    if (response) {
      const io = getIO();
      io.emit('CustomerSocket', {
        action: 'show',
        id: customerUuid,
        data: response
      });

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Data tidak ditemukan', 404);
    }
  } catch (err) {
    return errorResponse(req, res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const { customerUuid } = req.params;

    const response = await UpdateCustomerServices(customerUuid, req.body);

    if (response) {
      const io = getIO();
      io.emit('CustomerSocket', {
        action: 'update',
        id: customerUuid,
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
    const accessToken = req.cookies.jat;

    const { customerUuid } = req.params;

    const auth = await AccountAuthServices(accessToken);

    if (auth.user.uuid !== customerUuid) {
      const response = await RemoveUserServices(customerUuid);

      if (response) {
        const io = getIO();
        io.emit('UserSocket', {
          action: 'remove',
          id: customerUuid,
          data: response
        });
      }

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Tidak dapat menghapus user', 403);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const option_role = async (req, res) => {
  try {
    const { role } = req.body;

    const response = await OptionRoleUserServices(role);

    const io = getIO();
    io.emit('UserSocket', {
      action: 'option_role',
      data: response
    });

    return successResponse(req, res, 'Success', response);
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};
