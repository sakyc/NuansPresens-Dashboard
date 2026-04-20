import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import DivisiFormModal from './DivisiFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface Divisi {
  id: number;
  nama_divisi: string;
  createdAt?: string;
  updatedAt?: string;
}

const DivisiList = () => {
  const [divisis, setDivisis] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<Divisi | null>(null);

  const fetchDivisis = async () => {
    try {
      setLoading(true);
      const res = await api.get('/divisi');
      setDivisis(res.data.data);
    } catch (error) {
      console.error('Failed to fetch divisis', error);
      alert('Gagal mengambil data divisi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisis();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus divisi ini?')) {
      try {
        await api.delete(`/divisi/${id}`);
        fetchDivisis();
      } catch (error) {
        console.error('Failed to delete divisi', error);
        alert('Gagal menghapus data divisi');
      }
    }
  };

  const handleOpenEdit = (divisi: Divisi) => {
    setEditingDivisi(divisi);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingDivisi(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Master Divisi</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Divisi</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Divisi</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {divisis.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data divisi.
                </td>
              </tr>
            ) : (
              divisis.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama_divisi}</td>
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

      <DivisiFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDivisis}
        divisi={editingDivisi}
      />
    </CardBox>
  );
};

export default DivisiList;
