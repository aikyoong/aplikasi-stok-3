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
import { RefreshCw, ListPlus } from "lucide-react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import toast from "react-hot-toast";
import * as z from "zod";

// FUNCTIONS FETCHING
async function fetchKonsumen() {
  const { data, error } = await supabase.from("konsumen").select("*");
  if (error) {
    throw new Error("Could not fetch konsumen");
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

// FUNCTIONS INSERTS
async function addTransaksi(
  idkonsumen,
  tanggaltransaksi,
  totalitem,
  totalharga,
  statuspembayaran
) {
  const { data, error, status } = await supabase
    .from("transaksi_penjualan")
    .insert([
      { idkonsumen, tanggaltransaksi, totalitem, totalharga, statuspembayaran },
    ])
    .select();
  // .returning("idtransaksi"); // Mengambil nilai id dari baris yang baru saja ditambahkan

  console.log("Response from Supabase:", data, error, status);

  if (error) {
    console.error("Error adding data:", error);
    return null; // Kembalikan null jika ada error
  }

  if (status === 201) {
    toast.success(`Berhasil menambahkan transaksi`);
    console.log("idtransaksi:", data[0].idtransaksi); // Menampilkan idtransaksi dari baris yang baru saja ditambahkan
    return data[0].idtransaksi; // Mengembalikan idtransaksi dari baris data yang ditambahkan
  } else {
    toast.error(`Maaf ada kesalahan ketika menambahkan transaksi`);
    return null; // Kembalikan null jika ada error
  }
}

async function addItemTransaksi(array) {
  const { data, error, status } = await supabase
    .from("detailpenjualan")
    .insert(array)
    .select();
  // .returning("idtransaksi"); // Mengambil nilai id dari baris yang baru saja ditambahkan

  console.log("Response from Supabase:", data, error, status);

  if (error) {
    console.error("Error adding data:", error);
    return null; // Kembalikan null jika ada error
  }

  if (status === 201) {
    toast.success(`Berhasil menambahkan item kedalam transaksi`);
  } else {
    toast.error(`Maaf ada kesalahan ketika menambahkan item transaksi`);
    return null; // Kembalikan null jika ada error
  }
}

const TransactionForm = () => {
  const form = useForm({
    defaultValues: {
      statuspembayaran: "",
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

  function onSubmit(values) {
    console.log("values", values);
    console.log("values", values.items);

    const totalBarang = totalQuantity;
    const totalHarga = totalPrice;
    const { tanggaltransaksi, idkonsumen, statuspembayaran } = values;

    addTransaksi(
      idkonsumen,
      tanggaltransaksi,
      totalBarang,
      totalHarga,
      statuspembayaran
    ).then((idtransaksi) => {
      if (idtransaksi) {
        const detailItems = items.map((item) => ({
          idtransaksipenjualan: idtransaksi,
          kodebarang: item.productName,
          jumlah: item.quantity,
          hargasatuan: item.unitPrice,
        }));

        console.log("Transaksi ID:", idtransaksi);
        addItemTransaksi(detailItems);
        // Anda bisa melakukan tindakan lain dengan idtransaksi di sini
      }
    });
  }

  const { data: konsumenData, error: fetchError2 } = useQuery({
    queryKey: ["konsumen"],
    queryFn: fetchKonsumen,
  });

  const { data: dataProduk, error: fetchError } = useQuery({
    queryKey: ["master_barang"],
    queryFn: fetchMasterBarang,
  });

  const konsumenOption = konsumenData?.map((konsumen) => ({
    value: konsumen.idkonsumen,
    label: konsumen.nama_konsumen,
  }));

  const productOptions = dataProduk?.map((product) => ({
    value: product.kodebarang,
    label: product.nama_barang,
  }));

  const statusPembayaranOptions = [
    { value: "lunas", label: "Lunas" },
    { value: "belum lunas", label: "Belum Lunas" },
  ];

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
    const idkonsumen = form.watch("idkonsumen");
    const tanggaltransaksi = form.watch("tanggaltransaksi");
    const statuspembayaran = form.watch("statuspembayaran");

    // Memeriksa apakah semua syarat terpenuhi termasuk item telah ditetapkan
    return (
      idkonsumen &&
      tanggaltransaksi &&
      statuspembayaran &&
      isItemsFinalized &&
      items.length > 0 // Pastikan ada setidaknya satu item
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
                <h2 className="text-lg font-medium mb-3">Konsumen</h2>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="idkonsumen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Konsumen
                        </FormLabel>
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
                                  className="mt-1 block w-full border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          pilih konsumen yang membeli
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div>
                    <Label
                      htmlFor="tanggaltransaksi"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Transaksi
                    </Label>
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
                </div>
                <div>
                  {/* <FormField
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
                  /> */}
                  <FormField
                    control={form.control}
                    name="statuspembayaran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Pembayaran</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Status Pembayaran"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Cantumkan status pembayaran.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

export default TransactionForm;
