import React, { useState } from "react";
import { Badge, Dropdown, Table, Button, Modal, Label, TextInput, Textarea, Select } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";

const ProductTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [kategoriData, setKategoriData] = useState<any[]>([]);
  
  // State untuk Form Input
  const [formData, setFormData] = useState({
    nama_kategori: "",
    deskripsi: "",
    status: "aktif"
  });

  // const kategoriData = [
  //   {
  //     id: 1,
  //     nama_kategori: "Kedisiplinan",
  //     deskripsi: "Kepatuhan terhadap jam kerja dan peraturan perusahaan.",
  //     status: "aktif",
  //     createdAt: "2026-03-11T15:37:43.000Z",
  //   },
  //   {
  //     id: 2,
  //     nama_kategori: "Kerja Sama Tim",
  //     deskripsi: "Kemampuan berinteraksi dan membantu rekan kerja dalam proyek.",
  //     status: "aktif",
  //     createdAt: "2026-03-11T15:37:43.000Z",
  //   },
  //   {
  //     id: 3,
  //     nama_kategori: "Inisiatif",
  //     deskripsi: "Kemauan untuk mengambil tindakan tanpa harus menunggu instruksi.",
  //     status: "aktif",
  //     createdAt: "2026-03-11T15:37:43.000Z",
  //   },
  //   {
  //     id: 4,
  //     nama_kategori: "Kualitas Kerja",
  //     deskripsi: "Ketelitian dan kerapihan dalam menyelesaikan tugas yang diberikan.",
  //     status: "aktif",
  //     createdAt: "2026-03-11T15:37:43.000Z",
  //   },
  //   {
  //     id: 5,
  //     nama_kategori: "Loyalitas",
  //     deskripsi: "Kesetiaan dan dedikasi terhadap visi misi perusahaan.",
  //     status: "aktif",
  //     createdAt: "2026-03-11T15:37:43.000Z",
  //   },
  // ];

   const fetchKategori = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/kategori-penilaian");
      const res = await response.json();
      
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
    } 
  };
  
  React.useEffect(() => {
    fetchKategori();
  }, []);

  // Handler Input
  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handler Simpan (Submit)
  const handleSubmit = () => {
    console.log("Menyimpan data:", formData);
    // Tambahkan logic fetch POST di sini nanti
    setOpenModal(false);
    // Reset form setelah simpan
    setFormData({ nama_kategori: "", deskripsi: "", status: "aktif" });
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h5 className="text-xl font-bold dark:text-white">Kategori Penilaian</h5>
          <p className="text-sm text-gray-500">Kelola kriteria penilaian untuk evaluasi kinerja karyawan.</p>
        </div>
        <Button color="info" size="sm" onClick={() => setOpenModal(true)}>
          <Icon icon="solar:add-circle-bold" className="mr-2 h-5 w-5" />
          Tambah Kategori
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto mt-6">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4">Nama Kategori</Table.HeadCell>
            <Table.HeadCell>Deskripsi</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Dibuat Pada</Table.HeadCell>
            <Table.HeadCell className="text-center">Aksi</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-border dark:divide-darkborder">
            {kategoriData.map((item) => (
              <Table.Row key={item.id} className="bg-white dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-bold text-gray-900 dark:text-white">
                  {item.nama_kategori}
                </Table.Cell>
                <Table.Cell className="max-w-xs text-wrap text-sm text-gray-600 dark:text-gray-400">
                  {item.deskripsi}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={item.status === "aktif" ? "success" : "failure"} className="w-fit">
                    {item.status.toUpperCase()}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center">
                    <Dropdown
                      label=""
                      dismissOnClick={true}
                      renderTrigger={() => (
                        <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <HiOutlineDotsVertical size={20} className="text-gray-500" />
                        </span>
                      )}
                    >
                      <Dropdown.Item className="flex gap-2">
                        <Icon icon="solar:pen-new-square-broken" height={18} className="text-blue-500" />
                        <span>Edit Kategori</span>
                      </Dropdown.Item>
                      <Dropdown.Item className="flex gap-2 text-red-600">
                        <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                        <span>Hapus</span>
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* MODAL TAMBAH DATA */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Tambah Kategori Baru</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nama_kategori" value="Nama Kategori" />
              </div>
              <TextInput
                id="nama_kategori"
                placeholder="Masukkan nama kategori..."
                required
                value={formData.nama_kategori}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="deskripsi" value="Deskripsi" />
              </div>
              <Textarea
                id="deskripsi"
                placeholder="Tulis deskripsi kriteria penilaian..."
                required
                rows={4}
                value={formData.deskripsi}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="status" value="Status Kategori" />
              </div>
              <Select 
                id="status" 
                required 
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </Select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Batal
          </Button>
          <Button color="info" onClick={handleSubmit}>
            <Icon icon="solar:diskette-bold" className="mr-2 h-5 w-5" />
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductTable;