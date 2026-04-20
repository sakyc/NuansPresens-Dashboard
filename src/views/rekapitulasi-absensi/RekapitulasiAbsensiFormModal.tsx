import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { RekapitulasiAbsensi } from './RekapitulasiAbsensiList';

const schema = z.object({
  karyawan_id: z.coerce.number().min(1, 'Karyawan wajib diisi'),
  bulan: z.string().min(1, 'Bulan wajib diisi'),
  tahun: z.coerce.number().min(2000, 'Tahun wajib diisi'),
  hadir: z.coerce.number().min(0, 'Hadir tidak boleh negatif'),
  sakit: z.coerce.number().min(0, 'Sakit tidak boleh negatif'),
  izin: z.coerce.number().min(0, 'Izin tidak boleh negatif'),
  alfa: z.coerce.number().min(0, 'Alfa tidak boleh negatif'),
  total_jam_kerja: z.string().min(1, 'Total jam kerja wajib diisi'),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rekapitulasiAbsensi: RekapitulasiAbsensi | null;
}

const RekapitulasiAbsensiFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, rekapitulasiAbsensi }) => {
  const [karyawans, setKaryawans] = useState<any[]>([]);

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
    if (rekapitulasiAbsensi) {
      setValue('karyawan_id', rekapitulasiAbsensi.karyawan_id);
      setValue('bulan', rekapitulasiAbsensi.bulan);
      setValue('tahun', rekapitulasiAbsensi.tahun);
      setValue('hadir', rekapitulasiAbsensi.hadir);
      setValue('sakit', rekapitulasiAbsensi.sakit);
      setValue('izin', rekapitulasiAbsensi.izin);
      setValue('alfa', rekapitulasiAbsensi.alfa);
      setValue('total_jam_kerja', rekapitulasiAbsensi.total_jam_kerja);
      setValue('keterangan', rekapitulasiAbsensi.keterangan || '');
    } else {
      reset();
    }
  }, [rekapitulasiAbsensi, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (rekapitulasiAbsensi) {
        await api.put(`/rekapitulasi-absensi/${rekapitulasiAbsensi.id}`, data);
      } else {
        await api.post('/rekapitulasi-absensi', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save rekapitulasi absensi', error);
      alert('Gagal menyimpan data rekapitulasi absensi');
    }
  };

  if (!isOpen) return null;

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">
            {rekapitulasiAbsensi ? 'Edit Rekapitulasi Absensi' : 'Tambah Rekapitulasi Absensi'}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-1">
                Bulan <span className="text-red-500">*</span>
              </label>
              <select
                id="bulan"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.bulan ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('bulan')}
              >
                <option value="">Pilih Bulan</option>
                {months.map((month, idx) => (
                  <option key={month} value={month}>{monthNames[idx]}</option>
                ))}
              </select>
              {errors.bulan && (
                <p className="mt-1 text-sm text-red-500">{errors.bulan.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-1">
                Tahun <span className="text-red-500">*</span>
              </label>
              <select
                id="tahun"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.tahun ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('tahun')}
              >
                <option value="">Pilih Tahun</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.tahun && (
                <p className="mt-1 text-sm text-red-500">{errors.tahun.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hadir" className="block text-sm font-medium text-gray-700 mb-1">
                Hadir <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="hadir"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.hadir ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                {...register('hadir')}
              />
              {errors.hadir && (
                <p className="mt-1 text-sm text-red-500">{errors.hadir.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="sakit" className="block text-sm font-medium text-gray-700 mb-1">
                Sakit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="sakit"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.sakit ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                {...register('sakit')}
              />
              {errors.sakit && (
                <p className="mt-1 text-sm text-red-500">{errors.sakit.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="izin" className="block text-sm font-medium text-gray-700 mb-1">
                Izin <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="izin"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.izin ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                {...register('izin')}
              />
              {errors.izin && (
                <p className="mt-1 text-sm text-red-500">{errors.izin.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="alfa" className="block text-sm font-medium text-gray-700 mb-1">
                Alfa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="alfa"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.alfa ? 'border-red-500' : 'border-gray-300'
                }`}
                min="0"
                {...register('alfa')}
              />
              {errors.alfa && (
                <p className="mt-1 text-sm text-red-500">{errors.alfa.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="total_jam_kerja" className="block text-sm font-medium text-gray-700 mb-1">
              Total Jam Kerja <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="total_jam_kerja"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.total_jam_kerja ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: 160 jam"
              {...register('total_jam_kerja')}
            />
            {errors.total_jam_kerja && (
              <p className="mt-1 text-sm text-red-500">{errors.total_jam_kerja.message}</p>
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
              {rekapitulasiAbsensi ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RekapitulasiAbsensiFormModal;
