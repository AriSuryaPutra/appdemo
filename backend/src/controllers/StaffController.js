import { successResponse, errorResponse } from '../helpers';
import { getIO } from '../libs/socket';
import { ListStaffServices, CreateStaffServices, ShowStaffServices, UpdateStaffServices, RemoveStaffServices } from '../services/Staff';
import { StaffAuthServices } from '../services/Auth';

export const list = async (req, res) => {
  try {
    const response = await ListStaffServices(req.query);

    const io = getIO();
    io.emit('StaffSocket', {
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
    const response = await CreateStaffServices(req.body);
    if (response) {
      const io = getIO();
      io.emit('StaffSocket', {
        action: 'create',
        data: response
      });

      return successResponse(req, res, 'Success', response);
    } else {
      return errorResponse(req, res, 'Staff tidak dapat di daftarkan', 500);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500);
  }
};

export const show = async (req, res) => {
  try {
    const { staffUuid } = req.params;

    const response = await ShowStaffServices(staffUuid);

    if (response) {
      const io = getIO();
      io.emit('StaffSocket', {
        action: 'show',
        id: staffUuid,
        data: response
      });

      return successResponse(req, res, 'Success', { staff: response });
    } else {
      return errorResponse(req, res, 'Data tidak ditemukan', 500);
    }
  } catch (err) {
    return errorResponse(req, res, err.message, 500);
  }
};

export const update = async (req, res) => {
  try {
    const { staffUuid } = req.params;

    const response = await UpdateStaffServices(staffUuid, req.body);

    if (response) {
      const io = getIO();
      io.emit('StaffSocket', {
        action: 'update',
        id: staffUuid,
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
    const { staffUuid } = req.params;

    const staff = await StaffAuthServices(req);

    if (staff.uuid !== staffUuid) {
      const response = await RemoveStaffServices(staffUuid);

      if (response) {
        const io = getIO();
        io.emit('StaffSocket', {
          action: 'remove',
          id: staffUuid,
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
