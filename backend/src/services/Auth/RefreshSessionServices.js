import { sign } from 'jsonwebtoken';
import authConfig from '../../config/auth';

export const RefreshSessionServices = auth => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  return sign({ uuid: auth.uuid, token_version: auth.token_version, role: auth.role }, refreshSecret, {
    expiresIn: refreshExpiresIn
  });
};

export default RefreshSessionServices;
