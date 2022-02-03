import { successResponse, errorResponse } from '../helpers';
import { getIO } from '../libs/socket';
import {
  ListAllRoleServices,
  ListRoleServices,
  CreateRoleServices,
  ShowRoleServices,
  UpdateRoleServices,
  RemoveRoleServices,
  AddPermissionRoleServices
} from '../services/Role';

export const listAll = async (req, res) => {
  try {
    const response = await ListAllRoleServices(req.query);

    const io = getIO();
    io.emit('RoleSocket', {
      action: 'listAll',
      data: response
    });

    return successResponse(req, res, 'Success', response);
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const list = async (req, res) => {
  try {
    const response = await ListRoleServices(req.query);

    const io = getIO();
    io.emit('RoleSocket', {
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
    const response = await CreateRoleServices(req.body);
    if (response) {
      const io = getIO();
      io.emit('RoleSocket', {
        action: 'create',
        data: response
      });

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Role tidak dapat di daftarkan', 500);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const show = async (req, res) => {
  try {
    const { roleUuid } = req.params;

    const response = await ShowRoleServices(roleUuid);

    if (response) {
      const io = getIO();
      io.emit('RoleSocket', {
        action: 'show',
        id: roleUuid,
        data: response
      });

      return successResponse(req, res, 'Success', { role: response });
    } else {
      return errorResponse(req, res, 'Data tidak ditemukan', 500);
    }
  } catch (err) {
    return errorResponse(req, res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const { roleUuid } = req.params;

    const response = await UpdateRoleServices(roleUuid, req.body);

    if (response) {
      const io = getIO();
      io.emit('RoleSocket', {
        action: 'update',
        id: roleUuid,
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
    const { roleUuid } = req.params;

    const response = await RemoveRoleServices(roleUuid);

    if (response) {
      const io = getIO();
      io.emit('RoleSocket', {
        action: 'remove',
        id: roleUuid,
        data: response
      });
    }

    return successResponse(req, res, 'Success', response);
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const add_permission = async (req, res) => {
  try {
    const { roleUuid } = req.params;
    const { permission_uuid = [] } = req.body;

    const response = await AddPermissionRoleServices(roleUuid, { permission_uuid });

    const io = getIO();
    io.emit('RoleSocket', {
      action: 'add_permission',
      data: response
    });

    return successResponse(req, res, response);
  } catch (err) {
    return errorResponse(req, res, error.message, 500);
  }
};
