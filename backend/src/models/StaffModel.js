import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import local from '../config/koneksi/local.js';
const { DataTypes } = Sequelize;

// Define schema
const Staff = local.define(
  'staff',
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {
        return uuidv4();
      }
    },
    name: {
      type: DataTypes.STRING
    },
    no_hp: {
      type: DataTypes.STRING
    },
    initial: {
      type: DataTypes.STRING
    },
    kdcab: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    account_uuid: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    }
  },
  {
    freezeTableName: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Staff;
