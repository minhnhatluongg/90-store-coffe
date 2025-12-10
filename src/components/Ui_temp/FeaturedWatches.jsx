import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Star, Facebook } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { formatPrice } from "@/utils/formatCurrency";

const FeaturedWatches = () => {
  const [watches, setWatches] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // 1. KHI VÀO WEB: Chỉ lấy 8 sản phẩm ĐƯỢC ĐÁNH DẤU SAO (is_featured = true)
  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("watches")
        .select("*")
        .eq("is_featured", true) // Lọc sản phẩm ưu tiên
        .order("id", { ascending: false }) // Mới nhất lên đầu
        .limit(8);

      if (data) setWatches(data);
    };
    fetchFeatured();
  }, []);

  // 2. XỬ LÝ NÚT "XEM TẤT CẢ" / "THU GỌN"
  const handleLoadMore = async () => {
    if (!isExpanded) {
      // Nếu đang đóng -> Bấm mở -> Tải thêm các sản phẩm KHÔNG ưu tiên
      setLoadingMore(true);
      const { data } = await supabase
        .from("watches")
        .select("*")
        .eq("is_featured", false) // Lấy phần còn lại
        .order("id", { ascending: false });

      if (data) {
        // Ghép danh sách cũ + mới
        setWatches((prev) => [...prev, ...data]);
        setIsExpanded(true);
      }
      setLoadingMore(false);
    } else {
      // Nếu đang mở -> Bấm thu gọn -> Chỉ giữ lại các sản phẩm ưu tiên
      setWatches((prev) => prev.filter((w) => w.is_featured === true));
      setIsExpanded(false);

      // Cuộn nhẹ lại lên đầu danh sách
      const el = document.getElementById("watches-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3. XỬ LÝ CLICK LIÊN HỆ (FACEBOOK)
  const handleContact = (watch) => {
    // Kiểm tra xem Admin có nhập link riêng cho sản phẩm này không
    if (watch.facebook_url && watch.facebook_url.trim() !== "") {
      window.open(watch.facebook_url, "_blank");
    } else {
      // Nếu không, mở trang cá nhân mặc định
      window.open("https://www.facebook.com/ducminh100793", "_blank");
    }
  };

  return (
    <section
      id="watches-section"
      className="py-20 bg-black text-white relative border-t border-gold/10"
    >
      <div className="container mx-auto px-4">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            Premium Selection
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2">
            TIMEPIECES
          </h2>
          <div className="w-20 h-[1px] bg-gold mx-auto mt-4"></div>
        </div>

        {/* --- GRID SẢN PHẨM --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {watches.map((watch) => (
              <motion.div
                key={watch.id}
                layout // Giúp animation sắp xếp mượt mà
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[#111] border border-gray-800 hover:border-gold/50 transition-all duration-300 rounded-lg overflow-hidden shadow-lg"
              >
                {/* ẢNH SẢN PHẨM */}
                <div
                  className="aspect-[3/4] overflow-hidden relative cursor-pointer"
                  onClick={() => handleContact(watch)}
                >
                  <img
                    src={
                      watch.image_url ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={watch.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Nhãn HOT (Chỉ hiện khi là Featured) */}
                  {watch.is_featured && (
                    <div className="absolute top-2 left-2 bg-gold text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md z-10">
                      <Star size={10} fill="black" /> HOT
                    </div>
                  )}

                  {/* Nút Overlay Liên Hệ (Hiện lên khi hover) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 font-bold cursor-pointer">
                    <Facebook size={20} /> LIÊN HỆ FACEBOOK
                  </div>
                </div>

                {/* THÔNG TIN SẢN PHẨM */}
                <div className="p-4 text-center">
                  <h3
                    className="text-lg font-serif tracking-wide text-gray-200 group-hover:text-gold transition-colors line-clamp-1"
                    title={watch.name}
                  >
                    {watch.name}
                  </h3>
                  <p className="text-gold font-bold text-lg mt-1">
                    {formatPrice(watch.price)}{" "}
                    <span className="text-xs align-top">₫</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- NÚT ĐIỀU KHIỂN (XEM THÊM / THU GỌN) --- */}
        <div className="text-center mt-16">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group border border-gold text-gold px-12 py-3 uppercase text-xs tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-300 inline-flex items-center gap-2 font-bold"
          >
            {loadingMore ? (
              "Đang tải..."
            ) : isExpanded ? (
              <>
                Thu gọn{" "}
                <ChevronUp
                  size={16}
                  className="group-hover:-translate-y-1 transition-transform"
                />
              </>
            ) : (
              <>
                Xem bộ sưu tập đầy đủ{" "}
                <ChevronDown
                  size={16}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWatches;
