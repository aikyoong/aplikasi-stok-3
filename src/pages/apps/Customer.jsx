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
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

// SCHEMA VALIDATION
const formAddSchema = z.object({
  nama_konsumen: z.string().min(3, {
    message: "Nama Vendor harus lebih dari 5 karakter.",
  }),
  alamat: z.string().min(5, {
    message: "Nama Barang harus lebih dari 5 karakter.",
  }),
});
// FUNCTIONS
const fetchKonsumen = async () => {
  const { data, error } = await supabase.from("konsumen").select("*");
  if (error) {
    throw new Error("Could not fetch konsumen");
  }
  return data;
};

async function deleteKonsumen(IDKonsumen) {
  const { data, error, status } = await supabase
    .from("konsumen") // Menggunakan tabel master_barang
    .delete()
    .match({ idkonsumen: IDKonsumen }); // Menghapus baris berdasarkan idvendor

  if (error) {
    console.error("Error deleting data:", error);
    return;
  }

  if (status === 204) {
    console.log("success mendelete");
    toast.success(`Sukses Menghapus konsumen dengan id konsumen ${IDKonsumen}`);
  }

  console.log("Barang deleted:", data);
  console.log("Status", status);
}

async function addKonsumen(nama_konsumen, alamat) {
  const { data, error, status } = await supabase
    .from("konsumen")
    .insert([{ nama_konsumen, alamat }]);

  if (error) {
    console.error("Error adding data:", error);
    return;
  }

  if (status === 201) {
    toast.success(`Berhasil menambahkan Konsumene ${nama_konsumen}`);
  } else if (status === 409) {
    toast.error(`Maaf untuk Konsumen ${nama_konsumen} sudah tersedia`);
  }

  console.log("Barang added:", data);
}

// HEADER + POPUP TAMBAH
const HeaderPageAndAddProduct = ({ data, namaHalaman, desc }) => {
  return (
    <div className="sm:flex sm:items-center sm:justify-between mt-12">
      <div>
        <div className="flex items-center gap-x-3">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white capitalize">
            {namaHalaman}
          </h2>

          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
            {data.length} {namaHalaman}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{desc}</p>
      </div>

      <div className="flex items-center mt-4 gap-x-3">
        {/* <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_3098_154395)">
              <path
                d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                stroke="currentColor"
                stroke-width="1.67"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_3098_154395">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <span>Import</span>
        </button> */}

        <PopUpAddConsumer namaHalaman={namaHalaman} />
      </div>
    </div>
  );
};

function PopUpAddConsumer({ namaHalaman }) {
  const form = useForm({
    resolver: zodResolver(formAddSchema),
    defaultValues: {
      nama_konsumen: "", // Nilai default untuk kode_barang
      alamat: "", // Nilai default untuk nama_barang
    },
  });

  function onSubmit(values) {
    const nama_konsumen = values.nama_konsumen;
    const alamat = values.alamat;

    addKonsumen(nama_konsumen, alamat);
    console.log(nama_konsumen, alamat);
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
          <DialogTitle>Tambah Vendor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2 py-4">
              <FormField
                control={form.control}
                name="nama_konsumen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Konsumen/Toko</FormLabel>
                    <FormControl>
                      <Input placeholder="Toko.." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Toko</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat Lengkap Toko" {...field} />
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
function Customer() {
  // Fetching
  const { data: dataKonsumen, error: fetchError } = useQuery({
    queryKey: ["konsumen"],
    queryFn: fetchKonsumen,
  });

  // refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries("vendor");
    setIsRefreshing(false);
  };

  // Searching
  const [searching, setSearching] = useState("");
  const handleSearchChange = (value) => {
    setSearching(value);
  };

  // Column Konsumen
  const columns = useMemo(
    () => [
      {
        id: "idkonsumen",
        header: "ID",
        accessorKey: "idkonsumen", // accessor adalah "key" dalam data
      },
      {
        id: "nama_konsumen",
        header: "Nama Konsumen",
        accessorKey: "nama_konsumen", // accessor adalah "key" dalam data
      },
      {
        id: "alamat",
        header: "Alamat",
        accessorKey: "alamat", // accessor adalah "key" dalam data
      },
      {
        id: "action",
        header: "Action",
        cell: (cellProps) => {
          const idEachRow = cellProps.row.original.idkonsumen;
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
                  <MenubarItem onClick={() => deleteKonsumen(idEachRow)}>
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

  console.log("supabase", supabase);
  console.log("dataKonsumen", dataKonsumen);
  return (
    <Layout>
      <p>{fetchError && `${fetchError}`}</p>
      {dataKonsumen && (
        <div className="max-w-5xl mx-auto">
          <HeaderPageAndAddProduct
            data={dataKonsumen}
            namaHalaman="Konsumen"
            desc="Berikut adalah daftar Konsumen ."
          />
          <div className="mt-6 flex justify-between items-center">
            <SearchAndFiltering
              searching={searching}
              setSearching={handleSearchChange}
              placeholder="Cari Konsumen"
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
            data={dataKonsumen}
            columns={columns}
            searching={searching}
            setSearching={handleSearchChange}
          />
        </div>
      )}
    </Layout>
  );
}

export default Customer;
