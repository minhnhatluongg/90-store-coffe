export const formatPrice = (amount) => {
  if (!amount) return "Liên hệ";
  if (isNaN(amount)) return amount;
  return new Intl.NumberFormat("vi-VN").format(amount);
};
