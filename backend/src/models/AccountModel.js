import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import local from '../config/koneksi/local.js';
const { DataTypes } = Sequelize;

// Define schema
const Account = local.define(
  'account',
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: function() {
        return uuidv4();
      }
    },
    display_name: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.VIRTUAL
    },
    password_hash: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    remember_token: {
      type: DataTypes.STRING
    },
    token_version: {
      type: DataTypes.NUMBER,
      defaultValue: 0
    },
    sum_point: {
      type: DataTypes.NUMBER,
      defaultValue: 0
    },
    role_uuid: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  },
  {
    freezeTableName: true,
    underscored: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
);
Account.beforeCreate(async (instance, options) => {
  if (instance.password) {
    const hashedPassword = await bcrypt.hashSync(instance.password, 8);
    instance.password_hash = hashedPassword;
  }
});
Account.beforeUpdate(async (instance, options) => {
  if (instance.password) {
    const hashedPassword = await bcrypt.hashSync(instance.password, 8);
    instance.password_hash = hashedPassword;
  }
});

export default Account;
