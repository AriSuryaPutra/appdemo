import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

export const createAccessToken = user => {
  const { secret, expiresIn } = authConfig;

  return sign({ usarname: user.username, uuid: user.uuid, level: user.level }, secret, {
    expiresIn
  });
};

export const createRefreshToken = user => {
  const { refreshSecret, refreshExpiresIn } = authConfig;

  return sign({ uuid: user.uuid, token_version: user.token_version, level: user.level }, refreshSecret, {
    expiresIn: refreshExpiresIn
  });
};
