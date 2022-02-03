import Account from './AccountModel';
import Staff from './StaffModel';
import Customer from './CustomerModel';
import Role from './RoleModel';
import Permission from './PermissionModel';
import RolePermission from './RolePermissionModel';

Account.hasOne(Staff, { as: 'staff', foreignKey: 'account_uuid' });
Staff.belongsTo(Account);

Account.hasOne(Customer, { as: 'customer', foreignKey: 'account_uuid' });
Customer.belongsTo(Account);

Account.belongsTo(Role, {
  foreignKey: 'role_uuid',
  as: 'role'
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  as: 'permission',
  foreignKey: 'role_uuid'
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  as: 'role',
  foreignKey: 'permission_uuid'
});

export { Account, Staff, Customer, Role, Permission };
