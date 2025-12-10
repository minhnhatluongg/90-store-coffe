export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37", // Màu vàng vintage chuẩn
      },
      fontFamily: {
        serif: ["Georgia", "serif"], // Font sang trọng
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "loading-bar": "loading 1.5s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        loading: {
          "0%": { left: "-40%" }, // Bắt đầu từ ngoài bên trái
          "50%": { left: "20%" },
          "100%": { left: "100%" }, // Chạy sang phải
        },
      },
    },
  },
  plugins: [],
};
