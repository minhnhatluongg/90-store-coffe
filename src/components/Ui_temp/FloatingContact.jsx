import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Facebook, X, MessageSquare } from "lucide-react";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      id: "phone",
      icon: <Phone size={20} />,
      label: "0833679967",
      color: "bg-green-600",
      action: () => window.open("tel:0833679967", "_self"),
    },
    {
      id: "zalo",
      icon: <div className="font-bold text-xs">Zalo</div>,
      label: "Chat Zalo",
      color: "bg-blue-600",
      action: () => window.open("https://zalo.me/0833679967", "_blank"),
    },
    {
      id: "facebook",
      icon: <Facebook size={20} />,
      label: "Messenger",
      color: "bg-[#0084FF]",
      action: () =>
        window.open("https://www.facebook.com/ducminh100793", "_blank"),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* DANH SÁCH CÁC NÚT CON (HIỆN KHI BẤM MỞ) */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3 items-end mb-2">
            {contacts.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
                onClick={item.action}
                className={`flex items-center gap-3 group`}
              >
                {/* Tooltip chữ bên trái */}
                <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </span>

                {/* Icon tròn */}
                <div
                  className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* NÚT CHÍNH (TOGGLE) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center justify-center text-white transition-colors relative z-50 ${
          isOpen ? "bg-gray-800" : "bg-gold"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <MessageSquare size={24} fill="white" />
              {/* Hiệu ứng sóng lan tỏa (Pulse) để gây chú ý */}
              <span className="absolute -inset-4 rounded-full border border-white/50 animate-ping opacity-75"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
export default FloatingContact;
