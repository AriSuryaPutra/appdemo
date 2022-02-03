import local from '../../config/koneksi/local';
import ShowRoleServices from './ShowRoleServices';

export const RemoveRoleServices = async uuid => {
  const role = await ShowRoleServices(uuid);

  if (role) {
    await local.transaction(async t => {
      const q = await role.destroy({ transaction: t });

      return q;
    });

    return true;
  } else {
    return false;
  }
};

export default RemoveRoleServices;
