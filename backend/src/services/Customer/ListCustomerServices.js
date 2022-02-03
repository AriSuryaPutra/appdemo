import { Customer, Role } from '../../models';
import { Op, Sequelize } from 'sequelize';

export const ListCustomerServices = async (page = '1', search = '', limit = '20', status = '') => {
  let whereCondition = {
    [Op.or]: [
      {
        '$customer.name$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('customer.name')), 'LIKE', `%${search.toLowerCase()}%`)
      }
    ]
  };

  if (status !== '') {
    whereCondition = {
      ...whereCondition,
      status: `${status}`
    };
  }

  const offset = +limit * (+page - 1);

  const { count, rows } = await Customer.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: Account,
        as: 'account' // prevents error "post isn't related to post"
      }
    ],
    limit: +limit,
    offset,
    order: [['created_at', 'desc']]
  });

  const hasMore = count > offset + rows.length;

  const response = {
    rows,
    count,
    hasMore
  };

  return response;
};

export default ListCustomerServices;
