import local from '../../config/koneksi/local';
import ShowStaffServices from './ShowStaffServices';

export const RemoveStaffServices = async uuid => {
  const staff = await ShowStaffServices(uuid);

  let response = {};

  if (staff) {
    await local.transaction(async t => {
      const q = await staff.destroy({ transaction: t });

      return q;
    });

    response = { staff: {}, message: 'Staff berhasil dihapus' };
  } else {
    response = { staff: {}, message: 'Staff Gagal dihapus' };
  }

  return response;
};

export default RemoveStaffServices;
