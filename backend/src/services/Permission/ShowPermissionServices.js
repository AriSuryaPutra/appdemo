import { Permission } from '../../models';

export const ShowPermissionServices = async uuid => {
  const permission = await Permission.findByPk(uuid);

  if (permission) {
    return permission;
  } else {
    return false;
  }
};

export default ShowPermissionServices;
