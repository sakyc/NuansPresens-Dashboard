"use client";

import { Badge, Dropdown, Table, Modal, Button, Textarea } from "flowbite-react";
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
  status: "pending" | "disetujui" | "ditolak";
  keterangan: string;
}

const AbsensiTable = () => {
  const [data, setData] = useState<PengajuanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengajuanData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:2000/api/get-pengajuan");
      setData(response.data);
    } catch (error) {
      console.log("[v0] Error fetching data:", error);
      toast.error("Gagal mengambil data pengajuan");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Helper untuk menentukan warna badge status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "disetujui": return "success";
      case "ditolak": return "failure";
      default: return "warning";
    }
  };

  // Format status untuk tampilan
  const formatStatus = (status: string) => {
    switch (status) {
      case "disetujui": return "Disetujui";
      case "ditolak": return "Ditolak";
      default: return "Pending";
    }
  };

  // Handle buka modal untuk verifikasi
  const handleOpenVerification = (item: PengajuanData) => {
    setSelectedItem(item);
    setShowRejectReason(false);
    setRejectReason("");
    setShowModal(true);
  };

  // Handle submit verifikasi
  const handleSubmitVerification = async (newStatus: "disetujui" | "ditolak") => {
    if (newStatus === "ditolak" && !rejectReason.trim()) {
      toast.error("Alasan penolakan harus diisi");
      return;
    }

    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      const payload = {
        id: selectedItem.id,
        status: newStatus,
        alasan_ditolak: newStatus === "ditolak" ? rejectReason : null
      };

      await axios.post("http://localhost:2000/api/update-absensi", payload);
      
      toast.success(`Pengajuan berhasil ${newStatus === "disetujui" ? "disetujui" : "ditolak"}`);
      setShowModal(false);
      setSelectedItem(null);
      setRejectReason("");
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.log("[v0] Error updating status:", error);
      toast.error("Gagal memperbarui status pengajuan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold dark:text-white">Daftar Pengajuan Absen</h5>
          <Badge color="info">Total: {data.length} Pengajuan</Badge>
        </div>
        
        <div className="mt-3">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <span className="text-gray-500">Memuat data...</span>
              </div>
            ) : data.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <span className="text-gray-500">Tidak ada data pengajuan</span>
              </div>
            ) : (
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell className="p-6">Karyawan</Table.HeadCell>
                  <Table.HeadCell>Jenis & Tanggal</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Aksi</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-border dark:divide-darkborder">
                  {data.map((item) => (
                    <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      {/* Kolom Karyawan */}
                      <Table.Cell className="whitespace-nowrap ps-6">
                        <div className="flex flex-col gap-1">
                          <h6 className="text-sm font-bold text-gray-900 dark:text-white">{item.karyawan.nama}</h6>
                          <span className="text-xs text-gray-500">NIP: {item.karyawan.nip}</span>
                          <span className="text-[10px] uppercase font-medium text-primary bg-primary/10 px-1 w-fit rounded">
                            {item.karyawan.divisi}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Kolom Jenis & Tanggal */}
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{item.jenis_pengajuan}</span>
                          <span className="text-xs text-gray-500">
                            {item.tanggal_mulai} s/d {item.tanggal_selesai}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Kolom Status */}
                      <Table.Cell>
                        <Badge color={getStatusColor(item.status)} className="w-fit">
                          {formatStatus(item.status)}
                        </Badge>
                      </Table.Cell>

                      {/* Kolom Aksi */}
                      <Table.Cell>
                        <Dropdown
                          label=""
                          dismissOnClick={true}
                          renderTrigger={() => (
                            <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors text-gray-500">
                              <HiOutlineDotsVertical size={20} />
                            </span>
                          )}
                        >
                          <Dropdown.Item 
                            className="flex gap-2"
                            onClick={() => handleOpenVerification(item)}
                          >
                            <Icon icon="solar:eye-broken" height={18} className="text-blue-500" />
                            <span>Detail & Verifikasi</span>
                          </Dropdown.Item>
                          <Dropdown.Item className="flex gap-2 text-red-500">
                            <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                            <span>Hapus Record</span>
                          </Dropdown.Item>
                        </Dropdown>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Verifikasi */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header>Detail & Verifikasi Pengajuan</Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nama Karyawan</p>
                <p className="text-gray-900 dark:text-white">{selectedItem.karyawan.nama}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">NIP</p>
                <p className="text-gray-900 dark:text-white">{selectedItem.karyawan.nip}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jenis Pengajuan</p>
                <p className="text-gray-900 dark:text-white">{selectedItem.jenis_pengajuan}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal</p>
                <p className="text-gray-900 dark:text-white">
                  {selectedItem.tanggal_mulai} s/d {selectedItem.tanggal_selesai}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Keterangan</p>
                <p className="text-gray-900 dark:text-white">{selectedItem.keterangan}</p>
              </div>

              {showRejectReason && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                    Alasan Penolakan
                  </label>
                  <Textarea
                    placeholder="Masukkan alasan penolakan..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowModal(false)} disabled={isSubmitting}>
            Batal
          </Button>
          {!showRejectReason ? (
            <>
              <Button
                color="success"
                onClick={() => handleSubmitVerification("disetujui")}
                disabled={isSubmitting}
              >
                Setujui
              </Button>
              <Button
                color="failure"
                onClick={() => setShowRejectReason(true)}
                disabled={isSubmitting}
              >
                Tolak
              </Button>
            </>
          ) : (
            <>
              <Button
                color="gray"
                onClick={() => setShowRejectReason(false)}
                disabled={isSubmitting}
              >
                Kembali
              </Button>
              <Button
                color="failure"
                onClick={() => handleSubmitVerification("ditolak")}
                isProcessing={isSubmitting}
                disabled={isSubmitting}
              >
                Konfirmasi Penolakan
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { AbsensiTable };
