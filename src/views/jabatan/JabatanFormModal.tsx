import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { Jabatan } from './JabatanList';

const schema = z.object({
  nama_jabatan: z.string().min(1, 'Nama jabatan wajib diisi'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jabatan: Jabatan | null;
}

const JabatanFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, jabatan }) => {
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
    if (jabatan) {
      setValue('nama_jabatan', jabatan.nama_jabatan);
    } else {
      reset();
    }
  }, [jabatan, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (jabatan) {
        await api.put(`/jabatan/${jabatan.id}`, data);
      } else {
        await api.post('/jabatan', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save jabatan', error);
      alert('Gagal menyimpan data jabatan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {jabatan ? 'Edit Jabatan' : 'Tambah Jabatan'}
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
            <label htmlFor="nama_jabatan" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_jabatan"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nama_jabatan ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama jabatan"
              {...register('nama_jabatan')}
            />
            {errors.nama_jabatan && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_jabatan.message}</p>
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
              {jabatan ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JabatanFormModal;
