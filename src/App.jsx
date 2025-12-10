import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoadingScreen } from "./components/common/LoadingScreen";
import HeroSplit from "./components/Ui_temp/HeroSplit";
import Header from "./components/common/Header";
import CoffeeShowcase from "./components/Ui_temp/CoffeeShowcase";
import FeaturedWatches from "./components/Ui_temp/FeaturedWatches";
import AdminPage from "./pages/AdminPage";
import ServiceSection from "./components/Ui_temp/ServiceSection";
import FloatingContact from "./components/Ui_temp/FloatingContact";
function MainApp() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="animate-[fadeIn_1s_ease-in-out] bg-[#050505] min-h-screen">
          {/* 1. Thanh Header luôn hiển thị trên cùng */}
          <Header />

          {/* 2. Phần Hero Banner (Đã nhỏ lại bớt) */}
          <HeroSplit />

          {/* 3. Demo nội dung bên dưới để thấy web không bị cụt */}
          <div className="py-10 text-center text-white/30 bg-black">
            <p className="font-serif tracking-widest text-[10px] animate-pulse">
              SCROLL TO EXPERIENCE
            </p>
            <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-gold/50 to-transparent mx-auto mt-2"></div>
          </div>
          {/* SECTION 2: COFFEE & VIBE */}
          <CoffeeShowcase />
          {/* SECTION 3: WATCHES SALES */}
          <FeaturedWatches />
          {/* SECTION 4: SERVICES */}
          <ServiceSection />
          {/* FOOTER (Tạm thời) */}
          <footer
            id="footer-section"
            className="py-8 bg-[#0a0a0a] text-center text-gray-600 text-xs border-t border-gray-900"
          >
            <p>&copy; 2025 90 WATCHES & COFFEE. Designed by You.</p>
          </footer>
          <FloatingContact />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Admin riêng biệt */}
        <Route path="/admin90" element={<AdminPage />} />
        {/* Route Trang chủ */}
        <Route path="/" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
