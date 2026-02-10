import ModernNavbar from "../../components/layout/ModernNavbar";
import CombinedHero from "./CombinedHero";
import ModernServices from "./ModernServices";
import Community from "./Community";
import FAQ from "./FAQ";
import Footer from "../../components/layout/Footer";

function Landing() {
  return (
    <div className="min-h-screen">
      <ModernNavbar />
      <CombinedHero />
      <ModernServices />
      <Community />
      <FAQ />
      <Footer />
    </div>
  );
}

export default Landing;
