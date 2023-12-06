import Hero from "./images/hero.jpg";
import Visi from "./images/visi.jpg";
import Karyawan from "./images/karyawan.jpg";
import Contact from "./images/contact.jpg";
import Header from "./Header";

function Landing() {
  return (
    <>
      <Header />
      <img src={Hero} alt="heo image" className="min-h-screen" />
      <img src={Visi} alt="heo image" className="min-h-screen" />
      <img src={Karyawan} alt="heo image" className="min-h-screen" />
      <img src={Contact} alt="heo image" className="min-h-screen" />
    </>
  );
}

export default Landing;
