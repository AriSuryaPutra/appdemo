import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { logger } from './src/utils/logger';

//Route
import AppRoute from './src/routes/AppRoute';
import ApiRoute from './src/routes/ApiRoute';

import errorHandler from './src/middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
  })
);
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', AppRoute);
app.use('/api', ApiRoute);
//app.use('/api/admin', AuthMiddleware, adminMiddleware, adminRoutes);
app.use(errorHandler);

module.exports = app;
