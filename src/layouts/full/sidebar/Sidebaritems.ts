import { uniqueId } from "lodash";

// Interface tetap sama seperti yang kamu punya
export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  isPro?: boolean;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  isPro?: boolean;
}



const SidebarContent: MenuItem[] = [
  {
    heading: "Home",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/",
        isPro: false,
      },
    ],
  },
  {
    heading: "Master Data",
    children: [
      {
        name: "Data Karyawan",
        icon: "solar:users-group-two-rounded-bold-duotone",
        id: uniqueId(),
        url: "/karyawan",
        isPro: false,
      },
      {
        name: "Jabatan",
        icon: "solar:ranking-bold-duotone",
        id: uniqueId(),
        url: "/jabatan",
        isPro: false,
      },
      {
        name: "Divisi",
        icon: "solar:ranking-bold-duotone",
        id: uniqueId(),
        url: "/divisi",
        isPro: false,
      },
      {
        name: "Data Shift",
        icon: "solar:clock-circle-bold-duotone",
        id: uniqueId(),
        url: "/shift",
        isPro: false,
      },
    ],
  },
  {
    heading: "Presensi Operasional",
    children: [
      {
        name: "Konfigurasi QR",
        icon: "solar:qr-code-bold-duotone",
        id: uniqueId(),
        url: "/konfigurasi-qr",
        isPro: false,
      },
      {
        name: "Monitoring Presensi",
        icon: "solar:monitor-bold-duotone",
        id: uniqueId(),
        url: "/monitoring-presensi",
        isPro: false,
      },
      {
        name: "Pengajuan Absen",
        icon: "solar:letter-opened-bold-duotone",
        id: uniqueId(),
        url: "/P-absen",
        isPro: false,
      },
    ],
  },
  {
    heading: "Evaluasi Karyawan",
    children: [
      {
        name: "Generate Penilaian",
        icon: "solar:magic-stick-3-bold-duotone",
        id: uniqueId(),
        url: "/generate-penilaian",
        isPro: false,
      },
      {
        name: "Penilaian",
        icon: "solar:clipboard-list-bold-duotone",
        id: uniqueId(),
        url: "/penilaian",
        isPro: false,
      },
      {
        name: "Kategori Penilaian",
        icon: "solar:settings-minimalistic-bold-duotone",
        id: uniqueId(),
        url: "/kategori_penilaian",
        isPro: false,
      },
    ],
  },
  {
    heading: "Point & Reward",
    children: [
      {
        name: "Aturan Poin",
        icon: "solar:bill-list-bold-duotone",
        id: uniqueId(),
        url: "/aturan-poin",
        isPro: false,
      },
      {
        name: "Riwayat Poin",
        icon: "solar:history-bold-duotone",
        id: uniqueId(),
        url: "/riwayat-poin",
        isPro: false,
      },
      {
        name: "Katalog Reward",
        icon: "solar:shop-bold-duotone",
        id: uniqueId(),
        url: "/katalog-reward",
        isPro: false,
      },
      {
        name: "Bonus Poin",
        icon: "solar:gift-bold-duotone",
        id: uniqueId(),
        url: "/bonus-poin",
        isPro: false,
      },
    ],
  },
  {
    heading: "Laporan",
    children: [
      {
        name: "Rekapitulasi Absensi",
        icon: "solar:document-bold-duotone",
        id: uniqueId(),
        url: "/rekapitulasi-absensi",
        isPro: false,
      },
    ],
  },
  {
    heading: "Sistem & Auth",
    children: [
      {
        name: "Manajemen User",
        icon: "solar:user-speak-bold-duotone",
        id: uniqueId(),
        url: "/manajemen-user",
        isPro: false,
      },
      {
        name: "Login",
        icon: "solar:login-2-linear",
        id: uniqueId(),
        url: "/auth/login",
        isPro: false,
      },
      {
        name: "Register",
        icon: "solar:shield-user-outline",
        id: uniqueId(),
        url: "/auth/register",
        isPro: false,
      },
    ],
  },
];

export default SidebarContent;

