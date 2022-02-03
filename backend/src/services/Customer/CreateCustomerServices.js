import { Customer } from '../../models';
import { CheckCustomerRegistered } from '../../helpers';
import local from '../../config/koneksi/local';
import { ShowCustomerServices } from '.';

export const CreateCustomerServices = async form => {
  const { name, alamat, kelurahan, kecamatan, kabupaten, contact_person, no_hp, status, account_uuid } = form;

  const customer = await local.transaction(async t => {
    const q = await Customer.create(
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

  customer.reload();

  const customer_new = await ShowCustomerServices(customer.uuid);

  const response = { customer: customer_new, message: 'Customer berhasil ditambahkan' };

  return response;
};

export default CreateCustomerServices;
