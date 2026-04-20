import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import BonusPoinFormModal from './BonusPoinFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface BonusPoin {
  id: number;
  karyawan_id: number;
  jumlah_poin: number;
  tanggal_pemberian: string;
  alasan: string;
  status: 'pending' | 'diterima' | 'ditolak';
  karyawan?: any;
  createdAt?: string;
  updatedAt?: string;
}

const BonusPoinList = () => {
  const [bonusPoins, setBonusPoins] = useState<BonusPoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBonusPoin, setEditingBonusPoin] = useState<BonusPoin | null>(null);

  const fetchBonusPoins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bonus-poin');
      setBonusPoins(res.data.data);
    } catch (error) {
      console.error('Failed to fetch bonus poin', error);
      alert('Gagal mengambil data bonus poin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonusPoins();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bonus poin ini?')) {
      try {
        await api.delete(`/bonus-poin/${id}`);
        fetchBonusPoins();
      } catch (error) {
        console.error('Failed to delete bonus poin', error);
        alert('Gagal menghapus data bonus poin');
      }
    }
  };

  const handleOpenEdit = (bonusPoin: BonusPoin) => {
    setEditingBonusPoin(bonusPoin);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingBonusPoin(null);
    setIsModalOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'diterima': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
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
        <h5 className="text-xl font-semibold text-gray-800">Bonus Poin</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Bonus Poin</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Karyawan</th>
              <th scope="col" className="px-6 py-3">Jumlah Poin</th>
              <th scope="col" className="px-6 py-3">Tanggal Pemberian</th>
              <th scope="col" className="px-6 py-3">Alasan</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bonusPoins.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data bonus poin.
                </td>
              </tr>
            ) : (
              bonusPoins.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.karyawan?.nama || `ID: ${item.karyawan_id}`}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {item.jumlah_poin} Poin
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.tanggal_pemberian}</td>
                  <td className="px-6 py-4 text-gray-600 truncate">{item.alasan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
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

      <BonusPoinFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBonusPoins}
        bonusPoin={editingBonusPoin}
      />
    </CardBox>
  );
};

export default BonusPoinList;
