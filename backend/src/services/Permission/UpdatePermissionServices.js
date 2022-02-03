import local from '../../config/koneksi/local';
import ShowPermissionServices from './ShowPermissionServices';

export const UpdatePermissionServices = async (uuid, form) => {
  const permission = await ShowPermissionServices(uuid);
  const { permission_nama, permission_deskripsi } = form;

  if (permission) {
    const response = await local.transaction(async t => {
      const q = await permission.update(
        {
          nama: permission_nama,
          deskripsi: permission_deskripsi
        },
        { transaction: t }
      );

      return q;
    });

    response.reload();

    return response;
  } else {
    return false;
  }
};

export default UpdatePermissionServices;
