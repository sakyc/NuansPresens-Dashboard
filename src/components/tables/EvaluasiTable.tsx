import React, { useState, useEffect } from "react";
import { Badge, Button, Modal, Table, Label, Textarea, Spinner } from "flowbite-react";
import { Icon } from "@iconify/react";

interface EvaluasiSikapTableProps {
  periodeId?: number;
}

const EvaluasiSikapTable: React.FC<EvaluasiSikapTableProps> = ({ periodeId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [karyawanData, setKaryawanData] = useState<any[]>([]);
  const [kategoriData, setKategoriData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [rating, setRating] = useState<{ [key: number]: number }>({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!periodeId) return;
    const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userLocal.data?.id || userLocal.id;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:2000/api/get-penilaian-by-periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodeId, userId }),
      });
      const res = await response.json();
      if (res.success) setKaryawanData(res.data);
    } catch (error) {
      console.error("Gagal mengambil data penilaian:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    setLoadingKategori(true);
    try {
      const response = await fetch("http://localhost:2000/api/kategori-penilaian");
      const res = await response.json();
      console.log("Response kategori dari API:", res);
      
      // PERBAIKAN: Backend mengirim { data: [...] } tanpa properti success
      // Cek apakah res.data ada dan berupa array
      if (res && res.data && Array.isArray(res.data)) {
        setKategoriData(res.data);
        console.log("Kategori data setelah set:", res.data);
      } 
      // Alternatif: jika response langsung array
      else if (Array.isArray(res)) {
        setKategoriData(res);
        console.log("Kategori data setelah set (array langsung):", res);
      }
      // Jika response punya struktur berbeda
      else {
        console.error("Struktur response tidak dikenal:", res);
        setKategoriData([]);
      }
    } catch (error) {
      console.error("Gagal fetch kategori:", error);
      setKategoriData([]);
    } finally {
      setLoadingKategori(false);
    }
  };

  // Debug effect untuk melihat perubahan kategoriData
  useEffect(() => {
    console.log("Data kategori terbaru di dalam state:", kategoriData);
  }, [kategoriData]);

  // Effect untuk fetch data awal
  useEffect(() => {
    fetchData();
    fetchKategori();
  }, [periodeId]);

  // Effect untuk update rating saat modal terbuka dan kategoriData berubah
  useEffect(() => {
    if (openModal && kategoriData.length > 0 && selectedItem) {
      const initialRating: { [key: number]: number } = {};
      kategoriData.forEach((kat) => {
        initialRating[kat.id] = 0;
      });
      setRating(initialRating);
      
      // Set feedback dari data yang ada (jika ada)
      setFeedback(selectedItem.catatan || "");
    }
  }, [kategoriData, openModal, selectedItem]);

  const handleEvaluasi = (item: any) => {
    setSelectedItem(item);
    
    // Cek apakah kategoriData sudah tersedia
    if (kategoriData.length === 0) {
      alert("Data kategori masih dimuat, silakan coba lagi...");
      // Tetap buka modal tapi dengan peringatan
      setOpenModal(true);
      return;
    }
    
    setFeedback(item.catatan || "");
    
    // Inisialisasi rating
    const initialRating: { [key: number]: number } = {};
    kategoriData.forEach((kat) => {
      initialRating[kat.id] = 0;
    });
    setRating(initialRating);
    setOpenModal(true);
  };

  const handleSimpanPenilaian = async () => {
    // 1. Validasi: Pastikan semua kriteria sudah diberi rating
    const belumDiisi = kategoriData.some(kat => !rating[kat.id] || rating[kat.id] === 0);
    if (belumDiisi) {
      alert("Mohon berikan rating bintang untuk semua kriteria penilaian!");
      return;
    }

    if (!selectedItem?.id) {
      alert("Data penilaian tidak ditemukan!");
      return;
    }

    setIsSubmitting(true);

    // 2. Ambil userId dari localStorage (sesuaikan dengan struktur storage kamu)
    const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = userLocal.data?.id || userLocal.id;

    // 3. Susun Payload sesuai kebutuhan backend
    const payload = {
      penilaian_id: selectedItem.id,
      catatan: feedback,
      userId: currentUserId, // Backend membutuhkan ini untuk 'atasan_id'
      detail: kategoriData.map(kat => ({
        kategori_id: kat.id,
        nilai: rating[kat.id]
      }))
    };

    console.log("Mengirim payload ke backend:", payload);

    try {
      const response = await fetch("http://localhost:2000/api/simpan-penilaian", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Jika menggunakan token JWT, tambahkan di sini:
          // "Authorization": `Bearer ${userLocal.token}` 
        },
        body: JSON.stringify(payload)
      });
      
      const res = await response.json();
      
      if (res.success) {
        alert("Berhasil! Penilaian dan detail sikap telah disimpan.");
        setOpenModal(false);
        fetchData(); // Refresh tabel agar status berubah jadi "Selesai"
      } else {
        alert("Gagal menyimpan: " + (res.message || "Terjadi kesalahan server"));
      }
    } catch (error) {
      console.error("Error submit penilaian:", error);
      alert("Gagal menghubungi server. Pastikan backend berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilkan loading jika kategori belum siap
  if (loadingKategori && kategoriData.length === 0) {
    return (
      <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 relative w-full border border-gray-100">
        <div className="flex flex-col items-center py-20 gap-3">
          <Spinner size="lg" />
          <span className="text-sm text-gray-400">Memuat data kategori penilaian...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl shadow-md bg-white dark:bg-darkgray p-6 relative w-full border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h5 className="text-xl font-bold dark:text-white">Evaluasi Sikap Bulanan</h5>
            <p className="text-sm text-gray-500 italic">Gunakan data kehadiran sebagai referensi penilaian objektif.</p>
          </div>
          <div className="flex items-center gap-3 text-right">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-medium text-gray-400 mb-1 uppercase tracking-wider">Progress</p>
                <div className="w-32 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${(karyawanData.filter(i => i.catatan).length / karyawanData.length) * 100 || 0}%` }}
                    ></div>
                </div>
             </div>
             <Badge color="info" className="px-3 py-1">
               {karyawanData.filter(i => i.catatan).length}/{karyawanData.length} Selesai
             </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-3">
               <Spinner size="lg" />
               <span className="text-sm text-gray-400">Memuat data bawahan...</span>
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6 text-left">Karyawan</Table.HeadCell>
                <Table.HeadCell className="p-6 text-left">Email</Table.HeadCell>
                <Table.HeadCell className="text-left">Jabatan</Table.HeadCell>
                <Table.HeadCell className="text-left">Status Evaluasi</Table.HeadCell>
                <Table.HeadCell className="text-left">Aksi</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y text-left">
                {karyawanData.map((item) => (
                  <Table.Row key={item.id} className="bg-white dark:bg-gray-800">
                    <Table.Cell className="ps-6">
                      <div className="flex flex-col">
                        <h6 className="text-sm font-bold text-gray-900 dark:text-white">{item.data_karyawan?.nama}</h6>
                        <span className="text-[11px] text-gray-500 uppercase tracking-tighter">NIP: {item.data_karyawan?.nip}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="ps-6">
                      <div className="flex flex-col">
                        <h6 className="text-sm font-bold text-gray-900 dark:text-white">{item.data_karyawan?.email}</h6>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30">
                        {item.data_karyawan?.jabatan?.nama_jabatan}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={item.catatan ? "success" : "gray"} className="w-fit">
                        {item.catatan ? "Selesai" : "Belum Dinilai"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button 
                        size="xs" 
                        color={item.catatan ? "light" : "info"}
                        onClick={() => handleEvaluasi(item)}
                        disabled={loadingKategori && kategoriData.length === 0}
                      >
                        <Icon icon={item.catatan ? "solar:refresh-linear" : "solar:pen-new-square-linear"} className="mr-2 h-4 w-4" />
                        {item.catatan ? "Ubah Nilai" : "Beri Nilai"}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          
          {karyawanData.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-400">Tidak ada data karyawan untuk periode ini</p>
            </div>
          )}
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} size="md">
        <Modal.Header className="border-b-0 pb-0">
          <div className="flex flex-col">
            <span>Evaluasi: {selectedItem?.data_karyawan?.nama}</span>
            <span className="text-xs text-gray-400 font-normal">
              {kategoriData.length} Kategori Penilaian
            </span>
          </div>
        </Modal.Header>
        <Modal.Body className="text-left pt-4">
          {kategoriData.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Spinner size="lg" />
              <span className="text-sm text-gray-400">Memuat kategori penilaian...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center gap-3 border border-blue-100">
                 <Icon icon="solar:shield-check-bold" className="text-blue-600" height={24} />
                 {/* <p className="text-[11px] text-blue-800 dark:text-blue-300">
                   Penilaian ini akan disimpan secara permanen untuk perhitungan bonus periode ini.
                 </p> */}
              </div>

              {/* STAR RATING DYNAMIC LOOP */}
              <div className="space-y-5">
                {kategoriData.map((kat) => (
                  <div key={kat.id} className="text-left border-b border-gray-50 dark:border-gray-700 pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <Label className="text-sm font-bold">{kat.nama_kategori}</Label>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                        {rating[kat.id] === 5 ? "Istimewa" : 
                         rating[kat.id] === 4 ? "Baik" :
                         rating[kat.id] === 3 ? "Cukup" :
                         rating[kat.id] === 2 ? "Kurang" :
                         rating[kat.id] === 1 ? "Buruk" : ""}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-2 leading-tight">{kat.deskripsi}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          icon={star <= (rating[kat.id] || 0) ? "solar:star-bold" : "solar:star-linear"}
                          className={`cursor-pointer text-2xl transition-all hover:scale-125 ${
                            star <= (rating[kat.id] || 0) ? "text-yellow-400" : "text-gray-300"
                          }`}
                          onClick={() => setRating({ ...rating, [kat.id]: star })}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Label htmlFor="feedback" className="mb-2 block font-bold text-sm">Catatan & Saran</Label>
                <Textarea 
                  id="feedback" 
                  placeholder="Tulis saran perkembangan untuk karyawan ini..." 
                  rows={3} 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="flex justify-between border-t-0">
          <Button color="gray" size="sm" onClick={() => setOpenModal(false)} disabled={isSubmitting}>
            Batal
          </Button>
          <Button 
            color="info" 
            size="sm" 
            onClick={handleSimpanPenilaian}
            disabled={isSubmitting || kategoriData.length === 0}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Icon icon="solar:diskette-bold" className="mr-2" /> 
                Simpan Penilaian
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EvaluasiSikapTable;