import { Account, Role, Permission } from '../../models';
import bcrypt from 'bcryptjs';
import CreateSessionServices from './CreateSessionServices';
import RefreshSessionServices from './RefreshSessionServices';

export const LoginAuthServices = async form => {
  const { username, password } = form;

  const account = await Account.findOne({
    where: { username },
    include: [
      {
        model: Role,
        required: true,
        as: 'role',
        include: [
          {
            model: Permission,
            as: 'permission' // prevents error "post isn't related to post"
          }
        ]
      }
    ]
  });

  if (!account) {
    throw new Error('Account tidak terdaftar');
  }

  const passwordIsValid = bcrypt.compareSync(password, account.password_hash);

  if (!passwordIsValid) {
    throw new Error('Password salah');
  }

  const accessToken = await CreateSessionServices(account);
  const refreshToken = await RefreshSessionServices(account);

  const response = { account, accessToken, refreshToken };

  return response;
};

export default LoginAuthServices;
