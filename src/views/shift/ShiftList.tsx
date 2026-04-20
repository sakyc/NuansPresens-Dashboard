import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import api from '../../services/api';
import ShiftFormModal from './ShiftFormModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

export interface Shift {
  id: number;
  nama_shift: string;
  jam_mulai: string;
  jam_akhir: string;
  createdAt?: string;
  updatedAt?: string;
}

const ShiftList = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shift');
      setShifts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch shifts', error);
      alert('Gagal mengambil data shift');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus shift ini?')) {
      try {
        await api.delete(`/shift/${id}`);
        fetchShifts();
      } catch (error) {
        console.error('Failed to delete shift', error);
        alert('Gagal menghapus data shift');
      }
    }
  };

  const handleOpenEdit = (shift: Shift) => {
    setEditingShift(shift);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingShift(null);
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
        <h5 className="text-xl font-semibold text-gray-800">Data Shift</h5>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Shift</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Nama Shift</th>
              <th scope="col" className="px-6 py-3">Jam Mulai</th>
              <th scope="col" className="px-6 py-3">Jam Akhir</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shifts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data shift.
                </td>
              </tr>
            ) : (
              shifts.map((item, index) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.nama_shift}</td>
                  <td className="px-6 py-4">{item.jam_mulai}</td>
                  <td className="px-6 py-4">{item.jam_akhir}</td>
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

      <ShiftFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchShifts}
        shift={editingShift}
      />
    </CardBox>
  );
};

export default ShiftList;
