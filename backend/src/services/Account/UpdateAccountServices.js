import local from '../../config/koneksi/local';
import { ShowAccountServices } from './ShowAccountServices';

export const UpdateAccountServices = async (uuid, form) => {
  const { display_name, avatar, email, username, password, status, role_uuid } = form;

  const account = await ShowAccountServices(uuid);
  const update = await local.transaction(async t => {
    const q = await account.update(
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

  update.reload();

  const account_new = await ShowAccountServices(update.uuid);

  const response = { account: account_new, message: 'Account berhasil diupdate' };

  return response;
};

export default UpdateAccountServices;
