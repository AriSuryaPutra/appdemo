import { ShowAccountServices } from '../Account';
import { verify } from 'jsonwebtoken';
import local from '../../config/koneksi/local';
import authConfig from '../../config/auth';
import RefreshSessionServices from './RefreshSessionServices';
import CreateSessionServices from './CreateSessionServices';

export const RefreshAuthServices = async token => {
  const { refreshSecret } = authConfig;

  if (!token) {
    throw new Error('Cannot Refresh Token');
  }

  console.log('TOKEN LAMA ' + token);

  const decoded = verify(token, refreshSecret);

  const { uuid, token_version } = decoded;

  console.log(uuid);

  const account = await ShowAccountServices(uuid);

  if (account.token_version !== token_version) {
    throw new Error('Cannot Refresh Token');
  }

  const accountnew = await local.transaction(async t => {
    const q = await account.update(
      {
        token_version: account.token_version + 1
      },
      { transaction: t }
    );

    return q;
  });

  accountnew.reload();

  const accessToken = await CreateSessionServices(accountnew);
  const refreshToken = await RefreshSessionServices(accountnew);

  const response = { account: accountnew, accessToken, refreshToken };

  return response;
};

export default RefreshAuthServices;
