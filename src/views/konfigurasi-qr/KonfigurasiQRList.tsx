import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import KonfigurasiQRFormModal from './KonfigurasiQRFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface KonfigurasiQR {
  id: number;
  nama_konfigurasi: string;
  kode_qr: string;
  lokasi: string;
  status: 'aktif' | 'nonaktif';
  createdAt?: string;
  updatedAt?: string;
}

const KonfigurasiQRList = () => {
  const [konfigurasiQRs, setKonfigurasiQRs] = useState<KonfigurasiQR[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKonfigurasiQR, setEditingKonfigurasiQR] = useState<KonfigurasiQR | null>(null);

  const fetchKonfigurasiQRs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/konfigurasi-qr');
      setKonfigurasiQRs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch konfigurasi qr', error);
      alert('Gagal mengambil data konfigurasi QR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKonfigurasiQRs();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus konfigurasi QR ini?')) {
      try {
        await api.delete(`/konfigurasi-qr/${id}`);
        fetchKonfigurasiQRs();
      } catch (error) {
        console.error('Failed to delete konfigurasi qr', error);
        alert('Gagal menghapus data konfigurasi QR');
      }
    }
  };

  const handleOpenEdit = (konfigurasiQR: KonfigurasiQR) => {
    setEditingKonfigurasiQR(konfigurasiQR);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingKonfigurasiQR(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Konfigurasi QR</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Konfigurasi QR</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Konfigurasi</th>
              <th scope="col" className="px-6 py-3">Kode QR</th>
              <th scope="col" className="px-6 py-3">Lokasi</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {konfigurasiQRs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data konfigurasi QR.
                </td>
              </tr>
            ) : (
              konfigurasiQRs.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama_konfigurasi}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{item.kode_qr}</td>
                  <td className="px-6 py-4">{item.lokasi}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
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

      <KonfigurasiQRFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchKonfigurasiQRs}
        konfigurasiQR={editingKonfigurasiQR}
      />
    </CardBox>
  );
};

export default KonfigurasiQRList;
