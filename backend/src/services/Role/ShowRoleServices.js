import { Role, Permission } from '../../models';

export const ShowRoleServices = async uuid => {
  const role = await Role.findByPk(uuid, {
    include: [
      {
        model: Permission,
        as: 'permission' // prevents error "post isn't related to post"
      }
    ]
  });

  if (role) {
    return role;
  } else {
    return false;
  }
};

export default ShowRoleServices;
