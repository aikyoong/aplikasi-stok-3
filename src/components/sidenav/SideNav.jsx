import React, { useState } from "react";
import {
  ChevronDown,
  LogOut,
  AppWindow,
  Package,
  FileText,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Logo from "@/components/main/logo/logo-dark.png";
import { Link } from "@tanstack/react-router";

// type MenuStates = {
//   dashboard: boolean;
//   invoice: boolean;
//   my_apps: boolean;
//   subs: boolean;
//   login: boolean;
//   olt: {
//     host: boolean | string | unknown;
//     onu: boolean | string | unknown;
//   };
//   dasa: {
//     sasa: boolean | string | unknown;
//     sasaBB: boolean | string | unknown;
//   };
// };

// type MenuItem = {
//   key: keyof MenuStates;
//   label: string;
//   icon: React.ReactNode;
//   subMenu?: SubMenuItem[];
//   search?: Record<string, unknown>;
//   activeOptions?: ActiveOptions;
//   divider?: boolean; // Tambahkan properti divider
//   menuTitle?: string; // Tambahkan properti menuTitle
// };

// interface ActiveOptions {
//   exact?: boolean;
//   includeHash?: boolean;
//   includeSearch?: boolean;
// }

// type SubMenuItem = {
//   key: string;
//   label: string;
//   to?: string;
//   search?: Record<string, unknown>;
//   activeOptions?: ActiveOptions;
//   subMenuV2?: SubMenuItemV2[];
// };

// type SubMenuItemV2 = {
//   key: string,
//   label: string,
//   to: string,
//   search?: Record<string, unknown>,
//   activeOptions?: ActiveOptions,
// };

function SideNav() {
  const [open, setOpen] = useState(true);
  const [menuStates, setMenuStates] = useState();

  // Fungsi untuk menampilkan atau menyembunyikan SubMenu
  const handleSubMenuToggle = (menuItem) => {
    setMenuStates((prevMenuStates) => ({
      ...prevMenuStates,
      [menuItem]: !prevMenuStates[menuItem],
    }));
  };

  // Fungsi untuk menampilkan atau menyembunyikan SubMenuV2
  const handleSubSubMenuToggle = (
    menuItemKey,
    subMenuItemKey // Use a type assertion to force a string
  ) => {
    setMenuStates((prevMenuStates) => {
      const updatedOlt = {
        ...prevMenuStates.olt,
        [subMenuItemKey]: !prevMenuStates.olt[subMenuItemKey],
      };

      return {
        ...prevMenuStates,
        [menuItemKey]: updatedOlt,
      };
    });
  };

  // const handleSubSubMenuToggle = (
  //   menuItemKey: keyof MenuStates,
  //   subMenuItemKey: string
  // ) => {
  //   setMenuStates((prevMenuStates) => {
  //     const updatedSubMenu = {
  //       ...prevMenuStates[menuItemKey],
  //       [subMenuItemKey]: !prevMenuStates[menuItemKey][subMenuItemKey],
  //     };

  //     return {
  //       ...prevMenuStates,
  //       [menuItemKey]: updatedSubMenu,
  //     };
  //   });
  // };

  const menuItems = [
    // {
    //   key: "dashboard",
    //   label: "Dashboard",
    //   subMenu: [
    //     {
    //       key: "financial-monitor",
    //       label: "Financial Monitor",
    //       to: "/financial-monitor",
    //     },
    //     {
    //       key: "perfomance-monitor",
    //       label: "Perfomance Monitor",
    //       to: "/perfomance-monitor",
    //     },
    //   ],
    //   icon: <LayoutDashboard />,
    //   divider: true, // Tambahkan divider
    //   menuTitle: "Dashboard", // Tambahkan menuTitle
    // },
    // {
    //   key: "olt",
    //   label: "OLT",
    //   subMenu: [
    //     {
    //       key: "host",
    //       label: "Host",
    //       to: "/host-list",
    //     },
    //     {
    //       key: "onu",
    //       label: "Onu",
    //       to: "/onu",
    //       subMenuV2: [
    //         {
    //           key: "onu-list",
    //           label: "Onu List",
    //           to: "/onu-list",
    //         },
    //         {
    //           key: "onu-idle-list",
    //           label: "Onu Idle List",
    //           to: "/onu-idle-list",
    //         },
    //       ],
    //     },
    //   ],
    //   icon: <LayoutDashboard />, // Gantilah ini dengan ikon SVG untuk Login
    // },
    // {
    //   key: "dasa",
    //   label: "DASA",
    //   subMenu: [
    //     {
    //       key: "sasa",
    //       label: "Sasa",
    //       to: "/sasa",
    //     },
    //     {
    //       key: "sasaBB",
    //       label: "SasaBB",
    //       to: "/sasasBB",
    //       subMenuV2: [
    //         {
    //           key: "asas-list",
    //           label: "asas List",
    //           to: "/asassa-list",
    //         },
    //         {
    //           key: "assa-idle-list",
    //           label: "saas Idle List",
    //           to: "/asas-idle-list",
    //         },
    //       ],
    //     },
    //   ],
    //   icon: <LayoutDashboard />, // Gantilah ini dengan ikon SVG untuk Login
    // },
    {
      key: "invoice",
      label: "Invoice",
      subMenu: [],
      icon: <FileText />, // Gantilah ini dengan ikon SVG untuk Login
    },
    {
      key: "subs",
      label: "Subscription",
      subMenu: [],
      icon: <Package />, // Gantilah ini dengan ikon SVG untuk Login
    },
    {
      key: "my_apps",
      label: "My App",
      subMenu: [],
      icon: <AppWindow />, // Gantilah ini dengan ikon SVG untuk Login
    },
  ];

  return (
    <div className="flex">
      <div className="md:w-64 xl:w-72 flex-col h-screen px-8 relative duration-300 border-r">
        <div className="pt-8">
          {/* <div className="flex items-center justify-between">
            <a
              href="#"
              className={`bg-blue-600 p-1.5 rounded flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer duration-500 ${
                open && "rotate-[360deg]"
              }`}
            >
              <svg
                className="w-5 h-5 text-white stroke-current"
                viewBox="0 0 24 24"
                fill="none"
              ></svg>
            </a>
            {open === true && (
              <Button
                onClick={() => {
                  // Toggle the open state
                  setOpen(!open);
                }}
                variant={"ghost"}
                className="px-1"
              >
                <ChevronLeft />
              </Button>
            )} 
          </div> */}
          <Link
            to="/"
            className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="max-w-[175px]" src={Logo} alt="logo" />
          </Link>
        </div>
        <ul className="pt-6 space-y-1 text-sky-950 flex-col">
          {menuItems.map(
            ({ key, label, subMenu, icon, divider, menuTitle }) => {
              return (
                <div key={key}>
                  {divider && (
                    <div className="pt-3">
                      <Separator className="mb-6" />
                      {open && (
                        <p className="text-gray-500 text-xs uppercase pb-3">
                          {menuTitle}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="cursor-pointer mb-0">
                    <li className="relative">
                      <Button
                        variant={"ghost"}
                        className={`${
                          open === false ? "px-2 py-2" : "w-full px-3 py-6"
                        } flex justify-between`}
                        onClick={() => {
                          handleSubMenuToggle(key); // Toggle the sub-menu state
                          if (open === false) {
                            // If the menu is currently closed, set it to open
                            setOpen(true);
                          }
                        }}
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
                        {open && subMenu && subMenu.length > 0 && (
                          <ChevronDown
                            className={
                              menuStates[key] === true ? "rotate-180" : ""
                            }
                          />
                        )}
                      </Button>
                    </li>
                  </div>
                  {subMenu && subMenu.length > 0 && menuStates[key] && (
                    <ul
                      className={`ml-4  ${
                        menuStates[key] === true ? "border-l-2" : "border-l-0"
                      } space-y-2`}
                    >
                      {subMenu.map(
                        ({
                          key: subKey,
                          label: subLabel,
                          subMenuV2,
                          // to,
                          // search,
                          // activeOptions,
                        }) => (
                          <div key={subKey}>
                            <li className="relative">
                              <Button
                                variant={"ghost"}
                                className={`w-48 ${
                                  open === false ? "px-2 py-2" : "ml-4 px-3"
                                } flex justify-between`}
                                onClick={() =>
                                  handleSubSubMenuToggle(key, subKey)
                                }
                              >
                                <div className="flex">
                                  {/* Icon SVG */}
                                  <span
                                    className={`${
                                      !open && "hidden"
                                    } origin-left duration-200`}
                                  >
                                    {subLabel}
                                  </span>
                                </div>
                              </Button>
                            </li>
                            {subMenuV2 && subMenuV2.length > 0 && (
                              <ul
                                className={`ml-4 space-y-2`}
                                style={{
                                  display:
                                    typeof menuStates[key] === "object" &&
                                    key === "olt" &&
                                    typeof menuStates[key]["host"] ===
                                      "boolean" && // Check if the property exists
                                    subKey === "host" // Ensure that subKey is "host"
                                      ? menuStates[key]["host"]
                                        ? "block"
                                        : "none"
                                      : "none",
                                }}
                              >
                                {subMenuV2.map(
                                  ({
                                    key: subKeyV2,
                                    label: subLabelV2,
                                    // to,
                                    // search,
                                    // activeOptions,
                                  }) => (
                                    <div key={subKeyV2}>
                                      <li className="relative">
                                        <Button
                                          variant={"ghost"}
                                          className={`w-48 ${
                                            open === false
                                              ? "px-2 py-2"
                                              : "ml-4 px-3"
                                          } flex justify-between`}
                                        >
                                          <div className="flex">
                                            {/* Icon SVG */}
                                            <span
                                              className={`${
                                                !open && "hidden"
                                              } origin-left duration-200`}
                                            >
                                              {subLabelV2}
                                            </span>
                                          </div>
                                        </Button>
                                      </li>
                                    </div>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        )
                      )}
                    </ul>
                  )}
                </div>
              );
            }
          )}
        </ul>
        <div className="relative  cursor-pointer text-sky-950/40">
          <Button
            variant={"ghost"}
            className={`${
              open === false ? "px-2 py-2" : "w-full px-3 py-6"
            } flex justify-between`}
          >
            <div className="flex">
              {/* Icon SVG */}
              <LogOut />
              <span
                className={`${!open && "hidden"} pl-3 origin-left duration-200`}
              >
                {"Logout"}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
