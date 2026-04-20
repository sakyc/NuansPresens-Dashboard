import React, { useEffect, useState } from 'react';
import { Button, Card, Label, Select, TextInput, Badge, Table, Dropdown } from 'flowbite-react';
import { HiPlus, HiRefresh, HiCheckCircle, HiOutlineDotsVertical } from 'react-icons/hi';
import { Icon } from '@iconify/react/dist/iconify.js';

interface Periode {
  id: number;
  nama_priode: string;
  tahun: number;
  bulan: number;
  status: string;
  total_karyawan: number;
  total_terverifikasi: number;
  createdAt: string;
}

const GeneratePeriode = () => {
  const [loading, setLoading] = useState(false);
  const [bulan, setBulan] = useState(1);
  const [tahun, setTahun] = useState('2026');
  const userData = localStorage.getItem('user');

  const [priode, setPriode] = useState<Periode[]>([]);

  const dataBulan = [
  { angka: 1, nama: "Januari" },
  { angka: 2, nama: "Februari" },
  { angka: 3, nama: "Maret" },
  { angka: 4, nama: "April" },
  { angka: 5, nama: "Mei" },
  { angka: 6, nama: "Juni" },
  { angka: 7, nama: "Juli" },
  { angka: 8, nama: "Agustus" },
  { angka: 9, nama: "September" },
  { angka: 10, nama: "Oktober" },
  { angka: 11, nama: "November" },
  { angka: 12, nama: "Desember" }
];



  useEffect(() => {
    let userId = JSON.parse(userData || '{}').id
    try {
      let getPeriode = async () => {
        const res = await fetch(`http://localhost:2000/api/get-all-periode/${userId}`)
        const data = await res.json()

        setPriode(data.data)
      }
      getPeriode()
    } catch (error) {
      console.log(error)
    }
    
  }, []);
  
 const handleClosePeriode = async (id: number) => {
  if (!window.confirm("Selesaikan periode ini? Status akan berubah menjadi Success.")) return;

  try {
    
    const res = await fetch(`http://localhost:2000/api/update-periode`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert("Periode berhasil diselesaikan!");
      
      // Panggil ulang data agar state 'priode' terupdate di UI
      const resRefresh = await fetch('http://localhost:2000/api/get-all-periode');
      const result = await resRefresh.json();
      if (result.data) {
        setPriode(result.data);
      }
    } else {
      const errorData = await res.json();
      alert(`Gagal update: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error trigger update status:", error);
    alert("Koneksi ke server terputus.");
  }
};
  const handleGenerate = async () => {
    setLoading(true);

    const namaBulanTerpilih = dataBulan.find(b => b.angka === Number(bulan))?.nama;
    try {
      const response = await fetch('http://localhost:2000/api/generate-penilaian', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        priode: namaBulanTerpilih, 
        tahun: tahun, 
        bulan: bulan,
        id_admin: JSON.parse(userData || '{}').id

      }),
    })

    const data = await response.json()
    if (data.success) {
      const resRefresh = await fetch('http://localhost:2000/api/get-all-periode');
      const dataRefresh = await resRefresh.json();
      setPriode(dataRefresh.data);
    } else {
      alert(data.message);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    } catch (error) {
      console.log(error)
    }
    
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Generate Periode Penilaian</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Generate */}
        <Card className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Buat Periode Baru</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bulan" value="Pilih Bulan" />
              <Select id="bulan" required onChange={(e) => setBulan(Number(e.target.value))}>
                {dataBulan.map((item, index) => (
                <option value={item.angka}>{item.nama}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="tahun" value="Pilih Tahun" />
              <TextInput id="tahun" type="number" value={tahun} onChange={(e) => setTahun(e.target.value)} />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading} 
              color="primary" 
              className="w-full bg-primary"
            >
              {loading ? <HiRefresh className="animate-spin mr-2" /> : <HiPlus className="mr-2" />}
              Generate Penilaian
            </Button>
            <p className="text-[10px] text-gray-500 italic">
              *Klik generate akan membuat record penilaian kosong untuk seluruh karyawan aktif.
            </p>
          </div>
        </Card>

        {/* Tabel History Periode */}
        <Card className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Riwayat Periode</h3>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Nama Periode</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Total Karyawan</Table.HeadCell>
              <Table.HeadCell>Aksi</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {priode.map((item) => (
                <Table.Row key={item.id} className="bg-white">
                  <Table.Cell className="font-medium">{item.nama_priode}</Table.Cell>
                  <Table.Cell>
                    <Badge color={item.status === 'aktif' ? 'success' : 'failure'}>
                      {item.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-medium text-gray-600">
                        <span>Progres: {item.total_terverifikasi || 0} / {item.total_karyawan || 0}</span>
                        <span>{Math.round(((item.total_terverifikasi || 0) / (item.total_karyawan || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${((item.total_terverifikasi || 0) / (item.total_karyawan || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </Table.Cell>
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
                       
                        <Dropdown.Item className="flex gap-2 " >
                          <div onClick={() => handleClosePeriode(item.id)}  className="flex w-full h-full ">
                            <HiCheckCircle size={18} />
                            <span>Selesaikan Periode</span>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item className="flex gap-2">
                          <Icon icon="solar:eye-broken" height={18} className="text-blue-500" />
                          <span>Detail</span>
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
        </Card>
      </div>
    </div>
  );
};

export default GeneratePeriode;