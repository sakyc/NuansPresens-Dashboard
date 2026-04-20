import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import ManajemenUserFormModal from './ManajemenUserFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface ManajemenUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'aktif' | 'nonaktif';
  karyawan_id?: number;
  lastLogin?: string;
  karyawan?: any;
  createdAt?: string;
  updatedAt?: string;
}

const ManajemenUserList = () => {
  const [manajemenUsers, setManajemenUsers] = useState<ManajemenUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManajemenUser, setEditingManajemenUser] = useState<ManajemenUser | null>(null);

  const fetchManajemenUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/manajemen-user');
      setManajemenUsers(res.data.data);
    } catch (error) {
      console.error('Failed to fetch manajemen user', error);
      alert('Gagal mengambil data manajemen user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManajemenUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await api.delete(`/manajemen-user/${id}`);
        fetchManajemenUsers();
      } catch (error) {
        console.error('Failed to delete manajemen user', error);
        alert('Gagal menghapus data manajemen user');
      }
    }
  };

  const handleOpenEdit = (manajemenUser: ManajemenUser) => {
    setEditingManajemenUser(manajemenUser);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingManajemenUser(null);
    setIsModalOpen(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <CardBox>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CardBox>
    );
  }

  return (
    <CardBox>
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-xl font-semibold text-gray-800">Manajemen User</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Username</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Last Login</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {manajemenUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data manajemen user.
                </td>
              </tr>
            ) : (
              manajemenUsers.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.username}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(item.role)}`}>
                      {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.lastLogin ? new Date(item.lastLogin).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ManajemenUserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchManajemenUsers}
        manajemenUser={editingManajemenUser}
      />
    </CardBox>
  );
};

export default ManajemenUserList;
