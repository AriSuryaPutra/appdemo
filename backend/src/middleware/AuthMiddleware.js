import { errorResponse } from '../helpers';
import { ShowAccountServices } from '../services/Account';
import authConfig from '../config/auth';

const AuthMiddleware = (role = [], permission = []) => async (req, res, next) => {
  const { jwt } = authConfig;
  let requiredRole = [...role, 'ADMIN'];
  let requiredPermissions = [...permission];

  const token = req.body.accessToken || req.query.accessToken || req.headers['authorization'];
  // decode token
  if (token) {
    const accessToken = JSON.stringify(token.replace(authConfig.type, ''));
    const parseAccessToken = JSON.parse(accessToken);
    const secretToken = process.env.JWT_SECRET || '';

    jwt.verify(parseAccessToken, secretToken, async (err, decoded) => {
      if (err) {
        if (err.message === 'jwt expired') {
          return errorResponse(req, res, 'expired', 401, 'auth_expired');
        }
        return errorResponse(req, res, 'Access token tidak valid', 401, 'error');
      }

      const account = await ShowAccountServices(decoded.uuid);

      const reqAccount = { ...account.get() };

      const checkRole = requiredRole.filter(q => q == reqAccount.role.name).length;
      const skipRole = requiredRole.filter(q => q == '*').length;

      if (checkRole < 1 && !skipRole) {
        return errorResponse(req, res, 'Anda tidak memiliki akses ke halaman ini', 403, 'error');
      }

      const initialPermission = reqAccount.role.permission.map(function(pr) {
        return pr.name;
      });

      const checkPermission = requiredPermissions.filter(p => initialPermission.indexOf(p) !== -1).length;
      const skipPermission = requiredPermissions.filter(q => q == '*').length;

      if (checkPermission < 1 && !skipPermission) {
        return errorResponse(req, res, 'Anda tidak memiliki akses ke halaman ini', 403, 'error');
      }

      req.account = decoded;
      next();
    });
  } else {
    return errorResponse(req, res, 'Anda tidak memiliki akses ke halaman ini', 403, 'error');
  }
};

export default AuthMiddleware;
