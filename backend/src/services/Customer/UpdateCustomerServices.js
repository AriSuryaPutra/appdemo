import local from '../../config/koneksi/local';
import { ShowCustomerServices } from './ShowCustomerServices';

export const UpdateCustomerServices = async (uuid, form) => {
  const { name, alamat, kelurahan, kecamatan, kabupaten, contact_person, no_hp, status, account_uuid } = form;

  const customer = await ShowCustomerServices(uuid);
  const update = await local.transaction(async t => {
    const q = await customer.update(
      {
        name,
        alamat,
        kelurahan,
        kecamatan,
        kabupaten,
        contact_person,
        no_hp,
        status,
        account_uuid
      },
      { transaction: t }
    );

    return q;
  });

  update.reload();

  const customer_new = await ShowCustomerServices(update.uuid);

  const response = { customer: customer_new, message: 'Customer berhasil diupdate' };

  return response;
};

export default UpdateCustomerServices;
