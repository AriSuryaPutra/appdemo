import { Account } from '../../models';
import { CheckAccountRegistered } from '../../helpers';
import local from '../../config/koneksi/local';
import { ShowAccountServices } from './ShowAccountServices';

export const CreateUserServices = async form => {
  const { display_name, avatar, email, username, password, status, role_uuid } = form;

  const check = await CheckAccountRegistered(email, username);

  if (check) {
    return false;
  } else {
    const account = await local.transaction(async t => {
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

    account.reload();

    const account_new = await ShowAccountServices(account.uuid);

    const response = { account: account_new, message: 'Account berhasil ditambahkan' };

    return response;
  }
};

export default CreateUserServices;
