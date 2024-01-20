import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/LandingPage/app";
import Login from "@/pages/auth/Login";
import Produk from "@/pages/apps/Product";
import SetorProduk from "@/pages/apps/PageSetorProduk";
import Vendor from "@/pages/apps/Vendor";
import Customer from "@/pages/apps/Customer";
// import Penjualan from "@/pages/apps/Penjualan";
import Team from "@/pages/apps/Team";
import TambahPenjualan from "@/pages/apps/PageTambahPenjualan";
import PagePenjualanDetail from "@/pages/apps/PagePenjualanDetail";
import Test from "./Test";
import Penjualan from "@/pages/apps/Penjualan2";

import { authLoader } from "@/utils/loader";

const router = createBrowserRouter([
  {
    path: "/",
    loader: authLoader,
    element: <Landing />,
  },
  {
    path: "/masuk",
    loader: authLoader,
    element: <Login />,
  },
  {
    path: "/produk",
    loader: authLoader,
    element: <Produk />,
  },
  {
    path: "/setor-barang",
    loader: authLoader,
    element: <SetorProduk />,
  },
  {
    path: "/vendor",
    loader: authLoader,
    element: <Vendor />,
  },
  {
    path: "/konsumen",
    loader: authLoader,
    element: <Customer />,
  },

  {
    path: "/tim",
    loader: authLoader,
    element: <Team />,
  },
  {
    path: "/setor-barang",
    loader: authLoader,
    element: <SetorProduk />,
  },
  // {
  //   path: "/penjualan",
  //   loader: authLoader,
  //   element: <Penjualan />,
  // },
  {
    path: "/transaksi-penjualan",
    loader: authLoader,
    element: <Penjualan />,
  },
  {
    path: "/tambah-penjualan",
    loader: authLoader,
    element: <TambahPenjualan />,
  },
  {
    path: "/transaksi-penjualan/:idtransaksi",
    loader: authLoader,
    element: <PagePenjualanDetail />,
  },
  {
    path: "/404",
    element: "Halaman Tidak Ada...",
  },
]);

export default router;
