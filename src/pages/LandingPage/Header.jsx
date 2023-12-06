import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="absolute top-8 left-0 z-10 flex w-full items-center bg-[#164b1a]">
      <div className="container">
        <div className="relative flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <p
              href="#home"
              className="block py-6 text-sm font-montserrat font-semibold text-white tracking-[.25em]"
            >
              PT. TIMUR JAYA PLASINDO
            </p>
          </div>
          <div>
            <Link
              to={"/masuk"}
              className="block py-6 text-sm font-montserrat font-semibold text-white hover:text-white active:text-white tracking-[.25em]"
            >
              MASUK
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
