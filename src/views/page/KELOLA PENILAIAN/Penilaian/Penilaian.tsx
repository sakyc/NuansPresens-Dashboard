import React, { useEffect, useState } from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import EvaluasiSikapTable from "./Penilaian-main";

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

const ManagerEvaluationPage = () => {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [periodeData, setPeriodeData] = useState<Periode[]>([]);
  const [loading, setLoading] = useState(true);
  let userData = localStorage.getItem('user');
  // Fetch data dari URL yang sama
  const fetchPeriode = async () => {
    let userId = JSON.parse(userData || '{}').id
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:2000/api/get-all-periode/${userId}`);
      const data = await res.json();
      if (data.success) {
        setPeriodeData(data.data);
      }
    } catch (error) {
      console.error("Error fetching periode:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriode();
  }, []);

  if (view === "detail") {
    return (
      <div className="p-4">
        <button 
          onClick={() => setView("list")}
          className="flex items-center text-primary mb-4 hover:underline font-bold"
        >
          <Icon icon="solar:alt-arrow-left-linear" className="mr-2" />
          Kembali ke Daftar Periode
        </button>
        {/* Mengirim ID periode ke tabel detail agar filter datanya pas */}
        <EvaluasiSikapTable periodeId={selectedPeriode?.id} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 text-left">
        <h2 className="text-2xl font-bold dark:text-white">Evaluasi Karyawan</h2>
        <p className="text-gray-500">Pilih periode penilaian untuk memulai evaluasi atau melihat riwayat.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Icon icon="line-md:loading-twotone-loop" className="text-4xl text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {periodeData.map((p) => (
            <Card key={p.id} className="relative overflow-hidden border-none shadow-lg">
              {/* Dekorasi Status */}
              <div className={`absolute top-0 left-0 h-2 w-full ${p.status === 'aktif' ? 'bg-green-500' : 'bg-gray-400'}`} />
              
              <div className="flex justify-between items-start text-left">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {p.nama_priode} {p.tahun}
                  </h3>
                  <Badge color={p.status === 'aktif' ? 'success' : 'gray'} className="mt-2 w-fit">
                    {p.status === 'aktif' ? 'Periode Berjalan' : 'Selesai'}
                  </Badge>
                </div>
                <Icon 
                  icon={p.status === 'aktif' ? "solar:calendar-add-bold" : "solar:archive-check-bold"} 
                  className={`text-4xl ${p.status === 'aktif' ? 'text-green-500' : 'text-gray-300'}`} 
                />
              </div>

              <div className="mt-6 text-left">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500">Progress Penilaian:</span>
                  <span className="font-bold">{p.total_terverifikasi || 0} / {p.total_karyawan || 0} Karyawan</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full transition-all duration-700 ${p.status === 'aktif' ? 'bg-blue-600' : 'bg-gray-500'}`} 
                    style={{ width: `${((p.total_terverifikasi || 0) / (p.total_karyawan || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <Button 
                className="mt-6 w-full" 
                color={p.status === 'aktif' ? 'info' : 'light'}
                onClick={() => {
                  setSelectedPeriode(p);
                  setView("detail");
                }}
              >
                {p.status === 'aktif' ? 'Mulai Menilai' : 'Lihat Detail'}
                <Icon icon="solar:alt-arrow-right-linear" className="ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerEvaluationPage;