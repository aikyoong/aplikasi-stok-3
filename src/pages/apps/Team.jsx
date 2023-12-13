import Layout from "@/components/Layout";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useMemo } from "react";
import supabase from "@/config/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import V8TableContainer from "@/components/Table/V8TableContainer";
import SearchAndFiltering from "@/components/aikyong_pages/Search";

function Team() {
  // Searching
  const [searching, setSearching] = useState("");
  const handleSearchChange = (value) => {
    setSearching(value);
  };
  // Tim
  const fetchTim = async () => {
    const { data, error } = await supabase.from("login").select("*");
    if (error) {
      throw new Error("Could not fetch login");
    }
    return data;
  };

  const { data: dataTim, error: fetchError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchTim,
  });

  console.log("timmm", dataTim);
  // Column Tim
  const columns = useMemo(
    () => [
      {
        id: "email",
        header: "Email",
        accessorKey: "email", // accessor adalah "key" dalam data
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
        cell: (roles) => {
          const rolesz = roles.row.original.role;

          if (rolesz === 3) {
            return <p>Super Admin</p>;
          } else if (rolesz === 2) {
            return <p>Admin</p>;
          } else if (rolesz === 1) {
            return <p>Sales</p>;
          }
          return <>{rolesz}</>;
        },
      },
    ],
    []
  );

  // console.log("supabase", supabase);
  // console.log("dataTim", dataTim);
  return (
    <Layout>
      <p>{fetchError && `${fetchError}`}</p>
      {dataTim && (
        <div className="max-w-5xl mx-auto">
          <HeaderPageAndAddProduct
            data={dataTim}
            namaHalaman="Tim"
            desc="Berikut adalah daftar pengguna aplikasi ini."
          />
          <SearchAndFiltering
            searching={searching}
            setSearching={handleSearchChange}
            placeholder="Cari Tim"
          />
          <V8TableContainer
            data={dataTim}
            columns={columns}
            searching={searching}
            setSearching={handleSearchChange}
          />
        </div>
      )}
    </Layout>
  );
}

export default Team;

const HeaderPageAndAddProduct = ({ data, namaHalaman, desc }) => {
  return (
    <div className="sm:flex sm:items-center mx-5 md:mx-0 sm:justify-between mt-12">
      <div>
        <div className="flex items-center gap-x-3">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white capitalize">
            {namaHalaman}
          </h2>

          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
            {data.length} pengguna
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{desc}</p>
      </div>

      <div className="flex items-center mt-4 gap-x-3"></div>
    </div>
  );
};
