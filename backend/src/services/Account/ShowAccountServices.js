import { Account, Role, Permission } from '../../models';

export const ShowAccountServices = async uuid => {
  const account = await Account.findOne({
    where: { uuid },
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

  return account;
};

export default ShowAccountServices;
