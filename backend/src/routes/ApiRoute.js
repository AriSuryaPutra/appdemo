import express from 'express';
import validate from 'express-validation';
import { upload } from '../config/upload';

import { AuthMiddleware as CheckAuth } from '../middleware';

import * as StaffController from '../controllers/StaffController';
import * as CustomerController from '../controllers/CustomerController';
import * as AccountController from '../controllers/AccountController';
import * as AuthController from '../controllers/AuthController';
import * as RoleController from '../controllers/RoleController';
import * as PermissionController from '../controllers/PermissionController';

import * as AuthValidator from '../validators/AuthValidator';
import * as AccountValidator from '../validators/AccountValidator';
import * as StaffValidator from '../validators/StaffValidator';
import * as RoleValidator from '../validators/RoleValidator';
import * as PermissionValidator from '../validators/PermissionValidator';

const router = express.Router();

//Auth Route
router.post('/auth/login', validate(AuthValidator.login), AuthController.login);
router.post('/auth/register', validate(AuthValidator.register), AuthController.register);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/account', [CheckAuth(['USER', 'STAFF'], ['*'])], AuthController.account);
router.delete('/auth/logout', AuthController.logout);

//Account Route
router.get('/account/list', [CheckAuth(['*'], ['*'])], AccountController.list);
router.post('/account/create', [validate(AccountValidator.create)], AccountController.create);
router.put('/account/update/:accountUuid', [validate(AccountValidator.update)], AccountController.update);
router.get('/account/show/:accountUuid', AccountController.show);
router.delete('/account/remove/:accountUuid', [CheckAuth(['USER', 'STAFF'], ['*'])], AccountController.remove);

//Staff Route
router.get('/staff/list', [CheckAuth(['*'], ['*'])], StaffController.list);
router.post('/staff/create', [validate(StaffValidator.create)], StaffController.create);
router.put('/staff/update/:staffUuid', [validate(StaffValidator.update)], StaffController.update);
router.get('/staff/show/:staffUuid', StaffController.show);
router.delete('/staff/remove/:staffUuid', [CheckAuth(['USER', 'STAFF'], ['*'])], StaffController.remove);

//Role Route
router.get('/role/list/all', RoleController.listAll);
router.get('/role/list', RoleController.list);
router.post('/role/create', [validate(RoleValidator.create)], RoleController.create);
router.put('/role/update/:roleUuid', [validate(RoleValidator.update)], RoleController.update);
router.put('/role/add-permission/:roleUuid', [validate(RoleValidator.add_permission)], RoleController.add_permission);
router.get('/role/show/:roleUuid', RoleController.show);
router.delete('/role/remove/:roleUuid', RoleController.remove);

//Permission Route
router.get('/permission/index', PermissionController.index);
router.post('/permission/create', [validate(PermissionValidator.create)], PermissionController.create);
router.put('/permission/update/:permissionUuid', [validate(PermissionValidator.update)], PermissionController.update);
router.get('/permission/show/:permissionUuid', PermissionController.show);
router.delete('/permission/remove/:permissionUuid', PermissionController.remove);

module.exports = router;
