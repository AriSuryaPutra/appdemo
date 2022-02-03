import local from '../../config/koneksi/local';
import { Permission } from '../../models';

export const CreatePermissionServices = async form => {
  const { permission_nama, permission_deskripsi } = form;

  const permission = await local.transaction(async t => {
    const q = await Permission.create(
      {
        nama: permission_nama,
        deskripsi: permission_deskripsi
      },
      { transaction: t }
    );

    return q;
  });

  permission.reload();

  return permission;
};

export default CreatePermissionServices;
