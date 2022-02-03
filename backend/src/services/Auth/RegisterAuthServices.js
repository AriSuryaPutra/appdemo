import { Account, Role } from '../../models';
import { CheckAccountRegistered } from '../../helpers';
import local from '../../config/koneksi/local';

export const RegisterAuthServices = async form => {
  const { display_name, avatar, email, username, password, status, role_uuid } = form;

  const check = await CheckAccountRegistered(email, username);

  const role_user = await Role.findOne({
    where: { name: 'USER' }
  });

  if (check) {
    throw new Error('Username atau email sudah terdaftar');
  }

  const register = await local.transaction(async t => {
    const q = await Account.create(
      {
        display_name,
        email,
        username,
        avatar,
        password,
        status,
        role_uuid: role_uuid ? role_uuid : role_user.uuid
      },
      { transaction: t }
    );

    return q;
  });

  register.reload();

  return register;
};

export default RegisterAuthServices;
