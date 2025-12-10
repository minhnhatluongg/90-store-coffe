import React from "react";
import { MapPin, Phone, ShoppingBag, Coffee } from "lucide-react"; // Icon cho đẹp

const Header = () => {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleBooking = () => {
    window.open("https://www.facebook.com/ducminh100793", "_blank");
  };
  return (
    <div className="w-full z-40 relative">
      {/* 1. TOP BAR: Hiển thị địa chỉ & SĐT (Màu đen đậm) */}
      <div className="bg-[#0f0f0f] text-gray-400 text-xs py-2 px-4 md:px-8 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:text-gold transition-colors cursor-pointer">
            <MapPin size={14} />
            <span>90 Lý Thường Kiệt, Phường 7,Quận 10, TP.HCM</span>{" "}
            {/* Thay địa chỉ thật của bạn */}
          </div>
          <div className="hidden md:flex items-center gap-1 hover:text-gold transition-colors cursor-pointer">
            <Phone size={14} />
            <span>0833679967</span>
          </div>
        </div>
        <div className="uppercase tracking-widest font-serif text-[10px]">
          Open: 07:00 - 22:00
        </div>
      </div>

      {/* 2. MAIN NAVBAR: Menu chính (Nền đen mờ sang trọng) */}
      <header className="bg-black text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 border-b border-gold/20 shadow-lg">
        {/* Logo chữ (Vì logo hình đã ở giữa banner rồi) */}
        <h1
          className="text-xl font-serif font-bold text-gold tracking-[0.2em] cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          90 STORE
        </h1>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-gray-300">
          {/* NÚT HOME: Về đầu trang */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-gold transition-colors"
          >
            HOME
          </button>
          {/* NÚT WATCHES: Cuộn xuống đồng hồ */}
          <button
            onClick={() => handleScrollTo("watches-section")}
            className="hover:text-gold transition-colors flex items-center gap-1"
          >
            <ShoppingBag size={16} /> WATCHES
          </button>

          {/* NÚT COFFEE: Cuộn xuống cafe */}
          <button
            onClick={() => handleScrollTo("coffee-section")}
            className="hover:text-gold transition-colors flex items-center gap-1"
          >
            <Coffee size={16} /> COFFEE
          </button>

          {/* NÚT CONTACT: Cuộn xuống chân trang (Footer) */}
          <button
            onClick={() => handleScrollTo("footer-section")} // Nhớ thêm id="footer-section" vào footer ở App.jsx
            className="hover:text-gold transition-colors"
          >
            WATCH MEDIC
          </button>
        </nav>

        {/* NÚT BOOKING */}
        <button
          onClick={handleBooking}
          className="hidden md:block border border-gray-600 px-4 py-1 text-xs hover:border-gold hover:text-gold transition"
        >
          BOOKING
        </button>

        {/* Menu Mobile Icon (Nếu cần sau này) */}
        <div className="md:hidden text-gold">MENU</div>
      </header>
    </div>
  );
};

export default Header;
