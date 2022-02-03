import { Staff, Account } from '../../models';
import { Op, Sequelize } from 'sequelize';

export const ListStaffServices = async (page = '1', search = '', kdcab = '', limit = '20', status = '') => {
  let whereCondition = {
    [Op.or]: [
      {
        '$staff.name$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('staff.name')), 'LIKE', `%${search.toLowerCase()}%`)
      }
    ]
  };

  if (status !== '') {
    whereCondition = {
      ...whereCondition,
      status: `${status}`
    };
  }

  if (kdcab !== '') {
    whereCondition = {
      ...whereCondition,
      kdcab: `${kdcab}`
    };
  }

  const offset = +limit * (+page - 1);

  const { count, rows } = await Staff.findAndCountAll({
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

export default ListStaffServices;
