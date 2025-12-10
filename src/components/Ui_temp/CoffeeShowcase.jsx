import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { formatPrice } from "@/utils/formatCurrency";

const CoffeeShowcase = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    // 1. Lấy Menu
    const fetchMenu = async () => {
      const { data } = await supabase
        .from("coffees")
        .select("*")
        .order("id", { ascending: true });
      if (data) setMenuItems(data);
    };

    // 2. Lấy 4 Ảnh Decor (Cố định ID 1->4)
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("coffee_gallery")
        .select("*")
        .order("id", { ascending: true });
      if (data) setGalleryImages(data);
    };

    fetchMenu();
    fetchGallery();
  }, []);

  return (
    <section
      id="coffee-section"
      className="py-24 bg-[#0a0a0a] text-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Coffee className="w-10 h-10 text-gold mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-serif text-gold tracking-widest mb-3">
            COFFEE MENU
          </h2>
          <div className="w-24 h-[1px] bg-gold/50 mx-auto"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* CỘT TRÁI: MENU LIST (TEXT ONLY) */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-xl text-gray-400 font-serif mb-8 tracking-widest border-l-4 border-gold pl-4 uppercase">
              Signature Drinks
            </h3>
            <div className="space-y-6">
              {menuItems.map((drink, index) => (
                <motion.div
                  key={drink.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-end justify-between mb-1">
                    <h4 className="text-lg font-bold text-gray-200 uppercase tracking-wide">
                      {drink.name}
                    </h4>
                    <div className="flex-1 mx-4 border-b border-dashed border-gray-700 mb-1.5 opacity-50"></div>
                    <span className="text-gold font-bold">
                      {formatPrice(drink.price)}
                      <span className="text-xs">₫</span>
                    </span>
                  </div>
                  {drink.description && (
                    <p className="text-sm text-gray-500 italic pl-1">
                      {drink.description}
                    </p>
                  )}
                </motion.div>
              ))}
              {menuItems.length === 0 && (
                <p className="text-gray-600 italic">Menu đang cập nhật...</p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: 4 ẢNH DECOR (LẤY TỪ coffee_gallery) */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((id, index) => {
                const imgData = galleryImages.find((g) => g.id === id);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`relative aspect-[4/5] rounded-lg overflow-hidden border border-gray-800 shadow-2xl ${
                      index % 2 !== 0 ? "mt-8 md:mt-12" : ""
                    }`}
                  >
                    <img
                      src={
                        imgData?.image_url ||
                        "https://via.placeholder.com/400x500?text=Decor"
                      }
                      alt="Decor"
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110 grayscale hover:grayscale-0"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoffeeShowcase;
