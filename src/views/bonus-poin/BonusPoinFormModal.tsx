import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { BonusPoin } from './BonusPoinList';

const schema = z.object({
  karyawan_id: z.coerce.number().min(1, 'Karyawan wajib diisi'),
  jumlah_poin: z.coerce.number().min(1, 'Jumlah poin wajib diisi'),
  tanggal_pemberian: z.string().min(1, 'Tanggal pemberian wajib diisi'),
  alasan: z.string().min(1, 'Alasan wajib diisi'),
  status: z.enum(['pending', 'diterima', 'ditolak'], { required_error: 'Status wajib diisi' }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bonusPoin: BonusPoin | null;
}

const BonusPoinFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, bonusPoin }) => {
  const [karyawans, setKaryawans] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'pending'
    }
  });

  useEffect(() => {
    const fetchKaryawans = async () => {
      try {
        const res = await api.get('/karyawan');
        setKaryawans(res.data.data);
      } catch (err) {
        console.error('Failed to fetch karyawans', err);
      }
    };
    if (isOpen) {
      fetchKaryawans();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bonusPoin) {
      setValue('karyawan_id', bonusPoin.karyawan_id);
      setValue('jumlah_poin', bonusPoin.jumlah_poin);
      setValue('tanggal_pemberian', bonusPoin.tanggal_pemberian);
      setValue('alasan', bonusPoin.alasan);
      setValue('status', bonusPoin.status);
    } else {
      reset({ status: 'pending' });
    }
  }, [bonusPoin, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (bonusPoin) {
        await api.put(`/bonus-poin/${bonusPoin.id}`, data);
      } else {
        await api.post('/bonus-poin', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save bonus poin', error);
      alert('Gagal menyimpan data bonus poin');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">
            {bonusPoin ? 'Edit Bonus Poin' : 'Tambah Bonus Poin'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 space-y-4">
          <div>
            <label htmlFor="karyawan_id" className="block text-sm font-medium text-gray-700 mb-1">
              Karyawan <span className="text-red-500">*</span>
            </label>
            <select
              id="karyawan_id"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.karyawan_id ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('karyawan_id')}
            >
              <option value="">Pilih Karyawan</option>
              {karyawans.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
            {errors.karyawan_id && (
              <p className="mt-1 text-sm text-red-500">{errors.karyawan_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="jumlah_poin" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Poin <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="jumlah_poin"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.jumlah_poin ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: 50"
              {...register('jumlah_poin')}
            />
            {errors.jumlah_poin && (
              <p className="mt-1 text-sm text-red-500">{errors.jumlah_poin.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tanggal_pemberian" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pemberian <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggal_pemberian"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.tanggal_pemberian ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('tanggal_pemberian')}
            />
            {errors.tanggal_pemberian && (
              <p className="mt-1 text-sm text-red-500">{errors.tanggal_pemberian.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="alasan" className="block text-sm font-medium text-gray-700 mb-1">
              Alasan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="alasan"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.alasan ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan alasan pemberian bonus"
              rows={2}
              {...register('alasan')}
            />
            {errors.alasan && (
              <p className="mt-1 text-sm text-red-500">{errors.alasan.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('status')}
            >
              <option value="pending">Pending</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
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
              {bonusPoin ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BonusPoinFormModal;
