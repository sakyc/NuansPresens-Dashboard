import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { KonfigurasiQR } from './KonfigurasiQRList';

const schema = z.object({
  nama_konfigurasi: z.string().min(1, 'Nama konfigurasi wajib diisi'),
  kode_qr: z.string().min(1, 'Kode QR wajib diisi'),
  lokasi: z.string().min(1, 'Lokasi wajib diisi'),
  status: z.enum(['aktif', 'nonaktif'], { required_error: 'Status wajib diisi' }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  konfigurasiQR: KonfigurasiQR | null;
}

const KonfigurasiQRFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, konfigurasiQR }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'aktif'
    }
  });

  useEffect(() => {
    if (konfigurasiQR) {
      setValue('nama_konfigurasi', konfigurasiQR.nama_konfigurasi);
      setValue('kode_qr', konfigurasiQR.kode_qr);
      setValue('lokasi', konfigurasiQR.lokasi);
      setValue('status', konfigurasiQR.status);
    } else {
      reset({ status: 'aktif' });
    }
  }, [konfigurasiQR, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (konfigurasiQR) {
        await api.put(`/konfigurasi-qr/${konfigurasiQR.id}`, data);
      } else {
        await api.post('/konfigurasi-qr', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save konfigurasi qr', error);
      alert('Gagal menyimpan data konfigurasi QR');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            {konfigurasiQR ? 'Edit Konfigurasi QR' : 'Tambah Konfigurasi QR'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label htmlFor="nama_konfigurasi" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Konfigurasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama_konfigurasi"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.nama_konfigurasi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: QR Pintu Masuk"
              {...register('nama_konfigurasi')}
            />
            {errors.nama_konfigurasi && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_konfigurasi.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="kode_qr" className="block text-sm font-medium text-gray-700 mb-1">
              Kode QR <span className="text-red-500">*</span>
            </label>
            <textarea
              id="kode_qr"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-xs ${
                errors.kode_qr ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan data kode QR"
              rows={3}
              {...register('kode_qr')}
            />
            {errors.kode_qr && (
              <p className="mt-1 text-sm text-red-500">{errors.kode_qr.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lokasi"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.lokasi ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: Lantai 1"
              {...register('lokasi')}
            />
            {errors.lokasi && (
              <p className="mt-1 text-sm text-red-500">{errors.lokasi.message}</p>
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
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
            )}
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
              {konfigurasiQR ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KonfigurasiQRFormModal;
