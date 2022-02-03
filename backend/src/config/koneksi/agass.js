// import sequelize
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const agass = new Sequelize('workshop', 'shangchi', 'Wh5q}zY7Y/p^v5&8', {
  host: process.env.SERVERNYA === 'local' ? '172.16.3.16' : '202.77.105.107',
  dialect: 'mysql',
  logging: true,
  timezone: '+00:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000000,
    idle: 10000
  },
  dialectOptions: {
    decimalNumbers: true
  }
});

export default agass;
