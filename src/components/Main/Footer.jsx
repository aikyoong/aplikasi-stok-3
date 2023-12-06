import Logo from "./logo/tjp.png";
import {
  faXTwitter,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  return (
    <footer className="text-sm py-6 bg-[#e6e5df]">
      <div className="max-w-5xl mx-auto space-y-3">
        <img src={Logo} alt="logo" className="max-w-[135px]" />
        <div className="w-1/3">
          <p className="font-semibold ">Alamat Perusahaan :</p>
          <p className="text-xs">
            Sukajadi, Kecamatan Talang Kelapa, Kabupaten Banyuasin,
            Sumatera Selatan 30961
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
