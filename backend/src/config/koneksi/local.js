// import sequelize
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const local = new Sequelize('send_report', 'root_crs', 'Arisp123', {
  host: process.env.SERVERNYA === 'local' ? '172.16.3.4' : '202.77.105.102',
  dialect: 'mysql',
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000000,
    idle: 10000
  }
});

// const local = new Sequelize('safe-x', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging: true,
//   timezone: '+08:00',
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000000,
//     idle: 10000
//   }
// });

export default local;
