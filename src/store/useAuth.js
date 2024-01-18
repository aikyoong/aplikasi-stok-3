import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import supabase from "@/config/supabaseClient";
import toast from "react-hot-toast";
import localforage from "localforage";

const useAuth = create(
  persist(
    (set, get) => ({
      authUser: null, // Inisialisasi dengan null atau data default sesuai kebutuhan
      isLoggedIn: false, // default value

      login: async (email, password) => {
        let { data, error } = await supabase.auth.signInWithPassword({
          email: `${email}`,
          password: `${password}`,
        });

        if (!error) {
          set({ authUser: data, isLoggedIn: true });

          localforage.setItem("authUser", JSON.stringify(data));
          toast.success(`Login berhasil`);
        } else {
          toast.error(`Email / password tidak valid`);
        }

        if (error) {
          throw new Error("Could not login");
        }
        return data;
      },

      logout: async () => {
        let { error } = await supabase.auth.signOut();
        if (!error) {
          toast.success(`Logout berhasil`);
          localforage.removeItem("authUser");
          set({ authUser: null, isLoggedIn: false });
        }
      },

      // setLastActive: () => {
      //   set({ lastActive: new Date() });
      // },

      // checkInactivity: () => {
      //   const now = dayjs(new Date());
      //   const lastActive = dayjs(get().lastActive);
      //   if (now.diff(lastActive, "minute") > 10) {
      //     get().logout();
      //   }
      // },
    }),
    {
      name: "auth-storage", // Nama item di storage (harus unik)
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;
