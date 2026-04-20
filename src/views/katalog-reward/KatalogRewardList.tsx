import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import KatalogRewardFormModal from './KatalogRewardFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface KatalogReward {
  id: number;
  nama_reward: string;
  deskripsi: string;
  poin_diperlukan: number;
  jumlah_tersedia: number;
  createdAt?: string;
  updatedAt?: string;
}

const KatalogRewardList = () => {
  const [katalogRewards, setKatalogRewards] = useState<KatalogReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKatalogReward, setEditingKatalogReward] = useState<KatalogReward | null>(null);

  const fetchKatalogRewards = async () => {
    try {
      setLoading(true);
      const res = await api.get('/katalog-reward');
      setKatalogRewards(res.data.data);
    } catch (error) {
      console.error('Failed to fetch katalog reward', error);
      alert('Gagal mengambil data katalog reward');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKatalogRewards();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus katalog reward ini?')) {
      try {
        await api.delete(`/katalog-reward/${id}`);
        fetchKatalogRewards();
      } catch (error) {
        console.error('Failed to delete katalog reward', error);
        alert('Gagal menghapus data katalog reward');
      }
    }
  };

  const handleOpenEdit = (katalogReward: KatalogReward) => {
    setEditingKatalogReward(katalogReward);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingKatalogReward(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Katalog Reward</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Reward</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Reward</th>
              <th scope="col" className="px-6 py-3">Poin Diperlukan</th>
              <th scope="col" className="px-6 py-3">Stok Tersedia</th>
              <th scope="col" className="px-6 py-3">Deskripsi</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {katalogRewards.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data katalog reward.
                </td>
              </tr>
            ) : (
              katalogRewards.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama_reward}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {item.poin_diperlukan} Poin
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.jumlah_tersedia > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.jumlah_tersedia} unit
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 truncate">{item.deskripsi || '-'}</td>
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

      <KatalogRewardFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchKatalogRewards}
        katalogReward={editingKatalogReward}
      />
    </CardBox>
  );
};

export default KatalogRewardList;
