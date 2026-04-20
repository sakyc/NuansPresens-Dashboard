import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import RekapitulasiAbsensiFormModal from './RekapitulasiAbsensiFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface RekapitulasiAbsensi {
  id: number;
  karyawan_id: number;
  bulan: string;
  tahun: number;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  total_jam_kerja: string;
  keterangan?: string;
  karyawan?: any;
  createdAt?: string;
  updatedAt?: string;
}

const RekapitulasiAbsensiList = () => {
  const [rekapitulasiAbsensis, setRekapitulasiAbsensis] = useState<RekapitulasiAbsensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRekapitulasiAbsensi, setEditingRekapitulasiAbsensi] = useState<RekapitulasiAbsensi | null>(null);

  const fetchRekapitulasiAbsensis = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rekapitulasi-absensi');
      setRekapitulasiAbsensis(res.data.data);
    } catch (error) {
      console.error('Failed to fetch rekapitulasi absensi', error);
      alert('Gagal mengambil data rekapitulasi absensi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekapitulasiAbsensis();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rekapitulasi absensi ini?')) {
      try {
        await api.delete(`/rekapitulasi-absensi/${id}`);
        fetchRekapitulasiAbsensis();
      } catch (error) {
        console.error('Failed to delete rekapitulasi absensi', error);
        alert('Gagal menghapus data rekapitulasi absensi');
      }
    }
  };

  const handleOpenEdit = (rekapitulasiAbsensi: RekapitulasiAbsensi) => {
    setEditingRekapitulasiAbsensi(rekapitulasiAbsensi);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingRekapitulasiAbsensi(null);
    setIsModalOpen(true);
  };

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

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
        <h5 className="text-xl font-semibold text-gray-800">Rekapitulasi Absensi</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Rekapitulasi</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Karyawan</th>
              <th scope="col" className="px-6 py-3">Periode</th>
              <th scope="col" className="px-6 py-3">Hadir</th>
              <th scope="col" className="px-6 py-3">Sakit</th>
              <th scope="col" className="px-6 py-3">Izin</th>
              <th scope="col" className="px-6 py-3">Alfa</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rekapitulasiAbsensis.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data rekapitulasi absensi.
                </td>
              </tr>
            ) : (
              rekapitulasiAbsensis.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.karyawan?.nama || `ID: ${item.karyawan_id}`}</td>
                  <td className="px-6 py-4">{months[parseInt(item.bulan) - 1]} {item.tahun}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      {item.hadir}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                      {item.sakit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {item.izin}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                      {item.alfa}
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

      <RekapitulasiAbsensiFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRekapitulasiAbsensis}
        rekapitulasiAbsensi={editingRekapitulasiAbsensi}
      />
    </CardBox>
  );
};

export default RekapitulasiAbsensiList;
