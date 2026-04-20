import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { AturanPoin } from './AturanPoinList';

const schema = z.object({
  tipe_poin: z.enum(['reward', 'hukuman'], { required_error: 'Tipe poin wajib diisi' }),
  nama_aturan: z.string().min(1, 'Nama aturan wajib diisi'),
  nilai_poin: z.coerce.number().min(1, 'Nilai poin wajib diisi'),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  aturanPoin: AturanPoin | null;
}

const AturanPoinFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, aturanPoin }) => {
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
    if (aturanPoin) {
      setValue('tipe_poin', aturanPoin.tipe_poin as 'reward' | 'hukuman');
      setValue('nama_aturan', aturanPoin.nama_aturan);
      setValue('nilai_poin', aturanPoin.nilai_poin);
      setValue('keterangan', aturanPoin.keterangan || '');
    } else {
      reset();
    }
  }, [aturanPoin, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (aturanPoin) {
        await api.put(`/aturan-poin/${aturanPoin.id}`, data);
      } else {
        await api.post('/aturan-poin', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save aturan poin', error);
      alert('Gagal menyimpan data aturan poin');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {aturanPoin ? 'Edit Aturan Poin' : 'Tambah Aturan Poin'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5">
          <div className="mb-5">
            <label htmlFor="tipe_poin" className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Poin <span className="text-red-500">*</span>
            </label>
            <select
              id="tipe_poin"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.tipe_poin ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('tipe_poin')}
            >
              <option value="">Pilih Tipe Poin</option>
              <option value="reward">Reward</option>
              <option value="hukuman">Hukuman</option>
            </select>
            {errors.tipe_poin && (
              <p className="mt-1 text-sm text-red-500">{errors.tipe_poin.message}</p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="nama_aturan" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Aturan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_aturan"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nama_aturan ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: Hadir Tepat Waktu"
              {...register('nama_aturan')}
            />
            {errors.nama_aturan && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_aturan.message}</p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="nilai_poin" className="block text-sm font-medium text-gray-700 mb-1">
              Nilai Poin <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="nilai_poin"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nilai_poin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: 10"
              {...register('nilai_poin')}
            />
            {errors.nilai_poin && (
              <p className="mt-1 text-sm text-red-500">{errors.nilai_poin.message}</p>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              id="keterangan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan keterangan (opsional)"
              rows={3}
              {...register('keterangan')}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
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
              {aturanPoin ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AturanPoinFormModal;
