import { Staff, Account, Role } from '../../models';

export const ShowStaffServices = async uuid => {
  const staff = await Staff.findByPk(uuid, {
    include: [
      {
        model: Account,
        required: true,
        as: 'account',
        include: [
          {
            model: Role,
            as: 'role' // prevents error "post isn't related to post"
          }
        ]
      }
    ]
  });

  if (staff) {
    return staff;
  } else {
    return false;
  }
};

export default ShowStaffServices;
