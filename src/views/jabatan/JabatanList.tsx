import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import JabatanFormModal from './JabatanFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface Jabatan {
  id: number;
  nama_jabatan: string;
  createdAt?: string;
  updatedAt?: string;
}

const JabatanList = () => {
  const [jabatans, setJabatans] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJabatan, setEditingJabatan] = useState<Jabatan | null>(null);

  const fetchJabatans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jabatan');
      setJabatans(res.data.data);
    } catch (error) {
      console.error('Failed to fetch jabatans', error);
      alert('Gagal mengambil data jabatan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJabatans();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jabatan ini?')) {
      try {
        await api.delete(`/jabatan/${id}`);
        fetchJabatans();
      } catch (error) {
        console.error('Failed to delete jabatan', error);
        alert('Gagal menghapus data jabatan');
      }
    }
  };

  const handleOpenEdit = (jabatan: Jabatan) => {
    setEditingJabatan(jabatan);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingJabatan(null);
    setIsModalOpen(true);
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
        <h5 className="text-xl font-semibold text-gray-800">Master Jabatan</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Jabatan</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Jabatan</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jabatans.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data jabatan.
                </td>
              </tr>
            ) : (
              jabatans.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama_jabatan}</td>
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

      <JabatanFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchJabatans}
        jabatan={editingJabatan}
      />
    </CardBox>
  );
};

export default JabatanList;
