import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { Divisi } from './DivisiList';

const schema = z.object({
  nama_divisi: z.string().min(1, 'Nama divisi wajib diisi'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  divisi: Divisi | null;
}

const DivisiFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, divisi }) => {
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
    if (divisi) {
      setValue('nama_divisi', divisi.nama_divisi);
    } else {
      reset();
    }
  }, [divisi, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (divisi) {
        await api.put(`/divisi/${divisi.id}`, data);
      } else {
        await api.post('/divisi', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save divisi', error);
      alert('Gagal menyimpan data divisi');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {divisi ? 'Edit Divisi' : 'Tambah Divisi'}
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
            <label htmlFor="nama_divisi" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Divisi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_divisi"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nama_divisi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama divisi"
              {...register('nama_divisi')}
            />
            {errors.nama_divisi && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_divisi.message}</p>
            )}
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
              {divisi ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisiFormModal;
