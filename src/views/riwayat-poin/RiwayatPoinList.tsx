import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import RiwayatPoinFormModal from './RiwayatPoinFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface RiwayatPoin {
  id: number;
  karyawan_id: number;
  aturan_poin_id: number;
  tanggal: string;
  poin: number;
  keterangan?: string;
  karyawan?: any;
  aturanPoin?: any;
  createdAt?: string;
  updatedAt?: string;
}

const RiwayatPoinList = () => {
  const [riwayatPoins, setRiwayatPoins] = useState<RiwayatPoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRiwayatPoin, setEditingRiwayatPoin] = useState<RiwayatPoin | null>(null);

  const fetchRiwayatPoins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/riwayat-poin');
      setRiwayatPoins(res.data.data);
    } catch (error) {
      console.error('Failed to fetch riwayat poin', error);
      alert('Gagal mengambil data riwayat poin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayatPoins();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus riwayat poin ini?')) {
      try {
        await api.delete(`/riwayat-poin/${id}`);
        fetchRiwayatPoins();
      } catch (error) {
        console.error('Failed to delete riwayat poin', error);
        alert('Gagal menghapus data riwayat poin');
      }
    }
  };

  const handleOpenEdit = (riwayatPoin: RiwayatPoin) => {
    setEditingRiwayatPoin(riwayatPoin);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingRiwayatPoin(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Riwayat Poin</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Riwayat Poin</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Karyawan</th>
              <th scope="col" className="px-6 py-3">Aturan Poin</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Poin</th>
              <th scope="col" className="px-6 py-3">Keterangan</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {riwayatPoins.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data riwayat poin.
                </td>
              </tr>
            ) : (
              riwayatPoins.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.karyawan?.nama || `ID: ${item.karyawan_id}`}</td>
                  <td className="px-6 py-4">{item.aturanPoin?.nama_aturan || `ID: ${item.aturan_poin_id}`}</td>
                  <td className="px-6 py-4">{item.tanggal}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.poin > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.poin > 0 ? '+' : ''}{item.poin}
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

      <RiwayatPoinFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRiwayatPoins}
        riwayatPoin={editingRiwayatPoin}
      />
    </CardBox>
  );
};

export default RiwayatPoinList;
