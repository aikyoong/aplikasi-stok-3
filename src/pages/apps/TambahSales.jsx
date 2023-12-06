import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

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

import Select from "react-select";
import supabase from "@/config/supabaseClient";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSetorSchema = z.object({
  totalitem: z.string(),
  totalharga: z.string().regex(/^[1-9][0-9]*$/, {
    message:
      "Jumlah Total Harga Transaksi harus berupa angka positif dan tidak boleh dimulai dengan angka 0.",
  }),
  idkonsumen: z.number(),
  tanggaltransaksi: z.string(),
  statuspembayaran: z.string(),
});

// FUNCTIONS
async function fetchingTransaksiPenjualan() {
  const { data, error } = await supabase
    .from("transaksi_penjualan")
    .select("*");

  if (error) {
    throw new Error("Could not fetch transaksi_penjualan");
  }
  return data;
}

async function fetchKonsumen() {
  const { data, error } = await supabase.from("konsumen").select("*");
  if (error) {
    throw new Error("Could not fetch konsumen");
  }
  return data;
}

async function deleteTransaksi(IDTransaksi) {
  const { data, error, status } = await supabase
    .from("transaksi_penjualan") // Menggunakan tabel master_barang
    .delete()
    .match({ idtransaksi: IDTransaksi }); // Menghapus baris berdasarkan kodebarang

  if (error) {
    console.error("Error deleting data:", error);
    return;
  }

  if (status === 204) {
    console.log("success mendelete");
    toast.success(`Sukses Menghapus produk dengan kode barang ${kodeBarang}`);
  }

  console.log("Barang deleted:", data);
  console.log("Status", status);
}

async function addTransaksiPenjualan(
  totalitem,
  totalharga,
  tanggaltransaksi,
  idkonsumen,
  statuspembayaran
) {
  const { data, error, status } = await supabase
    .from("transaksi_penjualan")
    .insert([
      { totalitem, totalharga, tanggaltransaksi, idkonsumen, statuspembayaran },
    ]);

  if (error) {
    console.error("Error adding data:", error);
    return;
  }

  if (status === 201) {
    toast.success(`Berhasil menambahkan transaksi`);
  } else {
    toast.error(`Maaf ada kesalahan ketika menambahkan transaksi`);
  }

  console.log("Transaksi added:", data);
}

// HEADER + POPUP
const HeaderPageAndAddProduct = ({ data, namaHalaman, desc, konsumen }) => {
  return (
    <div className="sm:flex sm:items-center sm:justify-between mt-12">
      <div>
        <div className="flex items-center gap-x-3">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-white capitalize">
            {namaHalaman}
          </h2>

          {/* <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
            {data.length} pengguna
          </span> */}
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{desc}</p>
      </div>

      <div className="flex items-center mt-4 gap-x-3">
        {/* <PopUpAddTransaksiPenjualan
          namaHalaman={namaHalaman}
          dataKonsumen={konsumen}
        /> */}
      </div>
    </div>
  );
};

function PopUpAddTransaksiPenjualan({ namaHalaman, dataKonsumen }) {
  const form = useForm({
    resolver: zodResolver(formSetorSchema),
    defaultValues: {
      totalitem: "", // nilai awal sebagai string kosong
      totalharga: "", // sesuaikan dengan tipe data yang diharapkan
      tanggaltransaksi: "",
      idkonsumen: "",
      statuspembayaran: "",
    },
  });

  function onSubmit(values) {
    const {
      totalitem,
      totalharga,
      tanggaltransaksi,
      idkonsumen,
      statuspembayaran,
    } = values;

    // Tambahkan waktu dan zona waktu ke tanggal
    const tanggalTransaksiFormatted = `${tanggaltransaksi} 00:00:00+00`;

    addTransaksiPenjualan(
      totalitem,
      totalharga,
      tanggaltransaksi,
      idkonsumen,
      statuspembayaran
    );

    console.log("On Submitsss", values);
  }

  const konsumenOption = dataKonsumen?.map((konsumen) => ({
    value: konsumen.idkonsumen,
    label: konsumen.nama_konsumen,
  }));

  const statusPembayaranOptions = [
    { value: "lunas", label: "Lunas" },
    { value: "belum lunas", label: "Belum Lunas" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide blue-500 transition-colors duration-200 border-2 border-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
          <ListPlus />
          <span>{namaHalaman}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] h-[425px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Transaksi Penjualan</DialogTitle>
          <DialogDescription>
            Isi dan Masukkan Transaksi Penjualan
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="totalitem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Item Terbeli</FormLabel>
                    <FormControl>
                      <Input placeholder="1" type="number" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalharga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Harga Terbeli</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Rp.100.000"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idkonsumen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konsumen</FormLabel>
                    <FormControl>
                      <Controller
                        name="idkonsumen"
                        control={form.control}
                        render={({ field }) => {
                          // Menentukan nilai yang dipilih berdasarkan field.value
                          const selectedValue = konsumenOption?.find(
                            (option) => option.value === field.value
                          );

                          return (
                            <Select
                              {...field}
                              options={konsumenOption}
                              value={selectedValue}
                              onChange={(option) =>
                                field.onChange(option.value)
                              }
                            />
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Pilih Konsumen yang membeli
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label htmlFor="tanggaltransaksi">Tanggal Transaksi</Label>
                <Controller
                  control={form.control}
                  name="tanggaltransaksi"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type="date"
                      onChange={onChange}
                      value={value ?? ""} // Ensure value is never undefined
                    />
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="statuspembayaran"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pembayaran</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="statuspembayaran"
                        // render={({ field }) => (
                        //   <Select
                        //     {...field}
                        //     options={statusPembayaranOptions}
                        //     onChange={(selectedOption) =>
                        //       field.onChange(selectedOption.value)
                        //     }
                        //   />
                        // )}
                        render={({ field }) => {
                          // Menentukan nilai yang dipilih berdasarkan field.value
                          const selectedValue = statusPembayaranOptions?.find(
                            (option) => option.value === field.value
                          );

                          return (
                            <Select
                              {...field}
                              options={statusPembayaranOptions}
                              value={selectedValue}
                              onChange={(option) =>
                                field.onChange(option.value)
                              }
                            />
                          );
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 py-6">
                Tambah Transaksi Penjualan
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// KOMPONEN + PAGE
function TambahSales() {
  // Fetching
  const { data: dataTransaksi, error: fetchError } = useQuery({
    queryKey: ["transaksi_penjualan"],
    queryFn: fetchingTransaksiPenjualan,
  });
  const { data: konsumenData, error: fetchError2 } = useQuery({
    queryKey: ["konsumen"],
    queryFn: fetchKonsumen,
  });

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
        header: "Total Item Dibeli",
        accessorKey: "totalitem", // accessor adalah "key" dalam data
      },
      {
        id: "totalharga",
        header: "Total Harga Dibeli",
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
          const KodeBarangEachRow = cellProps.row.original.kodebarang;
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
                  <MenubarItem
                    onClick={() => deleteTransaksi(KodeBarangEachRow)}
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

  console.log("data", dataTransaksi);

  return (
    <Layout>
      <p>{fetchError && `${fetchError}`}</p>
      {dataTransaksi && (
        <div className="max-w-5xl mx-auto">
          <HeaderPageAndAddProduct
            data={dataTransaksi}
            konsumen={konsumenData}
            namaHalaman="Tambah Transaksi"
          />

          <V8TableContainer data={dataTransaksi} columns={columns} />
        </div>
      )}
    </Layout>
  );
}

export default TambahSales;
