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
import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import toast from "react-hot-toast";
import * as z from "zod";

// FUNCTIONS FETCHING
async function fetchVendor() {
  const { data, error } = await supabase.from("vendor").select("*");
  if (error) {
    throw new Error("Could not fetch master_barang");
  }
  return data;
}

async function fetchMasterBarang() {
  const { data, error } = await supabase.from("master_barang").select("*");
  if (error) {
    throw new Error("Could not fetch master_barang");
  }
  return data;
}

async function addSetorPembelian(items, idvendor, tanggal_pembelian) {
  const insertData = items.map((item) => ({
    idvendor,
    tanggal_pembelian,
    kodebarang: item.productName, // asumsi productName adalah kodebarang
    jumlah: item.quantity,
    totalharga: item.total,
  }));

  // const { data, error, status } = await supabase
  //   .from("transaksi_pembelian")
  //   .insert([{ jumlah, tanggal_pembelian, totalharga, idvendor, kodebarang }]);
  const { data, error, status } = await supabase
    .from("transaksi_pembelian")
    .insert(insertData)
    .select();

  if (error) {
    console.error("Error adding data:", error);
    return;
  }

  if (status === 201) {
    toast.success(`Berhasil menyetorkan barang`);
    return { success: true };
  } else {
    toast.error(`Maaf ada kesalahan ketika menyetorkan barang`);
  }

  console.log("setor added:", data);
}

