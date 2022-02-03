import { Staff } from '../../models';

import local from '../../config/koneksi/local';
import { ShowStaffServices } from '.';

export const CreateStaffServices = async form => {
  const { name, no_hp, initial, kdcab, status, account_uuid } = form;

  const staff = await local.transaction(async t => {
    const q = await Staff.create(
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

  staff.reload();

  const staff_new = await ShowStaffServices(staff.uuid);

  const response = { staff: staff_new, message: 'Staff berhasil ditambahkan' };

  return response;
};

export default CreateStaffServices;
