import local from '../../config/koneksi/local';
import ShowPermissionServices from './ShowPermissionServices';

export const RemovePermissionServices = async uuid => {
  const permission = await ShowPermissionServices(uuid);

  if (permission) {
    await local.transaction(async t => {
      const q = await permission.destroy({ transaction: t });

      return q;
    });

    return true;
  } else {
    return false;
  }
};

export default RemovePermissionServices;
