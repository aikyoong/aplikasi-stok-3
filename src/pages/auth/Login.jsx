/* eslint-disable @typescript-eslint/no-unused-vars */
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "@/components/main/logo/tjp.png";
import Input from "@/components/Form/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm, FormProvider } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import supabase from "@/config/supabaseClient";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import useAuth from "@/store/useAuth";
// import { Link, useNavigate } from "@tanstack/react-router";
import { useNavigate } from "react-router-dom";

const ValidationSchemaLogin = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(5, { message: "Password must be atleast 5 characters" }),
  //jika params true maka simpan ke HTTP cookie
  // rememberCheck: z.boolean(),
});

// FUNCTIONS
async function LoginApp(email, password) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: `${email}`,
    password: `${password}`,
  });
  if (error) {
    throw new Error("Could not login");
  }
  return data;
}

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false); // State untuk mengontrol tampilan password
  const methods = useForm({
    mode: "onTouched",
    resolver: zodResolver(ValidationSchemaLogin),
    // defaultValues: { rememberCheck: false },
  });

  const { handleSubmit, formState } = methods;
  const { errors } = formState;

  const navigate = useNavigate();
  // console.log("ini lication dari useNavigate", location);

  const Success = () => {
    toast.success("Your order has been confirmed");
  };

  const { isLoggedIn, authUser, login, logout } = useAuth();

  console.log("Isi Auth", authUser ?? "Belum login");

  if (isLoggedIn === true) {
    setTimeout(() => {
      navigate("/produk");
    }, 1950);
  }

  const onSubmit = async (data) => {
    console.log("yang disubmit", data);

    // LoginApp(email, password);
    try {
      // Periksa apakah formulir valid sebelum memanggil login
      const { email, password } = data;
      const isValid = await methods.trigger();
      if (isValid) {
        // await LoginApp(email, password);
        await login(email, password);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 1450,
          style: {
            background: "#ffff",
            color: "#4171ED",
          },
        }}
      />
      <section className="bg-slate-50 dark:bg-gray-900 h-[100svh]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img className="max-w-[240px]" src={Logo} alt="logo" />

          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold  leading-tight tracking-tight  text-gray-900 md:text-3xl dark:text-white">
                Selamat Datang
              </h1>
              <span className="text-sm  text-gray-800 text-center">
                Masuk untuk melanjutkan
              </span>
              <FormProvider {...methods}>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <Label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contoh@gmail.com"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <p className="text-xs text-red-500">
                      {errors?.email?.message}
                    </p>
                  </div>
                  {/* <div>
                    <Label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="•••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />
                    <p className="text-xs text-red-500">
                      {errors?.password?.message}
                    </p>
                  </div> */}
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"} // Menggunakan "text" atau "password" sesuai dengan showPassword
                      name="password"
                      id="password"
                      placeholder="••••••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />
                    <input
                      type="checkbox"
                      id="showPassword"
                      className="hidden"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <label
                      htmlFor="showPassword"
                      className="absolute inset-y-0 right-0 flex items-center pr-3  cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="text-xl text-gray-500" />
                      ) : (
                        <Eye size={20} className="text-xl text-gray-500" />
                      )}
                    </label>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Input
                          id="rememberCheck"
                          aria-describedby="rememberCheck"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          required=""
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <Label
                          htmlFor="rememberCheck"
                          className="text-gray-500 dark:text-gray-300"
                        >
                          Remember me
                        </Label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </a>
                  </div> */}
                  <Button
                    type="submit"
                    className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Masuk
                  </Button>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
