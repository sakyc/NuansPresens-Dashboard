import { Badge, Dropdown, Table } from "flowbite-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";

interface AbsensiData {
  id: number;
  name: string;
  nik: string;
  jabatan: string;
  divisi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  jenisPengajuan: string;
  status: "Pending" | "Disetujui" | "Ditolak";
  keterangan: string;
}

const AbsensiTable = () => {
  // Data dummy pengajuan absen
  const AbsensiTableData: AbsensiData[] = [
    {
      id: 1,
      name: "Budi Santoso",
      nik: "2024001",
      jabatan: "Software Engineer",
      divisi: "IT",
      tanggalMulai: "2026-03-11",
      tanggalSelesai: "2026-03-12",
      jenisPengajuan: "Sakit",
      status: "Pending",
      keterangan: "Demam tinggi, butuh istirahat."
    },
    {
      id: 2,
      name: "Siti Aminah",
      nik: "2024005",
      jabatan: "UI/UX Designer",
      divisi: "Creative",
      tanggalMulai: "2026-03-15",
      tanggalSelesai: "2026-03-15",
      jenisPengajuan: "Izin",
      status: "Disetujui",
      keterangan: "Urusan keluarga mendesak."
    },
    {
      id: 3,
      name: "Rian Ardiansyah",
      nik: "2024009",
      jabatan: "Frontend Developer",
      divisi: "IT",
      tanggalMulai: "2026-03-10",
      tanggalSelesai: "2026-03-10",
      jenisPengajuan: "Izin",
      status: "Ditolak",
      keterangan: "Ada meeting penting internal."
    }
  ];

  // Helper untuk menentukan warna badge status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui": return "success";
      case "Ditolak": return "failure";
      default: return "warning";
    }
  };

  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold dark:text-white">Daftar Pengajuan Absen</h5>
          <Badge color="info">Total: {AbsensiTableData.length} Pengajuan</Badge>
        </div>
        
        <div className="mt-3">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-6">Karyawan</Table.HeadCell>
                <Table.HeadCell>Jenis & Tanggal</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Aksi</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-border dark:divide-darkborder">
                {AbsensiTableData.map((item) => (
                  <Table.Row key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    {/* Kolom Karyawan */}
                    <Table.Cell className="whitespace-nowrap ps-6">
                      <div className="flex flex-col gap-1">
                        <h6 className="text-sm font-bold text-gray-900 dark:text-white">{item.name}</h6>
                        <span className="text-xs text-gray-500">NIK: {item.nik}</span>
                        <span className="text-[10px] uppercase font-medium text-primary bg-primary/10 px-1 w-fit rounded">
                          {item.divisi}
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Kolom Jenis & Tanggal */}
                    <Table.Cell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.jenisPengajuan}</span>
                        <span className="text-xs text-gray-500">
                          {item.tanggalMulai} s/d {item.tanggalSelesai}
                        </span>
                      </div>
                    </Table.Cell>

                    {/* Kolom Status */}
                    <Table.Cell>
                      <Badge color={getStatusColor(item.status)} className="w-fit">
                        {item.status}
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
                        <Dropdown.Item className="flex gap-2">
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
          </div>
        </div>
      </div>
    </>
  );
};

export { AbsensiTable };