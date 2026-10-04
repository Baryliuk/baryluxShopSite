import Landing from "@/components/LandingPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewArrival from "@/components/NewArrival";
export default function Home() {
  return (
    <div className="bg-[#0D0E12]">
      <Header />
      <Landing/>
      <NewArrival/>
      <Footer/>
    </div>
  );
}
