import { Account, Role, Staff, Customer } from '../../models';
import { Op, Sequelize } from 'sequelize';

export const ListAccountServices = async ({ page = '1', search = '', limit = '20', status = '' }) => {
  let whereCondition = {
    [Op.or]: [
      {
        '$account.display_name$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('account.display_name')), 'LIKE', `%${search.toLowerCase()}%`)
      },
      {
        '$account.username$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('account.username')), 'LIKE', `%${search.toLowerCase()}%`)
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

  const { count, rows } = await Account.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: Customer,
        as: 'customer' // prevents error "post isn't related to post"
      },
      {
        model: Staff,
        as: 'staff' // prevents error "post isn't related to post"
      }
    ],
    limit: +limit,
    offset,
    order: [['created_at', 'desc']]
  });

  const hasMore = count > offset + rows.length;

  const filter = {
    search
  };

  const response = {
    rows,
    count,
    page: parseInt(page),
    limit: parseInt(limit),
    filter,
    hasMore
  };

  return response;
};

export default ListAccountServices;
