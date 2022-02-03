import { ShowPermissionServices } from '../Permission';
import local from '../../config/koneksi/local';
import ShowRoleServices from './ShowRoleServices';

export const AddPermissionRoleServices = async (uuid, form) => {
  const role = await ShowRoleServices(uuid);
  const { permission_uuid } = form;

  if (role) {
    permission_uuid.forEach(async (item, index) => {
      await local.transaction(async t => {
        const permission = await ShowPermissionServices(item);
        await role.addPermission(permission, { through: { selfGranted: false }, transaction: t });
      });
    });

    return true;
  } else {
    return false;
  }
};

export default AddPermissionRoleServices;
