import { Link } from "react-router-dom";
import React from "react"; // Import React
import Logo from "./logo/tjp.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import useAuth from "@/store/useAuth";

import SideNavHorz from "../sidenav/SideNavHorz";

function Header() {
  const { isLoggedIn, login, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="text-sm py-2 bg-[#e6e5df]">
      <div className="flex justify-between max-w-5xl mx-auto items-center">
        <Link to="/">
          <img src={Logo} alt="logo" className="max-w-[185px]" />
        </Link>
        <p className="text-2xl font-philoshoper">
          General Trading Company & Distribution Plastic
        </p>
        <NavigationMenus />

        <div className="flex space-x-6">
          {/* <button className="text-[#EDC997]">Register</button> */}
          {isLoggedIn === true ? (
            <button
              className="text-center px-6 py-2 border transition-all duration-300  border-[#EDC997] hover:bg-white hover:text-[#1F2732] rounded-md  font-medium"
              onClick={handleLogout}
            >
              Keluar
            </button>
          ) : (
            // <Link to="/masuk">
            //   <button className="text-center px-6 py-2 border transition-all duration-300 bg-orange-600 text-white   rounded-md  font-medium">
            //     Masuk
            //   </button>
            // </Link>
            <button
              className="text-center px-6 py-2 border transition-all duration-300 bg-orange-600 text-white   rounded-md  font-medium"
              onClick={handleLogout}
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

const components = [
  {
    title: "CRM",
    description:
      "Elevate your customer relationships with our CRM service. Manage customer data, interactions, and services to enhance their experience.",
    to: "/order",
  },
  {
    title: "Network Monitoring",
    description:
      "Keep a watchful eye on your network's health and performance in real-time. Detect disruptions and identify network issues swiftly with our Network Monitoring.",
    to: "/order",
  },
  {
    title: "Inventory Management",
    description:
      "Streamline your inventory of hardware and software essentials. Track inventory, handle purchases, sales, and maintenance seamlessly.",
    // to: "/order",
  },
  {
    title: "Network Management",
    description:
      "Take full control of your ISP network infrastructure. Manage network device configurations, performance monitoring, maintenance scheduling, and security.",
    // to: "/order",
  },
];

export function NavigationMenus() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-8  items-center">
        {/* <NavigationMenuItem className="-mr-4">
          <NavigationMenuTrigger className="bg-transparen">
            Feature
          </NavigationMenuTrigger>
          <NavigationMenuContent className="z-[500]">
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[525px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.to}
                >
                  {component.description}
                </ListItem>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem> */}

        {/* <NavigationMenuItem>
          <Link to="/pricing">Toko</Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <a href="">Cara Memesan</a>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/pricing">Tentang Kita</Link>
        </NavigationMenuItem> */}
        {/* <NavigationMenuItem>
          <a href="">Guide</a>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-[#1c2633] focus:text-accent-foreground",
          className
        )}
        activeProps={{ className: `font-bold` }}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 font-normal text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </Link>
    );
  }
);

export default Header;
