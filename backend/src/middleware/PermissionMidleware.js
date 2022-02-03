export const PermissionMidleware = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    Permission.findOne({
      where: {
        nama: permissionNama
      }
    })
      .then(res => {
        RolePermission.findOne({
          where: {
            role_uuid: roleUuid,
            permission_uuid: res.uuid
          }
        })
          .then(rolePermission => {
            if (rolePermission) {
              return next();
            } else {
              reject({ message: 'Forbidden' });
            }
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(() => {
        return errorResponse(req, res, 'Token sudah kadaluarsa silahkan login kembali', 401);
      });
  });
};
