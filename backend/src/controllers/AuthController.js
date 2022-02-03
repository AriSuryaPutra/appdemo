import { successResponse, errorResponse } from '../helpers';
import { RegisterAuthServices, LoginAuthServices, RefreshAuthServices, AccountAuthServices } from '../services/Auth';
import { getIO } from '../libs/socket';
import authConfig from '../config/auth';

export const register = async (req, res) => {
  try {
    const response = await RegisterAuthServices(req.body);

    if (response) {
      const io = getIO();
      io.emit('AuthSocket', {
        action: 'register',
        data: response
      });

      return successResponse(req, res, 'Success Register', response);
    } else {
      throw new Error('Tidak dapat melakukan registrasi');
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 401);
  }
};

export const login = async (req, res) => {
  try {
    const response = await LoginAuthServices(req.body);

    const io = getIO();
    io.emit('AuthSocket', {
      action: 'login',
      data: response
    });

    return successResponse(req, res, 'Success Login', response);
  } catch (error) {
    return errorResponse(req, res, error.message, 401);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const response = await RefreshAuthServices(refreshToken);

    const io = getIO();
    io.emit('AuthSocket', {
      action: 'refresh',
      data: response
    });

    return successResponse(req, res, 'Success Refresh', response);
  } catch (error) {
    return errorResponse(req, res, error.message, 401, 'auth_cannot_refresh');
  }
};

export const account = async (req, res) => {
  try {
    const response = await AccountAuthServices(req);

    const io = getIO();
    io.emit('AuthSocket', {
      action: 'account',
      data: response
    });

    return successResponse(req, res, 'Success', { account: response });
  } catch (error) {
    return errorResponse(req, res, error.message, 401);
  }
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  try {
    return successResponse(req, res, 'Success logout');
  } catch (error) {
    return errorResponse(req, res, error.message, 401);
  }
};
