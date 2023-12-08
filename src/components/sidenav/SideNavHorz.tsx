import React, { useState } from "react";
import {
  PackageSearch,
  Users,
  PercentCircle,
  LocateFixed,
  Building2,
} from "lucide-react";
import { Button } from "../ui/button";

import { Link } from "react-router-dom";

function SideNavHorz() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    {
      key: "product",
      label: "Produk",
      icon: <PackageSearch />,
      to: "/produk",
    },
    {
      key: "vendor",
      label: "Vendor",
      icon: <Building2 />,
      to: "/vendor",
    },

    {
      key: "pelanggan",
      label: "Konsumen",
      icon: <LocateFixed />,
      to: "/konsumen",
    },
    {
      key: "penjualan",
      label: "Penjualan",
      icon: <PercentCircle />,
      to: "/penjualan",
    },

    {
      key: "tim",
      label: "Tim",
      icon: <Users />,
      to: "/tim",
    },
  ];

  return (
    <div className="bg-[#164b1a] text-white overflow-x-auto">
      <div className="flex justify-start max-w-5xl mx-auto py-1 ">
        <ul className="space-y-1  flex items-center space-x-4">
          {menuItems.map(({ key, label, icon, to }) => {
            return (
              <div key={key}>
                <div className="cursor-pointer mb-0">
                  <li className="relative">
                    {/* <Link to="/clientarea/my-invoice"> */}
                    <Link to={`${to}`}>
                      <Button
                        variant={"ghost"}
                        className={`${
                          open === false ? "px-2 py-2" : "w-full px-3 py-6"
                        } flex justify-between`}
                      >
                        <div className="flex">
                          {/* Icon SVG */}
                          {icon}
                          <span
                            className={`${
                              !open && "hidden"
                            } pl-3 origin-left duration-200`}
                          >
                            {label}
                          </span>
                        </div>
                      </Button>
                    </Link>
                  </li>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SideNavHorz;
