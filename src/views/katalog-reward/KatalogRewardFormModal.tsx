import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { KatalogReward } from './KatalogRewardList';

const schema = z.object({
  nama_reward: z.string().min(1, 'Nama reward wajib diisi'),
  deskripsi: z.string().min(1, 'Deskripsi wajib diisi'),
  poin_diperlukan: z.coerce.number().min(1, 'Poin diperlukan wajib diisi'),
  jumlah_tersedia: z.coerce.number().min(0, 'Jumlah tersedia tidak boleh negatif'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  katalogReward: KatalogReward | null;
}

const KatalogRewardFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, katalogReward }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (katalogReward) {
      setValue('nama_reward', katalogReward.nama_reward);
      setValue('deskripsi', katalogReward.deskripsi);
      setValue('poin_diperlukan', katalogReward.poin_diperlukan);
      setValue('jumlah_tersedia', katalogReward.jumlah_tersedia);
    } else {
      reset();
    }
  }, [katalogReward, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (katalogReward) {
        await api.put(`/katalog-reward/${katalogReward.id}`, data);
      } else {
        await api.post('/katalog-reward', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save katalog reward', error);
      alert('Gagal menyimpan data katalog reward');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {katalogReward ? 'Edit Katalog Reward' : 'Tambah Katalog Reward'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label htmlFor="nama_reward" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Reward <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_reward"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nama_reward ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: Voucher Makan"
              {...register('nama_reward')}
            />
            {errors.nama_reward && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_reward.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="deskripsi"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.deskripsi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan deskripsi reward"
              rows={3}
              {...register('deskripsi')}
            />
            {errors.deskripsi && (
              <p className="mt-1 text-sm text-red-500">{errors.deskripsi.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="poin_diperlukan" className="block text-sm font-medium text-gray-700 mb-1">
                Poin Diperlukan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="poin_diperlukan"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.poin_diperlukan ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contoh: 100"
                {...register('poin_diperlukan')}
              />
              {errors.poin_diperlukan && (
                <p className="mt-1 text-sm text-red-500">{errors.poin_diperlukan.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="jumlah_tersedia" className="block text-sm font-medium text-gray-700 mb-1">
                Stok Tersedia <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="jumlah_tersedia"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.jumlah_tersedia ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contoh: 50"
                {...register('jumlah_tersedia')}
              />
              {errors.jumlah_tersedia && (
                <p className="mt-1 text-sm text-red-500">{errors.jumlah_tersedia.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {katalogReward ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KatalogRewardFormModal;
