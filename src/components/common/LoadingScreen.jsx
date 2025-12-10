import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";

export const LoadingScreen = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [isFinished, setIsFinished] = useState(false); // State để check khi nào loading xong
  const fullText = "90 WATCHES & COFFEE";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;

      // Khi chạy hết chữ
      if (index > fullText.length) {
        clearInterval(interval);
        setIsFinished(true); // Kích hoạt hiệu ứng xoay logo

        // Đợi 1.2s (đủ thời gian cho logo xoay xong) rồi mới vào web
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Container chứa Logo và Text */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10 md:mb-12">
        {/* LOGO - ĐÃ TO HƠN */}
        {/* Mobile: w-24 (96px) | PC: w-32 (128px) */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] border-gold shadow-[0_0_25px_#D4AF37] overflow-hidden p-1 relative">
          <img
            src={logo}
            alt="Logo"
            // Logic xoay: Nếu isFinished = true thì xoay 360 độ, ngược lại thì đứng yên (hoặc xoay về 0)
            className={`w-full h-full object-cover rounded-full transition-transform duration-1000 ease-in-out ${
              isFinished ? "rotate-[360deg]" : "rotate-0"
            }`}
          />
        </div>

        {/* TEXT - ĐÃ TO HƠN */}
        {/* Mobile: text-3xl | PC: text-6xl */}
        <div className="text-3xl md:text-6xl font-serif font-bold text-gold tracking-widest uppercase text-center md:text-left">
          {text}
          <span className="animate-blink ml-2 text-white">|</span>
        </div>
      </div>

      {/* THANH LOADING BAR */}
      <div className="w-[300px] md:w-[400px] h-[3px] bg-gray-900 rounded relative overflow-hidden">
        <div className="absolute top-0 bottom-0 w-24 bg-gold shadow-[0_0_20px_#D4AF37] animate-loading-bar rounded"></div>
      </div>

      <p className="mt-6 text-gray-500 text-sm tracking-[0.4em] font-serif">
        EST. 2025
      </p>
    </div>
  );
};
