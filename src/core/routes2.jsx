import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/LandingPage/app";
import Login from "@/pages/auth/Login";
import Produk from "@/pages/apps/Product";
import SetorProduk from "@/pages/apps/PageSetorProduk";
import Vendor from "@/pages/apps/Vendor";
import Customer from "@/pages/apps/Customer";
import Sales from "@/pages/apps/Sales";
import Team from "@/pages/apps/Team";
import TransactionForm from "@/pages/apps/PageTambahPenjualan";
import PagePenjualanDetail from "@/pages/apps/PagePenjualanDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/masuk",
    element: <Login />,
  },
  {
    path: "/produk",
    element: <Produk />,
  },
  {
    path: "/setor-barang",
    element: <SetorProduk />,
  },
  {
    path: "/vendor",
    element: <Vendor />,
  },
  {
    path: "/konsumen",
    element: <Customer />,
  },
  {
    path: "/penjualan",
    element: <Sales />,
  },
  {
    path: "/tim",
    element: <Team />,
  },
  {
    path: "/setor-barang",
    element: <SetorProduk />,
  },
  {
    path: "/tambah-penjualan",
    element: <TransactionForm />,
  },
  {
    path: "/penjualan/:idtransaksi",
    element: <PagePenjualanDetail />,
  },
]);

export default router;
