import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";
import { supabase } from "@/supabaseClient";

const HeroSplit = () => {
  // Cấu trúc state mới: Lưu cả url và position
  const [leftData, setLeftData] = useState({
    url: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000",
    pos: "center",
  });
  const [rightData, setRightData] = useState({
    url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000",
    pos: "center",
  });

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase.from("hero_settings").select("*");
      if (data) {
        const left = data.find((i) => i.id === 1);
        const right = data.find((i) => i.id === 2);

        if (left?.image_url)
          setLeftData({ url: left.image_url, pos: left.position || "center" });
        if (right?.image_url)
          setRightData({
            url: right.image_url,
            pos: right.position || "center",
          });
      }
    };
    fetchHeroImages();
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full flex flex-col md:flex-row overflow-hidden bg-black">
      {/* CỘT TRÁI: WATCHES */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full group cursor-pointer overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-gold/20">
        <div
          className="absolute inset-0 bg-cover transition-transform duration-1000 group-hover:scale-110"
          style={{
            backgroundImage: `url('${leftData.url}')`,
            backgroundPosition: leftData.pos, // <--- ÁP DỤNG VỊ TRÍ TẠI ĐÂY
          }}
        >
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 p-4 transform transition-transform duration-500 group-hover:-translate-y-2">
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-[0.2em] mb-4 drop-shadow-lg text-center">
            TIMEPIECES
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollTo("watches-section");
            }}
            className="border border-white/50 text-white px-6 py-2 hover:bg-gold hover:border-gold hover:text-black transition-all duration-300 uppercase text-xs tracking-[0.3em]"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* CỘT PHẢI: COFFEE */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full group cursor-pointer overflow-hidden border-t-2 md:border-t-0 md:border-l-2 border-gold/20">
        <div
          className="absolute inset-0 bg-cover transition-transform duration-1000 group-hover:scale-110"
          style={{
            backgroundImage: `url('${rightData.url}')`,
            backgroundPosition: rightData.pos, // <--- ÁP DỤNG VỊ TRÍ TẠI ĐÂY
          }}
        >
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 p-4 transform transition-transform duration-500 group-hover:-translate-y-2">
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold tracking-[0.2em] mb-4 drop-shadow-lg text-center">
            COFFEE VIBE
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollTo("coffee-section");
            }}
            className="border border-white/50 text-white px-6 py-2 hover:bg-gold hover:border-gold hover:text-black transition-all duration-300 uppercase text-xs tracking-[0.3em]"
          >
            Visit Coffee Shop
          </button>
        </div>
      </div>

      {/* LOGO Ở GIỮA (Giữ nguyên) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="absolute inset-0 bg-gold blur-[30px] opacity-20 rounded-full animate-pulse"></div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="group relative w-32 h-32 md:w-44 md:h-44 rounded-full border-[4px] border-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] bg-black overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
        >
          <img
            src={logo}
            alt="Center Logo"
            className="w-[98%] h-[98%] object-cover rounded-full transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSplit;
