import Layout from "@/components/Layout";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import V8TableContainer from "@/components/Table/V8TableContainer";
import SearchAndFiltering from "@/components/aikyong_pages/Search";

import supabase from "@/config/supabaseClient";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { useNavigate, Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportDetailPenjualanToPDF = (DetailPenjualan) => {
  const doc = new jsPDF();

  DetailPenjualan.forEach((transaksi, index) => {
    if (index > 0) {
      doc.addPage();
    }

    doc.setFontSize(10); // Mengatur ukuran font kecil
    doc.text(`ID Transaksi: ${transaksi.idtransaksi}`, 10, 10);
    doc.text(`Total Harga: ${transaksi.totalharga}`, 10, 20);
    doc.text(`Total Item: ${transaksi.totalitem}`, 10, 30);

    const tableColumn = [
      "Kode Barang",
      "Nama Barang",
      "Jumlah Barang",
      "Harga Per Item",
    ];
    const tableRows = transaksi.penjualan_produk.map((produk) => [
      produk.master_barang.kodebarang,
      produk.master_barang.nama_barang,
      produk.jumlah_barang,
      produk.harga_per_item,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      styles: { fontSize: 8 },
    });
  });

  doc.output("dataurlnewwindow");
};

async function fetchingDetailPenjualan(idtransaksi) {
  const { data, error } = await supabase
    .from("transaksi_penjualan")
    .select(
      `
        idtransaksi,
        totalitem,
        totalharga,
        idkonsumen,
        penjualan_produk (
          harga_per_item,
          jumlah_barang,
            master_barang (
              kodebarang,
              nama_barang,
              stok_barang,
              harga_jual
          )
        )
      `
    )
    .eq("idtransaksi", idtransaksi);

  if (error) {
    console.error("Could not fetch transaksi_penjualan", error);
    throw error;
  }
  return data;
}

async function fetchingKonsumenByID(id) {
  const { data, error } = await supabase
    .from("konsumen")
    .select("nama_konsumen")
    .eq("idkonsumen", id); // Menambahkan filter berdasarkan ID

  if (error) {
    throw new Error("Could not fetch transaksi_penjualan");
  }
  return data;
}

function PagePenjualanDetail() {
  // const navigate = useNavigate();
  const { idtransaksi } = useParams();

  console.log("id", idtransaksi);

  // console.log("idtransaksi", idtransaksi);

  const { data: DetailPenjualan, error: fetchError2 } = useQuery({
    queryKey: ["detail_penjualan", idtransaksi],
    queryFn: () => fetchingDetailPenjualan(idtransaksi),
    enabled: !!idtransaksi,
  });

  console.log("DetailPenjualan", DetailPenjualan);
  // const produk = DetailPenjualan[0]?.penjualan_produk[0]?.master_barang;
  // console.log("fetchError2", fetchError2);

  const konsumen = DetailPenjualan?.[0]?.idkonsumen; // Optional chaining to avoid errors

  const { data: Konsumen, error: fetchError3 } = useQuery({
    queryKey: ["konsumen", konsumen],
    queryFn: () => fetchingKonsumenByID(konsumen),
    enabled: !!konsumen,
  });

  console.log("Konsumen", Konsumen);
  // console.log("idd", idtransaksi);
  // console.log("detaill", DetailPenjualan);

  // function formatTanggalReadable(tanggal) {
  //   // Membuat objek Date dari string tanggal
  //   let dateObj = new Date(tanggal);

  //   // Mendapatkan komponen-komponen dari tanggal
  //   let tahun = dateObj.getFullYear();
  //   let bulan = dateObj.getMonth() + 1; // Bulan di JavaScript dimulai dari 0
  //   let hari = dateObj.getDate();

  //   // Format bulan dan hari untuk selalu dua digit
  //   bulan = bulan < 10 ? "0" + bulan : bulan;
  //   hari = hari < 10 ? "0" + hari : hari;

  //   // Menggabungkan komponen-komponen menjadi format yang lebih mudah dibaca
  //   return `${tahun}-${bulan}-${hari}`;
  // }

  const formatRupiah = (angka) => {
    // Mengubah angka menjadi string dan memformatnya sesuai format Rupiah
    return `Rp. ${angka.toLocaleString("id-ID")}`;
  };

  return (
    <Layout>
      {DetailPenjualan && DetailPenjualan.length > 0 && Konsumen && (
        <div className="max-w-5xl mx-auto mt-12">
          <Button
            onClick={() => exportDetailPenjualanToPDF(DetailPenjualan)}
            className="mb-4"
          >
            {" "}
            Ekspor ke PDF
          </Button>
          <div className="mb-4">
            <h2>ID Transaksi: {DetailPenjualan[0]?.idtransaksi}</h2>
            <h2>Konsumen: {Konsumen[0]?.nama_konsumen}</h2>{" "}
            {/* Ganti dengan nama konsumen jika tersedia */}
            <h2>Total Harga: {DetailPenjualan[0]?.totalharga}</h2>
            <h2>Total Item: {DetailPenjualan[0]?.totalitem}</h2>
            <h2>Status Pembayaran: {DetailPenjualan[0]?.statuspembayaran}</h2>
          </div>
          {DetailPenjualan[0]?.penjualan_produk &&
            DetailPenjualan[0].penjualan_produk.length > 0 && (
              <>
                <h3 className="font-semibold mb-3">Detail Produk:</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {DetailPenjualan[0].penjualan_produk.map((produk, index) => (
                    <div key={index}>
                      <p>
                        Kode Barang:{" "}
                        <span className="font-semibold">
                          {produk.master_barang?.kodebarang}
                        </span>
                      </p>
                      <p>
                        Nama Barang:{" "}
                        <span className="font-semibold">
                          {produk.master_barang?.nama_barang}
                        </span>
                      </p>
                      <p>
                        Stok Barang:{" "}
                        <span className="font-semibold">
                          {produk.master_barang?.stok_barang}
                        </span>
                      </p>
                      <p>
                        Harga Jual:{" "}
                        <span className="font-semibold">
                          {formatRupiah(produk.master_barang?.harga_jual)}
                        </span>
                      </p>
                      <p>
                        Jumlah Barang:
                        <span className="font-semibold">
                          {produk?.jumlah_barang}
                        </span>
                      </p>
                      <p>
                        Harga Per Item:{" "}
                        <span className="font-semibold">
                          {formatRupiah(produk?.harga_per_item)}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
        </div>
      )}
    </Layout>
  );
}

export default PagePenjualanDetail;

{
  /* <Button className="mt-16" onClick={() => navigate(-1)}>
            Kembali
          </Button> */
}
