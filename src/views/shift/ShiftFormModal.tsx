import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { Shift } from './ShiftList';

const schema = z.object({
  nama_shift: z.string().min(1, 'Nama shift wajib diisi'),
  jam_mulai: z.string().min(1, 'Jam mulai wajib diisi'),
  jam_akhir: z.string().min(1, 'Jam akhir wajib diisi'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shift: Shift | null;
}

const ShiftFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, shift }) => {
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
    if (shift) {
      setValue('nama_shift', shift.nama_shift);
      setValue('jam_mulai', shift.jam_mulai);
      setValue('jam_akhir', shift.jam_akhir);
    } else {
      reset();
    }
  }, [shift, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (shift) {
        await api.put(`/shift/${shift.id}`, data);
      } else {
        await api.post('/shift', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save shift', error);
      alert('Gagal menyimpan data shift');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {shift ? 'Edit Shift' : 'Tambah Shift'}
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
            <label htmlFor="nama_shift" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Shift <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_shift"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nama_shift ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: Shift Pagi"
              {...register('nama_shift')}
            />
            {errors.nama_shift && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_shift.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="jam_mulai" className="block text-sm font-medium text-gray-700 mb-1">
                Jam Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="jam_mulai"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('jam_mulai')}
              />
              {errors.jam_mulai && (
                <p className="mt-1 text-sm text-red-500">{errors.jam_mulai.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="jam_akhir" className="block text-sm font-medium text-gray-700 mb-1">
                Jam Akhir <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="jam_akhir"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.jam_akhir ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('jam_akhir')}
              />
              {errors.jam_akhir && (
                <p className="mt-1 text-sm text-red-500">{errors.jam_akhir.message}</p>
              )}
            </div>
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
              {shift ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftFormModal;
