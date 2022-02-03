import { sign } from 'jsonwebtoken';
import authConfig from '../../config/auth';

export const CreateSessionServices = auth => {
  const { secret, expiresIn } = authConfig;

  return sign({ usarname: auth.username, uuid: auth.uuid, token_version: auth.token_version, role: auth.role }, secret, {
    expiresIn
  });
};

export default CreateSessionServices;
