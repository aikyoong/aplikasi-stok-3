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

import Select from "react-select";
import toast from "react-hot-toast";
import supabase from "@/config/supabaseClient";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { useNavigate, Link } from "react-router-dom";

import * as z from "zod";

// SCHEMA VALIDATION
const formAddSchema = z.object({
  kode_barang: z.string().regex(/^[A-Z0-9]+-?[A-Z0-9]*$/, {
    message:
      "Kode Barang harus berupa kombinasi huruf kapital dan angka, dengan tanda hubung ('-') yang opsional. Contoh: 'ABC123', 'ABC-1234', 'A1', 'A-1', dll.",
  }),
  nama_barang: z.string().min(5, {
    message: "Nama Barang harus lebih dari 5 karakter.",
  }),
  jumlah_barang: z.string().regex(/^[1-9][0-9]*$/, {
    message:
      "Jumlah Barang harus berupa angka positif dan tidak boleh dimulai dengan angka 0.",
  }),
  harga_barang: z.string().regex(/^(0|[1-9][0-9]*)$/, {
    message:
      "Harga Barang tidak boleh memiliki angka 0 di depan kecuali nilai 0 itu sendiri.",
  }),
});

const formSetorSchema = z.object({
  kode_barang: z.string().nonempty({
    message: "Kode barang tidak boleh kosong.",
  }),
  idvendor: z.number(),
  jumlah: z.string().regex(/^[1-9][0-9]*$/, {
    message:
      "Jumlah Barang Dibeli harus berupa angka positif dan tidak boleh dimulai dengan angka 0.",
  }),
  totalharga: z.string().min(0, {
    message: "Total harga tidak boleh negatif.",
  }),
  tanggal_pembelian: z.string().nonempty({
    message: "Tanggal pembelian tidak boleh kosong.",
  }),
});

// FUNCTIONS
async function fetchMasterBarang() {
  const { data, error } = await supabase.from("master_barang").select("*");
  if (error) {
    throw new Error("Could not fetch master_barang");
  }
  return data;
}

async function fetchVendor() {
  const { data, error } = await supabase.from("vendor").select("*");
  if (error) {
    throw new Error("Could not fetch master_barang");
  }
  return data;
}

