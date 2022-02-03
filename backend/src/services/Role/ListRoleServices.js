import { Sequelize, Op } from 'sequelize';
import { Role } from '../../models';

export const ListRoleServices = async ({ page = '1', search = '', limit = '20' }) => {
  try {
    let whereCondition = {
      [Op.or]: [
        {
          '$role.name$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('role.name')), 'LIKE', `%${search.toLowerCase()}%`)
        }
      ]
    };

    const offset = +limit * (+page - 1);

    const { count, rows } = await Role.findAndCountAll({
      where: whereCondition,
      limit: +limit,
      offset,
      order: [['updated_at', 'asc']]
    });

    const hasMore = count > offset + rows.length;

    const response = {
      rows,
      count,
      hasMore
    };

    return response;
  } catch (error) {
    return false;
  }
};

export default ListRoleServices;
