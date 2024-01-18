import localforage from "localforage";
import { redirect, json, useNavigate } from "react-router-dom";

export const authLoader = async ({ request }) => {
  const authToken = await localforage.getItem("authUser");
  const url = new URL(request.url);

  if (authToken && url.pathname === "/masuk") {
    return redirect("/produk");
  }
  // && url.pathname !== "/masuk" && url.pathname !== "/"
  if (!authToken && url.pathname !== "/masuk" && url.pathname !== "/") {
    return redirect("/masuk");
  }

  //   // Daftar rute yang sah
  //   const validRoutes = [
  //     "/",
  //     "/masuk",
  //     "/produk",
  //     "/vendor",
  //     "/konsumen",
  //     "/penjualan",
  //     "/tim",
  //     "/setor-barang",
  //     "/tambah-penjualan",
  //     "/penjualan/:idtransaksi",
  //   ];

  //   // Fungsi untuk mengecek path dengan path-parameter
  //   const isPathValid = (pathname) => {
  //     return validRoutes.some((route) => {
  //       const regex = new RegExp(
  //         "^" + route.replace(/:[^\s/]+/g, "([^/]+)") + "$"
  //       );
  //       return regex.test(pathname);
  //     });
  //   };

  //   if (!isPathValid(url.pathname)) {
  //     // Jika rute tidak ada dalam daftar, redirect ke halaman 404
  //     return redirect("/404");
  //   }

  // Return the authToken for other routes
  return json({ authToken });
};
