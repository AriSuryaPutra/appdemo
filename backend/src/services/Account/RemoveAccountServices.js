import local from '../../config/koneksi/local';
import ShowAccountServices from './ShowAccountServices';

export const RemoveAccountServices = async uuid => {
  const account = await ShowAccountServices(uuid);

  if (!account) {
    throw new Error('Tidak dapat menghapus data');
  }

  await local.transaction(async t => {
    const q = await account.destroy({ transaction: t });

    return q;
  });

  return { account };
};

export default RemoveAccountServices;
