import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { MonitoringPresensi } from './MonitoringPresensiList';

const schema = z.object({
  karyawan_id: z.coerce.number().min(1, 'Karyawan wajib diisi'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  jam_masuk: z.string().min(1, 'Jam masuk wajib diisi'),
  jam_keluar: z.string().optional(),
  status: z.enum(['hadir', 'izin', 'sakit', 'libur', 'alfa'], { required_error: 'Status wajib diisi' }),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  monitoringPresensi: MonitoringPresensi | null;
}

const MonitoringPresensiFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, monitoringPresensi }) => {
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
      status: 'hadir'
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
    if (monitoringPresensi) {
      setValue('karyawan_id', monitoringPresensi.karyawan_id);
      setValue('tanggal', monitoringPresensi.tanggal);
      setValue('jam_masuk', monitoringPresensi.jam_masuk);
      setValue('jam_keluar', monitoringPresensi.jam_keluar || '');
      setValue('status', monitoringPresensi.status);
      setValue('keterangan', monitoringPresensi.keterangan || '');
    } else {
      reset({ status: 'hadir' });
    }
  }, [monitoringPresensi, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (monitoringPresensi) {
        await api.put(`/monitoring-presensi/${monitoringPresensi.id}`, data);
      } else {
        await api.post('/monitoring-presensi', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save monitoring presensi', error);
      alert('Gagal menyimpan data monitoring presensi');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">
            {monitoringPresensi ? 'Edit Presensi' : 'Tambah Presensi'}
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
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tanggal"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.tanggal ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('tanggal')}
            />
            {errors.tanggal && (
              <p className="mt-1 text-sm text-red-500">{errors.tanggal.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="jam_masuk" className="block text-sm font-medium text-gray-700 mb-1">
                Jam Masuk <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="jam_masuk"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.jam_masuk ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('jam_masuk')}
              />
              {errors.jam_masuk && (
                <p className="mt-1 text-sm text-red-500">{errors.jam_masuk.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="jam_keluar" className="block text-sm font-medium text-gray-700 mb-1">
                Jam Keluar
              </label>
              <input
                type="time"
                id="jam_keluar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                {...register('jam_keluar')}
              />
            </div>
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
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="libur">Libur</option>
              <option value="alfa">Alfa</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              id="keterangan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Masukkan keterangan (opsional)"
              rows={2}
              {...register('keterangan')}
            />
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
              {monitoringPresensi ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonitoringPresensiFormModal;
