import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { supabase } from "@/supabaseClient";

const ServiceSection = () => {
  const [imgLeft, setImgLeft] = useState(null);
  const [imgRight, setImgRight] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      // Lấy danh sách ảnh từ bảng gallery
      const { data } = await supabase.from("service_gallery").select("*");
      if (data) {
        setImgLeft(data.find((item) => item.id === 1)?.image_url);
        setImgRight(data.find((item) => item.id === 2)?.image_url);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section className="py-24 bg-[#080808] text-white border-t border-gold/10 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Giới thiệu (Giữ nguyên) */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-gold border border-gold/30 px-4 py-1 rounded-full text-xs tracking-[0.2em] mb-6">
              <Wrench size={14} /> REPAIR SERVICE
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              WATCH <span className="text-gold italic">MEDIC</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Hồi sinh cỗ máy thời gian của bạn với tiêu chuẩn Thụy Sĩ. Chúng
              tôi cung cấp dịch vụ lau dầu, đánh bóng và thay thế linh kiện
              chính hãng.
            </p>
            <button
              onClick={() =>
                window.open("https://www.facebook.com/ducminh100793", "_blank")
              }
              className="bg-gold text-black px-8 py-3 font-bold hover:bg-white transition shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              ĐẶT LỊCH NGAY
            </button>
          </div>

          {/* 2 Ảnh từ Admin */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ẢNH TRÁI (ID: 1) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg border border-gray-800 group h-64 md:h-80"
            >
              <img
                src={
                  imgLeft ||
                  "https://via.placeholder.com/400x600?text=Service+1"
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </motion.div>

            {/* ẢNH PHẢI (ID: 2) - Nằm thụt xuống 1 chút cho nghệ thuật (md:mt-12) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg border border-gray-800 group h-64 md:h-80 md:mt-12"
            >
              <img
                src={
                  imgRight ||
                  "https://via.placeholder.com/400x600?text=Service+2"
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
