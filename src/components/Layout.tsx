import Header from "@/components/Main/Header";
import Footer from "@/components/Main/Footer";
import React, { type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import SideNavHorz from "./sidenav/SideNavHorz";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="font-poppins ">
      <div className="flex flex-col justify-between min-h-screen">
        <div>
          <Header />
          <SideNavHorz />
        </div>
        <section className="min-h-screen">{children}</section>
        <Footer />
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 1250,
          style: {
            background: "#ffff",
            color: "#4171ED",
          },
        }}
      />
    </div>
  );
}

export default Layout;
