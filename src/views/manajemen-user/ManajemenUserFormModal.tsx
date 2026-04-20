import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import api from '../../services/api';
import { ManajemenUser } from './ManajemenUserList';

const schema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'user'], { required_error: 'Role wajib diisi' }),
  status: z.enum(['aktif', 'nonaktif'], { required_error: 'Status wajib diisi' }),
  karyawan_id: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  manajemenUser: ManajemenUser | null;
}

const ManajemenUserFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, manajemenUser }) => {
  const [karyawans, setKaryawans] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'user',
      status: 'aktif'
    }
  });

  const password = watch('password');

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
    if (manajemenUser) {
      setValue('username', manajemenUser.username);
      setValue('email', manajemenUser.email);
      setValue('role', manajemenUser.role);
      setValue('status', manajemenUser.status);
      setValue('karyawan_id', manajemenUser.karyawan_id || 0);
    } else {
      reset({ role: 'user', status: 'aktif' });
    }
  }, [manajemenUser, setValue, reset, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Remove empty password field if not changing password
      const submitData = { ...data };
      if (!submitData.password) {
        delete (submitData as any).password;
      }

      if (manajemenUser) {
        await api.put(`/manajemen-user/${manajemenUser.id}`, submitData);
      } else {
        await api.post('/manajemen-user', submitData);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save manajemen user', error);
      alert('Gagal menyimpan data manajemen user');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">
            {manajemenUser ? 'Edit User' : 'Tambah User'}
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan username"
              {...register('username')}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password {!manajemenUser && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={manajemenUser ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password'}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
            {manajemenUser && (
              <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('role')}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
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
          </div>

          <div>
            <label htmlFor="karyawan_id" className="block text-sm font-medium text-gray-700 mb-1">
              Karyawan (Opsional)
            </label>
            <select
              id="karyawan_id"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              {...register('karyawan_id')}
            >
              <option value="">Pilih Karyawan</option>
              {karyawans.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Hubungkan user dengan data karyawan</p>
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
              {manajemenUser ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManajemenUserFormModal;
