import local from '../../config/koneksi/local';
import ShowCustomerServices from './ShowCustomerServices';

export const RemoveCustomerServices = async uuid => {
  const cusomer = await ShowCustomerServices(uuid);

  let response = {};

  if (cusomer) {
    await local.transaction(async t => {
      const q = await cusomer.destroy({ transaction: t });

      return q;
    });

    response = { cusomer: {}, message: 'Customer berhasil dihapus' };
  } else {
    response = { cusomer: {}, message: 'Customer Gagal dihapus' };
  }

  return response;
};

export default RemoveCustomerServices;
