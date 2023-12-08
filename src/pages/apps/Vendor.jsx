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
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import { Outlet, redirect, useNavigate } from "react-router-dom";

// SCHEMA VALIDATION
const formAddSchema = z.object({
  nama_vendor: z.string().min(3, {
    message: "Nama Vendor harus lebih dari 5 karakter.",
  }),
  alamat: z.string().min(5, {
    message: "Nama Barang harus lebih dari 5 karakter.",
  }),
});

// FUNCTIONS
async function fetchVendor() {
  const { data, error } = await supabase.from("vendor").select("*");
  if (error) {
    throw new Error("Could not fetch master_barang");
  }
  return data;
}

async function deleteVendor(IDVendor) {
  const { data, error, status } = await supabase
    .from("vendor") // Menggunakan tabel master_barang
    .delete()
    .match({ idvendor: IDVendor }); // Menghapus baris berdasarkan idvendor

  if (error) {
    console.error("Error deleting data:", error);
    return;
  }

  if (status === 204) {
    console.log("success mendelete");
    toast.success(`Sukses Menghapus vendor dengan id vendor ${IDVendor}`);
  }

  console.log("Barang deleted:", data);
  console.log("Status", status);
}

async function addVendor(nama_vendor, alamat) {
  const { data, error, status } = await supabase
    .from("vendor")
    .insert([{ nama_vendor, alamat }]);

  if (error) {
    console.error("Error adding data:", error);
    return;
  }

  if (status === 201) {
    toast.success(`Berhasil menambahkan Vendor ${nama_vendor}`);
  } else if (status === 409) {
    toast.error(
      `Maaf untuk Barang dengan kode produk ${nama_vendor} sudah tersedia`
    );
  }

  console.log("Barang added:", data);
}

// HEADER + POPUP TAMBAH
const HeaderPageAndAddProduct = ({ data, namaHalaman, desc, vendor }) => {
  return (
    <div className="sm:flex sm:items-center mx-5 md:mx-0 sm:justify-between mt-12">
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
        <PopUpAddVendor namaHalaman={namaHalaman} />
      </div>
    </div>
  );
};

function PopUpAddVendor({ namaHalaman }) {
  const form = useForm({
    resolver: zodResolver(formAddSchema),
    defaultValues: {
      nama_vendor: "", // Nilai default untuk kode_barang
      alamat: "", // Nilai default untuk nama_barang
    },
  });

  function onSubmit(values) {
    const nama_vendor = values.nama_vendor;
    const alamat = values.alamat;

    addVendor(nama_vendor, alamat);
    console.log(nama_vendor, alamat);
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
                name="nama_vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Perusahaan Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="PT.." {...field} />
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
                    <FormLabel>Alamat Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat Lengkap Vendor" {...field} />
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
function Vendor() {
  const navigate = useNavigate();

  const { isLoggedIn, userInfo, login, logout } = useAuth();
  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate("/");
    }, 1200);
  }
  // Fetching
  const { data: dataVendor, error: fetchError } = useQuery({
    queryKey: ["vendor"],
    queryFn: fetchVendor,
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

  // Column Vendor
  const columns = useMemo(
    () => [
      {
        id: "nama_vendor",
        header: "Nama Vendor",
        accessorKey: "nama_vendor", // accessor adalah "key" dalam data
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
          const IDVendorEchRow = cellProps.row.original.idvendor;
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
                  <MenubarItem onClick={() => deleteVendor(IDVendorEchRow)}>
                    Hapus
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          );
        },
      },
      // {
      //   id: "role",
      //   header: "Role",
      //   accessorKey: "role",
      //   cell: (roles) => {
      //     const rolesz = roles.row.original.role;

      //     if (rolesz === 3) {
      //       return <p>Super Admin</p>;
      //     } else if (rolesz === 2) {
      //       return <p>Admin</p>;
      //     } else if (rolesz === 1) {
      //       return <p>Sales</p>;
      //     }
      //     return <>{rolesz}</>;
      //   },
      // },
    ],
    []
  );

  return (
    <Layout>
      <p>{fetchError && `${fetchError}`}</p>
      {dataVendor && (
        <div className="max-w-5xl mx-auto">
          <HeaderPageAndAddProduct
            data={dataVendor}
            namaHalaman="Vendor"
            desc="Berikut adalah daftar vendor untuk perusahaan ini."
          />
          <div className="mt-6 flex justify-between items-center">
            <SearchAndFiltering
              searching={searching}
              setSearching={handleSearchChange}
              placeholder="Cari Vendor"
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
            data={dataVendor}
            columns={columns}
            searching={searching}
            setSearching={handleSearchChange}
          />
        </div>
      )}
    </Layout>
  );
}

export default Vendor;
