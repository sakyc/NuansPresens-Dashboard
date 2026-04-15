import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { Karyawan } from './KaryawanList';

const schema = z.object({
  nama: z.string().min(1, 'Nama wajib diisi'),
  nip: z.string().min(1, 'NIP wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  no_hp: z.string().min(1, 'Nomor HP wajib diisi'),
  gender: z.enum(['L', 'P'], { required_error: 'Pilih Gender' }),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  jabatan_id: z.coerce.number().min(1, 'Jabatan wajib diisi'),
  divisi_id: z.coerce.number().min(1, 'Divisi ID wajib diisi'),
  shift_id: z.coerce.number().min(1, 'Shift ID wajib diisi'),
  status: z.enum(['aktif', 'tidak-aktif']).optional(),
  foto: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  karyawan: Karyawan | null;
}

const KaryawanFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, karyawan }) => {
  const [jabatans, setJabatans] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'L',
      status: 'aktif',
      foto: 'default.jpg'
    }
  });

  useEffect(() => {
    // Fetch jabatans for dropdown
    const fetchMasters = async () => {
      try {
        const resJ = await api.get('/jabatan');
        setJabatans(resJ.data.data);
      } catch (err) {
        console.error('Failed to fetch jabatans', err);
      }
    };
    if (isOpen) {
      fetchMasters();
    }
  }, [isOpen]);

  useEffect(() => {
    if (karyawan) {
      setValue('nama', karyawan.nama);
      setValue('nip', karyawan.nip);
      setValue('email', karyawan.email);
      setValue('no_hp', karyawan.no_hp);
      setValue('gender', karyawan.gender as 'L' | 'P');
      setValue('alamat', karyawan.alamat || '');
      setValue('jabatan_id', karyawan.jabatan_id);
      setValue('divisi_id', karyawan.divisi_id);
      setValue('shift_id', karyawan.shift_id);
      setValue('status', (karyawan.status as 'aktif' | 'tidak-aktif') || 'aktif');
      setValue('foto', karyawan.foto || 'default.jpg');
    } else {
      reset({
        gender: 'L',
        status: 'aktif',
        foto: 'default.jpg'
      });
    }
  }, [karyawan, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (karyawan) {
        await api.put(`/karyawan/${karyawan.id}`, data);
      } else {
        await api.post('/add-karyawan', data); // backend existing route for POST is /add-karyawan
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save karyawan', error);
      alert('Gagal menyimpan data karyawan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">
            {karyawan ? 'Edit Karyawan' : 'Tambah Karyawan'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" {...register('nama')} />
              {errors.nama && <p className="text-sm text-red-500">{errors.nama.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIP</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" {...register('nip')} />
              {errors.nip && <p className="text-sm text-red-500">{errors.nip.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" {...register('no_hp')} />
              {errors.no_hp && <p className="text-sm text-red-500">{errors.no_hp.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select className="w-full px-3 py-2 border rounded-lg" {...register('gender')}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            {karyawan && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border rounded-lg" {...register('status')}>
                  <option value="aktif">Aktif</option>
                  <option value="tidak-aktif">Tidak Aktif</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea className="w-full px-3 py-2 border rounded-lg" rows={3} {...register('alamat')}></textarea>
            {errors.alamat && <p className="text-sm text-red-500">{errors.alamat.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <select className="w-full px-3 py-2 border rounded-lg" {...register('jabatan_id')}>
                <option value="">Pilih Jabatan</option>
                {jabatans.map(j => (
                  <option key={j.id} value={j.id}>{j.nama_jabatan}</option>
                ))}
              </select>
              {errors.jabatan_id && <p className="text-sm text-red-500">{errors.jabatan_id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Divisi ID (Manual)</label>
              <input type="number" className="w-full px-3 py-2 border rounded-lg" {...register('divisi_id')} />
              {errors.divisi_id && <p className="text-sm text-red-500">{errors.divisi_id.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift ID (Manual)</label>
              <input type="number" className="w-full px-3 py-2 border rounded-lg" {...register('shift_id')} />
              {errors.shift_id && <p className="text-sm text-red-500">{errors.shift_id.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              {karyawan ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KaryawanFormModal;
