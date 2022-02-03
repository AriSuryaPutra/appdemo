import local from '../../config/koneksi/local';
import ShowRoleServices from './ShowRoleServices';

export const UpdateRoleServices = async (uuid, form) => {
  const role = await ShowRoleServices(uuid);
  const { role_nama, role_deskripsi } = form;

  if (role) {
    const response = await local.transaction(async t => {
      const q = await role.update(
        {
          nama: role_nama,
          deskripsi: role_deskripsi
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

export default UpdateRoleServices;
