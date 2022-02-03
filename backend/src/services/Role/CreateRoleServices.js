import local from '../../config/koneksi/local';
import { Role } from '../../models';

export const CreateRoleServices = async form => {
  const { name, deskripsi } = form;

  const role = await local.transaction(async t => {
    const q = await Role.create(
      {
        name,
        deskripsi
      },
      { transaction: t }
    );

    return q;
  });

  role.reload();

  return role;
};

export default CreateRoleServices;