async function deleteProduct(IDVendor) {
  const { data, error, status } = await supabase
    .from("master_barang") // Menggunakan tabel master_barang
    .delete()
    .match({ idvendor: IDVendor }); // Menghapus baris berdasarkan kodebarang

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

async function addBarang(kodebarang, nama_barang, stok_barang, harga_jual) {
  const { data, error, status } = await supabase
    .from("master_barang")
    .insert([{ kodebarang, nama_barang, stok_barang, harga_jual }]);

  if (error) {
    console.error("Error adding data:", error);
    return;
  }

  if (status === 201) {
    toast.success(
      `Membuat Produk dengan kode barang ${kodebarang} Sudah Berhasil`
    );
  } else if (status === 409) {
    toast.error(
      `Maaf untuk Barang dengan kode produk ${kodebarang} sudah tersedia`
    );
  }

  console.log("Barang added:", data);
}

// HEADER + POPUP SETOR / TAMBAH
const HeaderPageAndAddProduct = ({ data, namaHalaman, desc, vendor }) => {
  return (
    <div className="sm:flex sm:items-center sm:justify-between mt-12">
      <div>
        <div className="flex items-center gap-x-3">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white capitalize">
            {namaHalaman}
          </h2>

          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
            {data.length} produk
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{desc}</p>
      </div>

      <div className="flex items-center mt-4 gap-x-3">
        <Link to={"/setor-barang"}>
          {" "}
          <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide blue-500 transition-colors duration-200 border-2 border-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
            <ListPlus />

            <span>Setor Barang</span>
          </button>
        </Link>
        <PopUpAddProduct namaHalaman={namaHalaman} />
      </div>
    </div>
  );
};

function PopUpAddProduct({ namaHalaman, fungsi }) {
  const form = useForm({
    resolver: zodResolver(formAddSchema),
    defaultValues: {
      kode_barang: "", // Nilai default untuk kode_barang
      nama_barang: "", // Nilai default untuk nama_barang
      jumlah_barang: 1, // Nilai default untuk jumlah_barang
      harga_barang: 0, // Nilai default untuk harga_barang
    },
  });

  function onSubmit(values) {
    const kode_barang = values.kode_barang;
    const nama_barang = values.nama_barang;
    const jumlah_barang = values.jumlah_barang;
    const hargabarang = values.harga_barang;

    // Do something with the form values.
    // addBarang("12-MON", "ASDASD", "223", "230000");
    addBarang(kode_barang, nama_barang, jumlah_barang, hargabarang);
    console.log(kode_barang, nama_barang, jumlah_barang, hargabarang);
    console.log(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Edit Profile</Button> */}
        <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span>Tambah {namaHalaman}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Barang</DialogTitle>
          <DialogDescription>
            Tambah Barang yang sudah ada sebelumnya
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 py-4">
              <FormField
                control={form.control}
                name="kode_barang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Barang</FormLabel>
                    <FormControl>
                      <Input placeholder="Kode Barang" {...field} />
                    </FormControl>
                    <FormDescription>
                      Beri Kode Barang dengan Huruf Kapital dan Sesuai Ketentuan
                      perusahaan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nama_barang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Barang</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Barang" {...field} />
                    </FormControl>
                    <FormDescription>
                      Cantumkan secara Detail Merk, Berat dan Jumlah per Pack
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jumlah_barang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Barang</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jumlah Barang"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormDescription>Masukkan Jumlah Barang</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="harga_barang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Barang</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jumlah Barang"
                        type="number"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 py-6">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// KOMPONEN + PAGE
function Produk() {
  // const navigate = useNavigate();

  // const { isLoggedIn } = useAuth();
  // if (isLoggedIn === false) {
  //   setTimeout(() => {
  //     navigate("/");
  //   }, 1200);
  // }

  // Fetching
  const { data: masterBarang, error: fetchError } = useQuery({
    queryKey: ["master_barang"],
    queryFn: fetchMasterBarang,
  });
  const { data: vendorData, error: fetchError2 } = useQuery({
    queryKey: ["vendor"],
    queryFn: fetchVendor,
  });

  // refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries("master_barang");
    setIsRefreshing(false);
  };

  // Searching
  const [searching, setSearching] = useState("");
  const handleSearchChange = (value) => {
    setSearching(value);
  };

  // Column Produk
  const columns = useMemo(
    () => [
      {
        id: "kodebarang",
        header: "Kode Barang",
        accessorKey: "kodebarang", // accessor adalah "key" dalam data
      },
      {
        id: "nama barang",
        header: "Nama Barang",
        accessorKey: "nama_barang",
      },
      {
        id: "stock",
        header: "Jumlah Stok",
        accessorKey: "stok_barang",
      },
      {
        id: "harga_jual",
        header: "Harga Jual",
        accessorKey: "harga_jual",
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
                  <MenubarItem onClick={() => deleteProduct(KodeBarangEachRow)}>
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

  return (
    <Layout>
      <p>{fetchError && `${fetchError}`}</p>
      {masterBarang && (
        <div className="max-w-5xl mx-auto">
          <HeaderPageAndAddProduct
            data={masterBarang}
            vendor={vendorData}
            namaHalaman="Produk"
            desc="Berikut adalah daftar produk yang tersedia di perusahaan ini."
          />
          <div className="mt-6 flex justify-between items-center">
            <SearchAndFiltering
              searching={searching}
              setSearching={handleSearchChange}
              placeholder="Cari Produk"
            />
            <Button
              variant={"outline"}
              className="py-5"
              onClick={handleRefresh}
            >
              <div className="flex space-x-3">
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{
                    repeat: isRefreshing ? Infinity : 0,
                    duration: 1,
                  }}
                >
                  <RefreshCw className="w-4" />
                </motion.div>
                <p>Refresh Tabel</p>
              </div>
            </Button>
          </div>
          <V8TableContainer
            data={masterBarang}
            columns={columns}
            searching={searching}
            setSearching={handleSearchChange}
          />
        </div>
      )}
    </Layout>
  );
}

export default Produk;
