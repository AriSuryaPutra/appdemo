import { Sequelize, Op } from 'sequelize';
import { Permission } from '../../models';

export const ListPermissionServices = async (page = '1', search = '', limit = '20') => {
  try {
    let whereCondition = {
      [Op.or]: [
        {
          '$permission.nama$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('permission.nama')), 'LIKE', `%${search.toLowerCase()}%`)
        }
      ]
    };

    const offset = +limit * (+page - 1);

    const { count, rows } = await Permission.findAndCountAll({
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

export default ListPermissionServices;
