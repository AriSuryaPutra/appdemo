import local from '../../config/koneksi/local';
import { ShowStaffServices } from './ShowStaffServices';

export const UpdateStaffServices = async (uuid, form) => {
  const { name, no_hp, initial, kdcab, status, account_uuid } = form;

  const staff = await ShowStaffServices(uuid);
  const update = await local.transaction(async t => {
    const q = await staff.update(
      {
        name,
        no_hp,
        initial,
        kdcab,
        status,
        account_uuid
      },
      { transaction: t }
    );

    return q;
  });

  update.reload();

  const staff_new = await ShowStaffServices(update.uuid);

  const response = { staff: staff_new, message: 'Staff berhasil diupdate' };

  return response;
};

export default UpdateStaffServices;
