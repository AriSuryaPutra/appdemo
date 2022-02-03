import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import local from '../config/koneksi/local.js';
const { DataTypes } = Sequelize;

// Define schema
const RolePermission = local.define(
  'role_permission',
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {
        return uuidv4();
      }
    },
    role_uuid: {
      type: DataTypes.STRING
    },
    permission_uuid: {
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true,
    underscored: true,
    timestamps: false
  }
);

export default RolePermission;