// PAGES
const SetorProduk = () => {
  const navigate = useNavigate({ from: "/setor-barang" });

  const form = useForm({
    defaultValues: {
      items: [{ productName: "", quantity: 0, unitPrice: 0, total: 0 }],
    },
  });

  const { fields, append, remove, control } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Menggunakan `watch` untuk memantau perubahan pada `items`
  const items = form.watch("items");

  // Hitung total jumlah barang
  const totalQuantity = items.reduce(
    (total, item) => total + parseInt(item.quantity || 0),
    0
  );
  // Hitung total hargaa barang
  const totalPrice = items.reduce((sum, item) => sum + item.total, 0);

  useEffect(() => {
    items.forEach((item, index) => {
      // Hanya hitung ulang total jika quantity atau unitPrice berubah
      const total = item.quantity * item.unitPrice;
      form.setValue(`items[${index}].total`, total, { shouldValidate: true });
    });
  }, [items]);

  const addItem = () => {
    append({
      productName: "",
      quantity: 0,
      unitPrice: 0,
      total: 0,
    });
  };

  const removeItem = (index) => {
    remove(index);
  };

  const [isItemsFinalized, setIsItemsFinalized] = useState(false);

  const finalizeItems = () => {
    // Filter items yang telah dipilih (contoh: yang memiliki productName)
    const finalizedItems = form
      .getValues("items")
      .filter((item) => item.productName !== "");
    form.setValue("items", finalizedItems);

    setIsItemsFinalized(true);
  };

  const onSubmit = async (values) => {
    const { items, idvendor, tanggal_pembelian } = values;
    const result = await addSetorPembelian(items, idvendor, tanggal_pembelian);
    if (result.success) {
      navigate("/produk"); // Gunakan di sini
    }
  };

  const { data: dataVendor, error: fetchError2 } = useQuery({
    queryKey: ["vendor"],
    queryFn: fetchVendor,
  });

  const { data: dataProduk, error: fetchError } = useQuery({
    queryKey: ["master_barang"],
    queryFn: fetchMasterBarang,
  });

  const vendorOptions = dataVendor?.map((vendor) => ({
    value: vendor.idvendor,
    label: vendor.nama_vendor,
  }));

  const productOptions = dataProduk?.map((product) => ({
    value: product.kodebarang,
    label: product.nama_barang,
  }));

  // Fungsi untuk mengatur harga satuan berdasarkan produk yang dipilih
  const setUnitPrice = (index, kodebarang) => {
    const selectedProduct = dataProduk.find(
      (product) => product.kodebarang === kodebarang
    );
    if (selectedProduct) {
      form.setValue(`items[${index}].unitPrice`, selectedProduct.harga_jual, {
        shouldValidate: true,
      });
    }
  };

  const isSubmitEnabled = () => {
    const idvendor = form.watch("idvendor");
    const tanggal_pembelian = form.watch("tanggal_pembelian");

    // Memeriksa apakah semua syarat terpenuhi termasuk item telah ditetapkan
    return (
      idvendor && tanggal_pembelian && isItemsFinalized && items.length > 0 // Pastikan ada setidaknya satu item
    );
  };

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto py-12">
        <h1 className="text-2xl font-semibold mb-12">
          Tambah Transaksi Penjualan
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              {/* Konsumen Section */}

              <div className="md:col-span-1">
                <h2 className="text-lg font-medium mb-3">Vendor</h2>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="idvendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Dari Vendor
                        </FormLabel>
                        <FormControl>
                          <Controller
                            name="idvendor"
                            control={form.control}
                            render={({ field }) => {
                              // Menentukan nilai yang dipilih berdasarkan field.value
                              const selectedValue = vendorOptions?.find(
                                (option) => option.value === field.value
                              );

                              return (
                                <Select
                                  {...field}
                                  options={vendorOptions}
                                  value={selectedValue}
                                  onChange={(option) =>
                                    field.onChange(option.value)
                                  }
                                  className="mt-1 block w-full border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              );
                            }}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div>
                    <Label
                      htmlFor="tanggal_pembelian"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Pembelian
                    </Label>
                    <Controller
                      control={form.control}
                      name="tanggal_pembelian"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          type="date"
                          onChange={onChange}
                          value={value ?? ""} // Ensure value is never undefined
                        />
                      )}
                    />
                  </div>
                </div>
                {/* <div>
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
                            render={({ field }) => {
                              const selectedValue =
                                statusPembayaranOptions?.find(
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
                </div> */}
              </div>

              {/* Items Section */}

              <div className="md:col-span-4">
                <h2 className="text-lg font-medium mb-3">Item</h2>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Produk
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harga Satuan
                      </th>
                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Barang
                      </th>

                      <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {fields?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <FormField
                            control={form.control}
                            name={`items[${index}].productName`}
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <Controller
                                    name={`items[${index}].productName`}
                                    control={form.control}
                                    render={({ field }) => {
                                      // Menentukan nilai yang dipilih berdasarkan field.value
                                      const selectedValue =
                                        productOptions?.find(
                                          (option) =>
                                            option.value === field.value
                                        );

                                      return (
                                        <Select
                                          {...field}
                                          options={productOptions}
                                          value={selectedValue}
                                          onChange={(option) => {
                                            field.onChange(option.value);
                                            setUnitPrice(index, option.value);
                                          }}
                                        />
                                      );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <FormField
                            control={form.control}
                            name={`items[${index}].unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="1"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <FormField
                            control={form.control}
                            name={`items[${index}].quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="1"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>

                        <td className="px-2 py-2 whitespace-nowrap text-center font-bold">
                          <Controller
                            control={control}
                            name={`items[${index}].total`}
                            render={({ field }) => (
                              <span>{field.value}</span> // Format angka ke bentuk lokal
                            )}
                          />
                        </td>
                        {/* <td className="px-2 py-2 whitespace-nowrap text-center font-bold">
                          {item.total.toLocaleString()}
                        </td> */}
                        {!isItemsFinalized && (
                          <td>
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              X
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isItemsFinalized && (
                  <button
                    className="py-2 mx-4 px-4 border text-blue-500 border-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                    onClick={addItem}
                  >
                    + Tambah Barang
                  </button>
                )}

                {!isItemsFinalized && (
                  <button
                    className="py-2 mx-4 px-4 border text-green-500 border-green-600 font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
                    onClick={finalizeItems}
                  >
                    Tetapkan Item
                  </button>
                )}
              </div>
            </div>

            {/* Summary Section */}
            <div className="flex justify-end items-center mb-6">
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-lg font-medium">Total Produk:</span>
                  <span className="ml-2">{items?.length}</span>
                </div>
                <div className="text-right mb-2">
                  <span className="text-lg font-medium">
                    Total Jumlah Barang:
                  </span>
                  <span className="ml-2">{totalQuantity}</span>
                </div>
                <div>
                  <span className="text-lg font-medium">Total Harga:</span>
                  <span className="ml-2">{totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="mt-4 py-6"
                disabled={!isSubmitEnabled()}
              >
                Buat Transaksi
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default SetorProduk;
