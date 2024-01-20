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
    .single()
    .select();

  if (error) {
    console.error("Error adding data:", error);
    toast.error(`Maaf ada kesalahan ketika menambahkan transaksi`);
    return null;
  }

  return data.idtransaksi; // Mengembalikan idtransaksi dari transaksi yang baru ditambahkan
}

async function addItemTransaksi(items) {
  const { data, error } = await supabase.from("penjualan_produk").insert(items);

  if (error) {
    console.error("Error adding items:", error);
    toast.error(`Maaf ada kesalahan ketika menambahkan item transaksi`);
    return false;
  }

  return data;
}

const TambahPenjualan = () => {
  const [transactionCompleted, setTransactionCompleted] = useState(false);

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitEnabled = () => {
    const idkonsumen = form.watch("idkonsumen");
    const tanggaltransaksi = form.watch("tanggaltransaksi");
    const statuspembayaran = form.watch("statuspembayaran");

    return (
      idkonsumen &&
      tanggaltransaksi &&
      statuspembayaran &&
      isItemsFinalized &&
      items.length > 0 &&
      !isSubmitting
    );
  };

  function onSubmit(values) {
    if (isSubmitting) return; // Jika sudah dalam proses submit, hentikan fungsi
    setIsSubmitting(true); // Mulai proses submit

    const totalBarang = totalQuantity;
    const totalHarga = totalPrice;
    const { tanggaltransaksi, idkonsumen, statuspembayaran } = values;

    addTransaksi(
      idkonsumen,
      tanggaltransaksi,
      totalBarang,
      totalHarga,
      statuspembayaran
    )
      .then(async (idtransaksi) => {
        if (idtransaksi) {
          // struktur items untuk sesuai dengan tabel penjualan_produk
          const itemsFormatted = values?.items.map((item) => ({
            idtransaksi,
            kodebarang: item.productName, // Pastikan ini adalah kode barang
            jumlah_barang: item.quantity,
            harga_per_item: item.unitPrice,
          }));

          // console.log("Transaksi ID:", idtransaksi);
          // console.log("itemsFormatted:", itemsFormatted);

          // Tunggu sampai semua item transaksi berhasil ditambahkan
          const stats = await addItemTransaksi(itemsFormatted);
          if (stats) {
            setTransactionCompleted(true); // Transaksi error, sembunyikan tombol
            toast.error(`Gagal menambahkan detail produk ke transaksi.`);
          } else {
            setTransactionCompleted(true); // Transaksi berhasil, sembunyikan tombol
            toast.success(`Transaksi dan detail produk berhasil ditambahkan.`);
          }
          setIsSubmitting(false); // Setelah selesai, set kembali isSubmitting menjadi false
        } else {
          toast.error(`Gagal membuat transaksi.`);
          // Lakukan tindakan untuk menangani error
        }
      })
      .catch(() => {
        setIsSubmitting(false); // Juga set kembali isSubmitting menjadi false jika terjadi error
      })
      .finally(() => {
        setIsSubmitting(false); // Proses selesai, setel isSubmitting kembali ke false
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

  // console.log("dataProduk", dataProduk);

  const konsumenOption = konsumenData?.map((konsumen) => ({
    value: konsumen.idkonsumen,
    label: konsumen.nama_konsumen,
  }));

  const productOptions = dataProduk?.map((product) => ({
    value: product.kodebarang,
    label: product.nama_barang,
  }));

  // const statusPembayaranOptions = [
  //   { value: "lunas", label: "Lunas" },
  //   { value: "belum lunas", label: "Belum Lunas" },
  // ];

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

  //

  return (
    <Layout>
      <div className=" max-w-5xl md:mx-auto py-12 mx-5 ">
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
                                  isDisabled={isItemsFinalized}
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
                          readOnly={isItemsFinalized}
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
                            readOnly={isItemsFinalized}
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
                                          isDisabled={isItemsFinalized}
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
                                    readOnly={isItemsFinalized}
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap relative">
                          <FormField
                            control={form.control}
                            name={`items[${index}].quantity`}
                            rules={{
                              validate: {
                                lessThanStock: (value) => {
                                  const product = dataProduk.find(
                                    (p) =>
                                      p.kodebarang === items[index].productName
                                  );
                                  if (product && +value > product.stok_barang) {
                                    return `Maksimal stok yang tersedia adalah ${product.stok_barang}`;
                                  }
                                  return true;
                                },
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  readOnly={isItemsFinalized}
                                  onChange={(e) => {
                                    const product = dataProduk.find(
                                      (p) =>
                                        p.kodebarang ===
                                        items[index].productName
                                    );
                                    let value = parseInt(e.target.value, 10);
                                    // Jika nilai yang diinput lebih besar dari stok_barang, set nilai dengan stok_barang
                                    if (
                                      product &&
                                      value > product.stok_barang
                                    ) {
                                      value = product.stok_barang;
                                      toast.error(
                                        `Maksimal stok yang tersedia untuk ${product.nama_barang} adalah ${product.stok_barang}`
                                      );
                                    }
                                    // Pastikan nilai tidak negatif
                                    value = value < 0 ? 0 : value;
                                    field.onChange(value);
                                  }}
                                />
                                {dataProduk && (
                                  <p className="text-[10px] absolute top-0 right-0 bg-slate-100 rounded-full">
                                    Jumlah stok tersedia{" "}
                                    {
                                      dataProduk.find(
                                        (p) =>
                                          p.kodebarang ===
                                          items[index].productName
                                      )?.stok_barang
                                    }
                                  </p>
                                )}
                                {/* {dataProduk && (
                                  <progress
                                    value={field.value}
                                    max={
                                      dataProduk.find(
                                        (p) =>
                                          p.kodebarang ===
                                          items[index].productName
                                      )?.stok_barang
                                    }
                                  ></progress>
                                )} */}

                                {/* {error && (
                                  <p className="text-red-500">
                                    {error.message}
                                  </p>
                                )} */}
                              </>
                            )}
                          />
                        </td>

                        <td className="px-2 py-2 whitespace-nowrap ">
                          <Controller
                            control={control}
                            name={`items[${index}].total`}
                            render={({ field }) => (
                              <span className="text-sm text-center font-semibold">
                                {field.value}
                              </span> // Format angka ke bentuk lokal
                            )}
                          />
                        </td>

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
                    type="button"
                    className="py-2 mx-4 px-4 border text-blue-500 border-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
                    onClick={addItem}
                  >
                    + Tambah Barang
                  </button>
                )}

                {!isItemsFinalized && (
                  <button
                    type="button"
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
              {!transactionCompleted && (
                <Button
                  type="submit"
                  className="mt-4 py-6"
                  disabled={!isSubmitEnabled() || isSubmitting}
                >
                  Buat Transaksi
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default TambahPenjualan;
