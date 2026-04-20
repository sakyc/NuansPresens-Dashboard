import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import AturanPoinFormModal from './AturanPoinFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface AturanPoin {
  id: number;
  tipe_poin: string;
  nama_aturan: string;
  nilai_poin: number;
  keterangan?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AturanPoinList = () => {
  const [aturanPoins, setAturanPoins] = useState<AturanPoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAturanPoin, setEditingAturanPoin] = useState<AturanPoin | null>(null);

  const fetchAturanPoins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/aturan-poin');
      setAturanPoins(res.data.data);
    } catch (error) {
      console.error('Failed to fetch aturan poin', error);
      alert('Gagal mengambil data aturan poin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAturanPoins();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aturan poin ini?')) {
      try {
        await api.delete(`/aturan-poin/${id}`);
        fetchAturanPoins();
      } catch (error) {
        console.error('Failed to delete aturan poin', error);
        alert('Gagal menghapus data aturan poin');
      }
    }
  };

  const handleOpenEdit = (aturanPoin: AturanPoin) => {
    setEditingAturanPoin(aturanPoin);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingAturanPoin(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Aturan Poin</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Aturan Poin</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Tipe Poin</th>
              <th scope="col" className="px-6 py-3">Nama Aturan</th>
              <th scope="col" className="px-6 py-3">Nilai Poin</th>
              <th scope="col" className="px-6 py-3">Keterangan</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {aturanPoins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data aturan poin.
                </td>
              </tr>
            ) : (
              aturanPoins.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.tipe_poin}</td>
                  <td className="px-6 py-4">{item.nama_aturan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.nilai_poin > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.nilai_poin > 0 ? '+' : ''}{item.nilai_poin}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.keterangan || '-'}</td>
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

      <AturanPoinFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAturanPoins}
        aturanPoin={editingAturanPoin}
      />
    </CardBox>
  );
};

export default AturanPoinList;
