import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import MonitoringPresensiFormModal from './MonitoringPresensiFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface MonitoringPresensi {
  id: number;
  karyawan_id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar?: string;
  status: 'hadir' | 'izin' | 'sakit' | 'libur' | 'alfa';
  keterangan?: string;
  karyawan?: any;
  createdAt?: string;
  updatedAt?: string;
}

const MonitoringPresensiList = () => {
  const [monitoringPresensis, setMonitoringPresensis] = useState<MonitoringPresensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMonitoringPresensi, setEditingMonitoringPresensi] = useState<MonitoringPresensi | null>(null);

  const fetchMonitoringPresensis = async () => {
    try {
      setLoading(true);
      const res = await api.get('/monitoring-presensi');
      setMonitoringPresensis(res.data.data);
    } catch (error) {
      console.error('Failed to fetch monitoring presensi', error);
      alert('Gagal mengambil data monitoring presensi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringPresensis();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus monitoring presensi ini?')) {
      try {
        await api.delete(`/monitoring-presensi/${id}`);
        fetchMonitoringPresensis();
      } catch (error) {
        console.error('Failed to delete monitoring presensi', error);
        alert('Gagal menghapus data monitoring presensi');
      }
    }
  };

  const handleOpenEdit = (monitoringPresensi: MonitoringPresensi) => {
    setEditingMonitoringPresensi(monitoringPresensi);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingMonitoringPresensi(null);
    setIsModalOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'hadir': return 'bg-green-100 text-green-800';
      case 'izin': return 'bg-blue-100 text-blue-800';
      case 'sakit': return 'bg-yellow-100 text-yellow-800';
      case 'libur': return 'bg-purple-100 text-purple-800';
      case 'alfa': return 'bg-red-100 text-red-800';
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
        <h5 className="text-xl font-semibold text-gray-800">Monitoring Presensi</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Presensi</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Karyawan</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Jam Masuk</th>
              <th scope="col" className="px-6 py-3">Jam Keluar</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {monitoringPresensis.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data monitoring presensi.
                </td>
              </tr>
            ) : (
              monitoringPresensis.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.karyawan?.nama || `ID: ${item.karyawan_id}`}</td>
                  <td className="px-6 py-4">{item.tanggal}</td>
                  <td className="px-6 py-4">{item.jam_masuk}</td>
                  <td className="px-6 py-4">{item.jam_keluar || '-'}</td>
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

      <MonitoringPresensiFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMonitoringPresensis}
        monitoringPresensi={editingMonitoringPresensi}
      />
    </CardBox>
  );
};

export default MonitoringPresensiList;
