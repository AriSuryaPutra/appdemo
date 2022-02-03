import { Customer, Account, Role } from '../../models';

export const ShowCustomerServices = async uuid => {
  const customer = await Customer.findByPk(uuid, {
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

  if (customer) {
    return customer;
  } else {
    return false;
  }
};

export default ShowCustomerServices;
