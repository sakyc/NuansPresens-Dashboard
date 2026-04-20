"use client";

import { Badge, Table, Modal, Button, Textarea } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Karyawan {
  nama: string;
  nip: string;
  jabatan: string;
  divisi: string;
}

interface PengajuanData {
  id: number;
  karyawan: Karyawan;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jenis_pengajuan: string;
  foto: string | null;
  status: "pending" | "disetujui" | "ditolak";
  keterangan: string;
  alasan_ditolak?: string | null;
}

const AbsensiTable = () => {
  const [data, setData] = useState<PengajuanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengajuanData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "disetujui" | "ditolak">("pending");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:2000/api/get-pengajuan");
      setData(response.data.data);
    } catch (error) {
      toast.error("Gagal mengambil data pengajuan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenVerification = (item: PengajuanData) => {
    setSelectedItem(item);
    setSelectedStatus(item.status); 
    setRejectReason(item.alasan_ditolak || "");
    setShowImage(false);
    setShowModal(true);
  };

  const handleSubmitVerification = async () => {
    // Validasi: Jika pilih ditolak, alasan wajib diisi
    if (selectedStatus === "ditolak" && !rejectReason.trim()) {
      toast.error("Alasan penolakan tidak boleh kosong!");
      return;
    }

    if (!selectedItem || selectedStatus === "pending") {
      toast.error("Silahkan pilih status terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Sedang memproses...");

    try {
      const payload = {
        id: selectedItem.id,
        status: selectedStatus,
        alasan_ditolak: selectedStatus === "ditolak" ? rejectReason : null
      };

      await axios.post("http://localhost:2000/api/update-absensi", payload);
      
      toast.success(`Berhasil: Pengajuan telah ${selectedStatus}`, { id: loadingToast });
      setShowModal(false);
      await fetchData(); // Refresh tabel
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status. Cek koneksi server.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 relative w-full">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold dark:text-white">Daftar Pengajuan Absen</h5>
          <Badge color="info" size="sm">Total: {data.length}</Badge>
        </div>
        
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Karyawan</Table.HeadCell>
              <Table.HeadCell>Jenis & Tanggal</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {loading ? (
                <Table.Row><Table.Cell colSpan={4} className="text-center py-10">Memuat data...</Table.Cell></Table.Row>
              ) : data.length === 0 ? (
                <Table.Row><Table.Cell colSpan={4} className="text-center py-10">Tidak ada data.</Table.Cell></Table.Row>
              ) : (
                data.map((item) => (
                  <Table.Row key={item.id} className="bg-white dark:bg-gray-800">
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{item.karyawan.nama}</span>
                        <span className="text-xs text-gray-500">{item.karyawan.nip}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.jenis_pengajuan}</span>
                        <span className="text-[11px] text-gray-500">{item.tanggal_mulai} - {item.tanggal_selesai}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={item.status === 'disetujui' ? 'success' : item.status === 'ditolak' ? 'failure' : 'warning'} className="w-fit">
                        {item.status.toUpperCase()}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <button 
                        onClick={() => handleOpenVerification(item)} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Icon icon="solar:pen-new-square-bold" className="text-blue-500" height={20} />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
        <Modal.Header className="border-b dark:border-darkborder bg-white dark:bg-darkgray">
          <span className="text-lg font-bold text-gray-700 dark:text-white">Detail Verifikasi Pengajuan</span>
        </Modal.Header>

        <Modal.Body className="bg-white dark:bg-darkgray p-6">
          {selectedItem && (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm border-b dark:border-darkborder pb-6">
                <div className="opacity-80">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Nama Karyawan</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedItem.karyawan.nama}</p>
                </div>
                <div className="opacity-80">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">NIK / NIP</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedItem.karyawan.nip}</p>
                </div>
                <div className="opacity-80">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Jabatan</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedItem.karyawan.jabatan || 'Software Engineer'}</p>
                </div>
                <div className="opacity-80">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Divisi</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedItem.karyawan.divisi || 'IT Development'}</p>
                </div>
                <div className="opacity-80">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Tanggal Absen</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedItem.tanggal_mulai} s/d {selectedItem.tanggal_selesai}</p>
                </div>
                <div className="opacity-80">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Jenis Pengajuan</p>
                  <p className="text-gray-800 dark:text-white font-medium">{selectedItem.jenis_pengajuan}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold text-gray-400 uppercase text-[10px]">Keterangan</p>
                  <p className="text-gray-700 dark:text-gray-300 italic p-2 bg-gray-50 dark:bg-gray-800 rounded mt-1 border dark:border-gray-700">
                    "{selectedItem.keterangan || '-'}"
                  </p>
                </div>
              </div>

              {/* Bukti Foto Collapsible */}
              <div className="border rounded-lg dark:border-darkborder overflow-hidden">
                <button 
                  type="button"
                  onClick={() => setShowImage(!showImage)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:gallery-bold" className="text-blue-500" />
                    <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">Lihat Lampiran Foto</span>
                  </div>
                  <Icon icon={showImage ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} />
                </button>
                {showImage && (
                  <div className="p-4 flex justify-center animate-in fade-in bg-white dark:bg-darkgray">
                    {selectedItem.foto ? (
                      <img src={selectedItem.foto} className="max-h-64 rounded-lg border shadow-sm" alt="Bukti" />
                    ) : (
                      <p className="text-xs text-gray-400 italic">Karyawan tidak melampirkan foto.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Status Logic */}
              <div className="pt-2">
                {selectedItem.status !== "pending" ? (
                  <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded flex items-center gap-2 border border-amber-200 dark:border-amber-800">
                      <Icon icon="solar:lock-bold" className="text-amber-600" />
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">Data Terkunci (Sudah Diverifikasi)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="font-bold text-gray-400 uppercase text-[10px] mb-1">Status Akhir</p>
                         <Badge color={selectedItem.status === 'disetujui' ? 'success' : 'failure'} size="md">
                           {selectedItem.status.toUpperCase()}
                         </Badge>
                       </div>
                       {selectedItem.status === 'ditolak' && (
                         <div className="col-span-2">
                           <p className="font-bold text-gray-400 uppercase text-[10px] mb-1">Alasan Penolakan</p>
                           <p className="text-sm dark:text-white p-3 border rounded-md bg-gray-50 dark:bg-gray-800 italic">
                             {selectedItem.alasan_ditolak || "Tidak ada alasan."}
                           </p>
                         </div>
                       )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-500 uppercase text-[10px] mb-1">Update Status Verifikasi</p>
                      <select 
                        className="w-full text-sm border rounded-md p-2.5 dark:bg-formdark dark:text-white focus:ring-2 focus:ring-blue-500"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                      >
                        <option value="pending">--- Pilih Status ---</option>
                        <option value="disetujui">Setujui Pengajuan</option>
                        <option value="ditolak">Tolak Pengajuan</option>
                      </select>
                    </div>

                    {selectedStatus === 'ditolak' && (
                      <div className="space-y-1 animate-in zoom-in-95">
                        <p className="text-xs font-bold uppercase text-red-500">Alasan Penolakan (Wajib)</p>
                        <Textarea 
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Contoh: Foto bukti tidak jelas atau tanggal tidak sesuai."
                          rows={3}
                          className="focus:ring-red-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="justify-end flex gap-3 bg-gray-50 dark:bg-darkgray">
          <Button color="gray" onClick={() => setShowModal(false)} size="sm">
            {selectedItem?.status !== "pending" ? "Kembali" : "Batal"}
          </Button>
          
          {selectedItem?.status === "pending" && (
            <Button 
              color="info" 
              onClick={handleSubmitVerification}
              disabled={isSubmitting || selectedStatus === 'pending'}
              isProcessing={isSubmitting}
              size="sm"
              className="bg-blue-600 px-6 font-bold uppercase text-xs"
            >
              Simpan Perubahan
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { AbsensiTable };