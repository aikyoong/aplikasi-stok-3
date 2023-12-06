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

async function fetchingIDsDetailPenjualan(id) {
  const { data, error } = await supabase
    .from("detailpenjualan")
    .select("*")
    .eq("iddetailpenjualan", id); // Menambahkan filter berdasarkan ID

  if (error) {
    throw new Error("Could not fetch transaksi_penjualan");
  }
  return data;
}

async function fetchingDetailPenjualan(id) {
  const { data, error } = await supabase
    .from("transaksi_penjualan")
    .select("*")
    .eq("idtransaksi", id); // Menambahkan filter berdasarkan ID

  if (error) {
    throw new Error("Could not fetch transaksi_penjualan");
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
  const navigate = useNavigate();
  const { idtransaksi } = useParams();

  const { data: DetailPenjualan, error: fetchError2 } = useQuery({
    queryKey: ["detail_penjualan", idtransaksi],
    queryFn: () => fetchingDetailPenjualan(idtransaksi),
  });

  const konsumen = DetailPenjualan[0]?.idkonsumen;

  const { data: Konsumen, error: fetchError3 } = useQuery({
    queryKey: ["konsumen", konsumen],
    queryFn: () => fetchingKonsumenByID(konsumen),
  });

  console.log("Konsumen", Konsumen);
  console.log("idd", idtransaksi);
  console.log("detaill", DetailPenjualan);

  function formatTanggalReadable(tanggal) {
    // Membuat objek Date dari string tanggal
    let dateObj = new Date(tanggal);

    // Mendapatkan komponen-komponen dari tanggal
    let tahun = dateObj.getFullYear();
    let bulan = dateObj.getMonth() + 1; // Bulan di JavaScript dimulai dari 0
    let hari = dateObj.getDate();

    // Format bulan dan hari untuk selalu dua digit
    bulan = bulan < 10 ? "0" + bulan : bulan;
    hari = hari < 10 ? "0" + hari : hari;

    // Menggabungkan komponen-komponen menjadi format yang lebih mudah dibaca
    return `${tahun}-${bulan}-${hari}`;
  }

  return (
    <Layout>
      {DetailPenjualan && Konsumen && (
        <div className="max-w-5xl mx-auto mt-12">
          <h2>ID Transaksi : {DetailPenjualan[0]?.idtransaksi}</h2>
          <h2>Konsumen : {Konsumen[0]?.nama_konsumen}</h2>
          <p>Status Pembayaran : {DetailPenjualan[0]?.statuspembayaran}</p>
          <p>
            Tanggal Transaksi :{" "}
            {formatTanggalReadable(DetailPenjualan[0]?.tanggaltransaksi)}
          </p>
          <p>Total Item : {DetailPenjualan[0]?.totalitem}</p>
          <p>Harga Total : {DetailPenjualan[0]?.totalharga}</p>

          <Button className="mt-16" onClick={() => navigate(-1)}>
            Kembali
          </Button>
        </div>
      )}
    </Layout>
  );
}

export default PagePenjualanDetail;
