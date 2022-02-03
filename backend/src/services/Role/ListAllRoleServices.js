import { Sequelize, Op } from 'sequelize';
import { Role } from '../../models';

export const ListRoleServices = async ({ search = '' }) => {
  try {
    let whereCondition = {
      [Op.or]: [
        {
          '$role.name$': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('role.name')), 'LIKE', `%${search.toLowerCase()}%`)
        }
      ]
    };

    const { count, rows } = await Role.findAndCountAll({
      where: whereCondition,
      order: [['updated_at', 'asc']]
    });

    const response = {
      rows,
      count
    };

    return response;
  } catch (error) {
    return false;
  }
};

export default ListRoleServices;
