import { errorResponse, successResponse } from '../helpers';
import { getIO } from '../libs/socket';
import {
  ListPermissionServices,
  CreatePermissionServices,
  ShowPermissionServices,
  UpdatePermissionServices,
  RemovePermissionServices
} from '../services/Permission';

export const index = async (req, res) => {
  try {
    const { page, search, limit } = req.body;

    const response = await ListPermissionServices(page, search, limit);

    const io = getIO();
    io.emit('PermissionSocket', {
      action: 'index',
      data: response
    });

    return successResponse(req, res, response);
  } catch (err) {
    return errorResponse(req, res, { code: 'PERMISSION001', message: error.message }, 500);
  }
};

export const create = async (req, res) => {
  try {
    const { permission_nama, permission_deskripsi } = req.body;

    const response = await CreatePermissionServices({ permission_nama, permission_deskripsi });

    const io = getIO();
    io.emit('PermissionSocket', {
      action: 'create',
      data: response
    });

    return successResponse(req, res, response);
  } catch (err) {
    return errorResponse(req, res, { code: 'PERMISSION001', message: error.message }, 500);
  }
};
export const update = async (req, res) => {
  try {
    const { permissionUuid } = req.params;
    const { permission_nama, permission_deskripsi } = req.body;

    const response = await UpdatePermissionServices(permissionUuid, { permission_nama, permission_deskripsi });

    if (response) {
      const io = getIO();
      io.emit('PermissionSocket', {
        action: 'update',
        data: response
      });

      return successResponse(req, res, response);
    } else {
      throw new Error('Data tidak ditemukan');
    }
  } catch (err) {
    return errorResponse(req, res, { code: 'PERMISSION001', message: error.message }, 500);
  }
};
export const show = async (req, res) => {
  try {
    const { permissionUuid } = req.params;

    const response = await ShowPermissionServices(permissionUuid);

    if (response) {
      const io = getIO();
      io.emit('PermissionSocket', {
        action: 'show',
        id: permissionUuid,
        data: response
      });

      return successResponse(req, res, response);
    } else {
      throw new Error('Data tidak ditemukan');
    }
  } catch (err) {
    return errorResponse(req, res, { code: 'PERMISSION001', message: error.message }, 500);
  }
};
export const remove = async (req, res) => {
  try {
    const { permissionUuid } = req.params;

    const response = await RemovePermissionServices(permissionUuid);

    if (response) {
      const io = getIO();
      io.emit('PermissionSocket', {
        action: 'remove',
        id: permissionUuid,
        data: response
      });

      return successResponse(req, res, response);
    } else {
      throw new Error('Data tidak ditemukan');
    }
  } catch (err) {
    return errorResponse(req, res, { code: 'PERMISSION001', message: error.message }, 500);
  }
};
