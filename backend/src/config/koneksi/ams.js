// import sequelize
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const ams = new Sequelize('pastibis_pastibisa', 'naruto', 'w0nd3rw0m4n', {
  host: process.env.SERVERNYA === 'local' ? '172.16.3.4' : '202.77.105.102',
  dialect: 'mysql',
  logging: true,
  timezone: '+08:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000000,
    idle: 10000
  }
});

export default ams;
