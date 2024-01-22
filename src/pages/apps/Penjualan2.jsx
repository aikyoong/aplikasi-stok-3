import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import V8TableContainer from "@/components/Table/V8TableContainer";
import SearchAndFiltering from "@/components/aikyong_pages/Search";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import supabase from "@/config/supabaseClient";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, ListPlus } from "lucide-react";

import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Link } from "react-router-dom";

const fetchSemuaTransaksiPenjualan = async () => {
  const { data, error } = await supabase
    .from("transaksi_penjualan")
    .select("*");

  if (error) {
    throw new Error("Could not fetch transaksi_penjualan");
  }
  console.log("Data received:", data);

  return data;
};

async function deleteTransaksi(IDTransaksi) {
  const { data, error, status, statusText } = await supabase
    .from("transaksi_penjualan") // Menggunakan tabel master_barang
    .delete()
    .match({ idtransaksi: IDTransaksi }); // Menghapus baris berdasarkan kodebarang

  if (error?.code === "23503") {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "fade-in" : "fade-out"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transition duration-500 ease-in-out`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">⚠️</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Kesalahan Sistem
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Tidak bisa mengubah atau menghapus data penjualan karena ada
                keterkaitan dengan data lain. Silakan cek kembali.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Tutup
          </button>
        </div>
      </div>
    ));
    return;
  }
  ``;
  if (status === 204) {
    console.log("success mendelete");
    toast.success(`Sukses Menghapus transaksi penjualan `);
  } else {
  }

  console.log("Barang deleted:", data);
  console.log("Status", status);
}

// Fungsi untuk mengkonversi data transaksi ke format AutoTable
const exportToPDF = (dataTransaksi) => {
  // Membuat instance jsPDF
  const doc = new jsPDF();

  // Membuat header tabel
  const tableColumn = [
    "ID Transaksi",
    "ID Konsumen",
    "Total Item",
    "Total Harga",
    "Tanggal Transaksi",
    "Status Pembayaran",
  ];

  // Mengubah data transaksi menjadi array of array
  const tableRows = dataTransaksi.map((transaksi) => [
    transaksi.idtransaksi,
    transaksi.idkonsumen,
    transaksi.totalitem,
    transaksi.totalharga,
    new Date(transaksi.tanggaltransaksi).toLocaleDateString("id-ID"),
    transaksi.statuspembayaran,
  ]);

  // Menambahkan AutoTable ke dokument
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    theme: "striped",
    styles: { fontSize: 8 },
  });

  // Membuka PDF di tab baru
  doc.output("dataurlnewwindow");
};

const HeaderPageAndAddProduct = ({ data, namaHalaman, desc }) => {
  return (
    <div className="sm:flex sm:items-center mx-5 md:mx-0 sm:justify-between mt-12">
      <div>
        <div className="flex items-center gap-x-3">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white capitalize">
            {namaHalaman}
          </h2>
          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
            {data.length} penjualan
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{desc}</p>
      </div>

      <div className="flex items-center gap-x-3">
        <Button variant="outline" onClick={() => exportToPDF(data)}>
          Download PDF
        </Button>
        <Link to="/tambah-penjualan">
          <Button>
            <ListPlus />
            Tambah Transaksi
          </Button>
        </Link>
      </div>
    </div>
  );
};

// KOMPONEN + PAGE
function Penjualan() {
  const { data: dataTransaksi, error: fetchError2 } = useQuery({
    queryKey: ["semua_penjualan"],
    queryFn: fetchSemuaTransaksiPenjualan,
  });

  // Searching
  const [searching, setSearching] = useState("");
  const handleSearchChange = (value) => {
    setSearching(value);
  };

  function formatDateTime(dateTimeStr) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleDateString("id-ID", options);
  }

  // Column Transaksi Penjuaan
  const columns = useMemo(
    () => [
      {
        id: "idtransaksi",
        header: "ID Transaksi",
        accessorKey: "idtransaksi", // accessor adalah "key" dalam data
      },

      {
        id: "totalitem",
        header: "Total Barang ",
        accessorKey: "totalitem", // accessor adalah "key" dalam data
      },
      {
        id: "totalharga",
        header: "Total Harga ",
        accessorKey: "totalharga", // accessor adalah "key" dalam data
      },
      {
        id: "tanggaltransaksi",
        header: "Tanggal Transaksi",
        accessorKey: "tanggaltransaksi",
        cell: (tanggal) => {
          const formatGenerated = tanggal.row.original.tanggaltransaksi;
          return <>{formatDateTime(formatGenerated)}</>;
        },
      },
      {
        id: "statuspembayaran",
        header: "Status Pembayaran",
        accessorKey: "statuspembayaran", // accessor adalah "key" dalam data
      },
      {
        id: "email",
        header: "ID Konsumen",
        accessorKey: "idkonsumen", // accessor adalah "key" dalam data
      },
      {
        id: "action",
        header: "Action",

        cell: (cellProps) => {
          const IDTransaksiEachRow = cellProps.row.original.idtransaksi;
          return (
            <Menubar className="max-w-[45px] mx-auto flex text-center justify-center">
              <MenubarMenu>
                <MenubarTrigger>
                  <div className="w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                  </div>
                </MenubarTrigger>
                <MenubarContent>
                  <Link to={`/transaksi-penjualan/${IDTransaksiEachRow}`}>
                    <MenubarItem>Lihat Detail</MenubarItem>
                  </Link>
                  <MenubarItem
                    onClick={() => deleteTransaksi(IDTransaksiEachRow)}
                  >
                    Hapus
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          );
        },
      },
    ],
    []
  );

  console.log("dataTransaksi", dataTransaksi);

  return (
    <Layout>
      {dataTransaksi && (
        <div className="max-w-5xl mx-auto">
          <HeaderPageAndAddProduct
            data={dataTransaksi}
            namaHalaman="Transaksi Penjualan"
            desc="Tambahkan transaksi penjualan yang beredar di perushaan."
          />
          <SearchAndFiltering
            searching={searching}
            setSearching={handleSearchChange}
            placeholder="Cari Transaksi"
          />
          <V8TableContainer
            data={dataTransaksi}
            columns={columns}
            searching={searching}
            setSearching={handleSearchChange}
          />
        </div>
      )}
    </Layout>
  );
}

export default Penjualan;
