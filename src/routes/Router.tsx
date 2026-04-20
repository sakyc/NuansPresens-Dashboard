// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import  { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import PenilaianKaryawan from '../views/page/KELOLA PENILAIAN/Penilaian/Penilaian';
import KatePenilaian from 'src/views/page/KELOLA PENILAIAN/kategori_penilaian/Index';
import { element } from 'prop-types';
import RoleProtected from 'src/views/auth/protectedrole';
import GeneratePeriode from 'src/views/page/KELOLA PENILAIAN/generate_penilaian/Index';




/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../views/page/dashboards/Dashboard')));
const PengajuanAbsen = Loadable(lazy(() => import('../views/page/Pengajuan-absen/P-absen')));

// penilaian karyawan

// utilities
const Typography = Loadable(lazy(() => import("../views/typography/Typography")));
const Table = Loadable(lazy(() => import("../views/tables/Table")));
const Form = Loadable(lazy(() => import("../views/forms/Form")));
const Alert = Loadable(lazy(() => import("../views/alerts/Alerts")));

// icons
const Solar = Loadable(lazy(() => import("../views/icons/Solar")));

// authentication
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));

// Master Data
const JabatanList = Loadable(lazy(() => import('../views/jabatan/JabatanList')));
const KaryawanList = Loadable(lazy(() => import('../views/karyawan/KaryawanList')));
const DivisiList = Loadable(lazy(() => import('../views/divisi/DivisiList')));
const ShiftList = Loadable(lazy(() => import('../views/shift/ShiftList')));
const AturanPoinList = Loadable(lazy(() => import('../views/aturan-poin/AturanPoinList')));
const KatalogRewardList = Loadable(lazy(() => import('../views/katalog-reward/KatalogRewardList')));

// Operational
const KonfigurasiQRList = Loadable(lazy(() => import('../views/konfigurasi-qr/KonfigurasiQRList')));
const MonitoringPresensiList = Loadable(lazy(() => import('../views/monitoring-presensi/MonitoringPresensiList')));
const RiwayatPoinList = Loadable(lazy(() => import('../views/riwayat-poin/RiwayatPoinList')));

// Additional
const BonusPoinList = Loadable(lazy(() => import('../views/bonus-poin/BonusPoinList')));
const RekapitulasiAbsensiList = Loadable(lazy(() => import('../views/rekapitulasi-absensi/RekapitulasiAbsensiList')));

// System
const ManajemenUserList = Loadable(lazy(() => import('../views/manajemen-user/ManajemenUserList')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <Dashboard/> },

      {
        element: <RoleProtected  allowedRoles={['admin']} />,
        children: [
          { path: '/generate-penilaian', exact: true, element: <GeneratePeriode/> },
        ]
      },
      {
        element: <RoleProtected  allowedRoles={['admin', 'manager']} />,
        children: [
          { path: '/P-absen', exact: true, element: <PengajuanAbsen/> },
        ]
      },

      { path: '/penilaian', exact: true, element: <PenilaianKaryawan/> },
      { path: '/kategori_penilaian', exact: true, element: <KatePenilaian/> },
      { path: '/ui/typography', exact: true, element: <Typography/> },
      { path: '/ui/table', exact: true, element: <Table/> },
      { path: '/ui/form', exact: true, element: <Form/> },
      { path: '/ui/alert', exact: true, element: <Alert/> },
      { path: '/icons/solar', exact: true, element: <Solar /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      
      // Master Data Routes
      { path: '/jabatan', exact: true, element: <JabatanList /> },
      { path: '/karyawan', exact: true, element: <KaryawanList /> },
      { path: '/divisi', exact: true, element: <DivisiList /> },
      { path: '/shift', exact: true, element: <ShiftList /> },
      { path: '/aturan-poin', exact: true, element: <AturanPoinList /> },
      { path: '/katalog-reward', exact: true, element: <KatalogRewardList /> },
      
      // Operational Routes
      { path: '/konfigurasi-qr', exact: true, element: <KonfigurasiQRList /> },
      { path: '/monitoring-presensi', exact: true, element: <MonitoringPresensiList /> },
      { path: '/riwayat-poin', exact: true, element: <RiwayatPoinList /> },
      
      // Additional Routes
      { path: '/bonus-poin', exact: true, element: <BonusPoinList /> },
      { path: '/rekapitulasi-absensi', exact: true, element: <RekapitulasiAbsensiList /> },
      
      // System Routes
      { path: '/manajemen-user', exact: true, element: <ManajemenUserList /> },
      
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  }
  ,
];

const router = createBrowserRouter(Router)

export default router;
