import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import KaryawanFormModal from './KaryawanFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface Karyawan {
  id: number;
  nama: string;
  nip: string;
  email: string;
  no_hp: string;
  gender: string;
  status: string;
  jabatan_id: number;
  divisi_id: number;
  shift_id: number;
  atasan_id?: number;
  foto?: string;
  alamat?: string;
  user?: any;
  jabatan?: any;
  divisi?: any;
  shift?: any;
}

const KaryawanList = () => {
  const [karyawans, setKaryawans] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null);

  const fetchKaryawans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/karyawan');
      setKaryawans(res.data.data);
    } catch (error) {
      console.error('Failed to fetch karyawans', error);
      alert('Gagal mengambil data karyawan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaryawans();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini? Data user terkait mungkin akan ikut terhapus.')) {
      try {
        await api.delete(`/karyawan/${id}`);
        fetchKaryawans();
      } catch (error) {
        console.error('Failed to delete karyawan', error);
        alert('Gagal menghapus data karyawan');
      }
    }
  };

  const handleOpenEdit = (karyawan: Karyawan) => {
    setEditingKaryawan(karyawan);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingKaryawan(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Data Karyawan</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">NIP</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Jabatan</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {karyawans.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data karyawan.
                </td>
              </tr>
            ) : (
              karyawans.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{item.nip}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">{item.jabatan?.nama_jabatan || `ID: ${item.jabatan_id}`}</td>
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

      <KaryawanFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchKaryawans}
        karyawan={editingKaryawan}
      />
    </CardBox>
  );
};

export default KaryawanList;
