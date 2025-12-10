import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import {
  Upload,
  Trash2,
  LogOut,
  Coffee,
  Watch,
  Settings,
  Layout,
  Image as ImageIcon,
  CheckCircle,
  Grid,
  XCircle,
  Star,
} from "lucide-react";

// --- COMPONENT THẺ SẢN PHẨM (DÙNG CHUNG CHO WATCHES & COFFEE) ---
const AdminProductCard = ({ item, tableName, onReload }) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description || "");
  const [isFeatured, setIsFeatured] = useState(item.is_featured || false);
  const [fbLink, setFbLink] = useState(item.facebook_url || ""); // Link FB riêng cho đồng hồ

  const [isChanged, setIsChanged] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Kiểm tra xem có thay đổi dữ liệu không
  useEffect(() => {
    if (
      name !== item.name ||
      price !== item.price ||
      description !== (item.description || "") ||
      fbLink !== (item.facebook_url || "")
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [name, price, description, fbLink, item]);

  // Hàm Update thông tin
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const payload = { name, price, description };
      if (tableName === "watches") payload.facebook_url = fbLink; // Chỉ đồng hồ mới update link FB

      const { error } = await supabase
        .from(tableName)
        .update(payload)
        .eq("id", item.id);
      if (error) throw error;

      await onReload();
      setIsChanged(false);
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Hàm Xóa sản phẩm
  const handleDelete = async () => {
    if (!confirm("Xóa sản phẩm này vĩnh viễn?")) return;
    await supabase.from(tableName).delete().eq("id", item.id);
    onReload();
  };

  // Hàm Bật/Tắt hiển thị trang chủ (Chỉ cho Watches)
  const toggleFeatured = async () => {
    try {
      const newValue = !isFeatured;
      setIsFeatured(newValue); // Update UI ngay cho mượt
      await supabase
        .from(tableName)
        .update({ is_featured: newValue })
        .eq("id", item.id);
    } catch (err) {
      setIsFeatured(!isFeatured); // Revert nếu lỗi
      alert("Lỗi: " + err.message);
    }
  };

  // Hàm Gỡ ảnh
  const handleRemoveImage = async () => {
    if (!confirm("Gỡ ảnh khỏi sản phẩm này?")) return;
    await supabase
      .from(tableName)
      .update({ image_url: null })
      .eq("id", item.id);
    onReload();
  };

  // Hàm Đổi ảnh
  const handleChangeImage = async (file) => {
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    await supabase.storage.from("products").upload(fileName, file);
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    await supabase
      .from(tableName)
      .update({ image_url: data.publicUrl })
      .eq("id", item.id);
    onReload();
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col gap-3 group transition-all duration-300 ${
        isFeatured
          ? "border-gold ring-1 ring-gold shadow-gold/20"
          : "border-gray-200"
      }`}
    >
      {/* HEADER CARD: ID & FEATURED */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          ID: {item.id}
        </span>

        {/* Nút Ngôi Sao (Chỉ hiện cho Đồng Hồ) */}
        {tableName === "watches" && (
          <button
            onClick={toggleFeatured}
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full transition-all ${
              isFeatured
                ? "bg-gold text-black shadow-sm"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            title={isFeatured ? "Đang hiện trang chủ" : "Đang ẩn"}
          >
            {isFeatured ? <Star size={12} fill="black" /> : <Star size={12} />}
            {isFeatured ? "Hiện" : "Ẩn"}
          </button>
        )}
      </div>

      {/* ẢNH SẢN PHẨM */}
      <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden group/img border border-gray-200">
        {item.image_url ? (
          <img src={item.image_url} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-3 transition-opacity">
          <label
            htmlFor={`p-img-${item.id}`}
            className="cursor-pointer text-white flex flex-col items-center text-[10px] hover:text-gold"
          >
            <ImageIcon size={20} /> Thay ảnh
          </label>
          {item.image_url && (
            <button
              onClick={handleRemoveImage}
              className="text-white flex flex-col items-center text-[10px] hover:text-red-500"
            >
              <XCircle size={20} /> Gỡ ảnh
            </button>
          )}
          <input
            type="file"
            id={`p-img-${item.id}`}
            className="hidden"
            onChange={(e) => handleChangeImage(e.target.files[0])}
          />
        </div>
      </div>

      {/* INPUTS EDIT */}
      <div className="flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded text-sm font-bold bg-gray-50 outline-none focus:border-gold"
          placeholder="Tên sản phẩm"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded text-sm bg-gray-50 outline-none focus:border-gold"
          placeholder="Giá tiền"
        />

        {tableName === "coffees" && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded text-xs bg-gray-50 outline-none focus:border-gold"
            rows={2}
            placeholder="Mô tả món"
          />
        )}

        {tableName === "watches" && (
          <input
            value={fbLink}
            onChange={(e) => setFbLink(e.target.value)}
            className="w-full border p-2 rounded text-xs bg-blue-50 text-blue-800 outline-none focus:border-blue-500 placeholder:text-blue-300"
            placeholder="Link Facebook / Messenger"
          />
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
        {isChanged ? (
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="flex-1 bg-green-600 text-white py-2 rounded text-xs font-bold hover:bg-green-700 shadow-md"
          >
            {updating ? "..." : "Cập nhật"}
          </button>
        ) : (
          <div className="flex-1 text-center text-[10px] text-gray-400 font-bold flex items-center justify-center bg-gray-50 rounded border">
            Đã lưu
          </div>
        )}
        <button
          onClick={handleDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// --- TRANG ADMIN CHÍNH ---
const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("watches");
  const [items, setItems] = useState([]);

  // State Form Thêm Mới
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFbLink, setNewFbLink] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [adding, setAdding] = useState(false);

  // Galleries Data
  const [serviceGallery, setServiceGallery] = useState({});
  const [coffeeGallery, setCoffeeGallery] = useState({});
  const [heroGallery, setHeroGallery] = useState({});

  // --- AUTHENTICATION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();
    if (data) {
      setIsLoggedIn(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Sai thông tin đăng nhập!");
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isAdmin");
  };
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") setIsLoggedIn(true);
  }, []);

  // --- FETCH DATA ---
  useEffect(() => {
    if (!isLoggedIn) return;
    // Load dữ liệu tùy theo tab đang chọn
    if (activeTab === "hero") fetchHeroGallery();
    else if (activeTab === "services") fetchServiceGallery();
    else if (activeTab === "coffees") {
      fetchItems();
      fetchCoffeeGallery();
    } else fetchItems();
  }, [isLoggedIn, activeTab]);

  const fetchItems = async () => {
    const { data } = await supabase
      .from(activeTab)
      .select("*")
      .order("id", { ascending: false });
    setItems(data || []);
  };

  // Helper load gallery (dùng chung logic)
  const fetchGal = async (table, setter) => {
    const { data } = await supabase.from(table).select("*");
    if (data) {
      const map = {};
      data.forEach((i) => (map[i.id] = i.image_url));
      setter(map);
    }
  };
  const fetchServiceGallery = () =>
    fetchGal("service_gallery", setServiceGallery);
  const fetchCoffeeGallery = () => fetchGal("coffee_gallery", setCoffeeGallery);
  const fetchHeroGallery = () => fetchGal("hero_settings", setHeroGallery);

  // --- UPDATE GALLERY (Upload & Lưu) ---
  const handleUpdateGallery = async (table, id, file, reloadFunc) => {
    if (!file) return;
    const fileName = `gallery-${table}-${id}-${Date.now()}`;
    await supabase.storage.from("products").upload(fileName, file);
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    await supabase.from(table).upsert({ id: id, image_url: data.publicUrl });
    reloadFunc();
  };

  // --- REMOVE GALLERY (Xóa ảnh về null) ---
  const handleRemoveGallery = async (table, id, reloadFunc) => {
    if (!confirm("Gỡ ảnh khỏi vị trí này?")) return;
    await supabase.from(table).update({ image_url: null }).eq("id", id);
    reloadFunc();
  };

  // --- ADD NEW ITEM ---
  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      let imageUrl = null;
      if (newImage) {
        const fileName = `${Date.now()}-${newImage.name}`;
        await supabase.storage.from("products").upload(fileName, newImage);
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const payload = { name: newName, price: newPrice, image_url: imageUrl };
      if (activeTab === "coffees") payload.description = newDesc;
      if (activeTab === "watches") payload.facebook_url = newFbLink;

      await supabase.from(activeTab).insert([payload]);

      // Reset form
      setNewName("");
      setNewPrice("");
      setNewDesc("");
      setNewFbLink("");
      setNewImage(null);
      fetchItems();
      alert("Thêm thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  // --- GIAO DIỆN LOGIN ---
  if (!isLoggedIn)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded w-full max-w-md shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-black tracking-widest">
            ADMIN ACCESS
          </h2>
          <input
            className="w-full border p-3 mb-3 bg-gray-50 text-black outline-none focus:border-gold"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full border p-3 mb-6 bg-gray-50 text-black outline-none focus:border-gold"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-gold py-3 font-bold text-black hover:bg-yellow-600 transition">
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    );

  // --- GIAO DIỆN ADMIN ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-7xl mx-auto bg-white p-4 rounded-lg shadow-sm gap-4 border border-gray-100">
        <h1 className="text-xl font-bold uppercase flex items-center gap-2 tracking-wide">
          <span className="text-gold text-2xl">90</span> STORE MANAGER
        </h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${
              activeTab === "hero"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Layout size={14} /> HERO BANNER
          </button>
          <button
            onClick={() => setActiveTab("watches")}
            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${
              activeTab === "watches"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Watch size={14} /> ĐỒNG HỒ
          </button>
          <button
            onClick={() => setActiveTab("coffees")}
            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${
              activeTab === "coffees"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Coffee size={14} /> CAFE MENU
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 text-xs font-bold rounded flex items-center gap-2 transition ${
              activeTab === "services"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <Settings size={14} /> DỊCH VỤ
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 font-bold text-xs flex items-center gap-1 ml-4 hover:text-red-700"
          >
            <LogOut size={14} /> THOÁT
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* --- TAB HERO BANNER --- */}
        {activeTab === "hero" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((id) => (
              <div
                key={id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center group relative"
              >
                <h3 className="font-bold mb-4 uppercase text-gold tracking-widest">
                  {id === 1 ? "BANNER TRÁI (WATCHES)" : "BANNER PHẢI (COFFEE)"}
                </h3>
                <div className="w-full h-80 bg-gray-100 mb-4 rounded overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                  {heroGallery[id] ? (
                    <img
                      src={heroGallery[id]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">
                      Trống (Sẽ hiện ảnh mặc định)
                    </span>
                  )}
                  {/* Nút Gỡ Ảnh */}
                  {heroGallery[id] && (
                    <button
                      onClick={() =>
                        handleRemoveGallery(
                          "hero_settings",
                          id,
                          fetchHeroGallery
                        )
                      }
                      className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  id={`hero-${id}`}
                  className="hidden"
                  onChange={(e) =>
                    handleUpdateGallery(
                      "hero_settings",
                      id,
                      e.target.files[0],
                      fetchHeroGallery
                    )
                  }
                />
                <label
                  htmlFor={`hero-${id}`}
                  className="bg-black text-white px-8 py-3 rounded cursor-pointer font-bold text-xs hover:bg-gray-800 tracking-wide"
                >
                  THAY ẢNH NỀN
                </label>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB SERVICE --- */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((id) => (
              <div
                key={id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center group"
              >
                <h3 className="font-bold mb-4 uppercase text-gray-500">
                  VỊ TRÍ ẢNH {id}
                </h3>
                <div className="h-64 bg-gray-100 mb-4 rounded overflow-hidden flex items-center justify-center relative border border-gray-200">
                  {serviceGallery[id] ? (
                    <img
                      src={serviceGallery[id]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="text-gray-300" size={40} />
                  )}
                  {serviceGallery[id] && (
                    <button
                      onClick={() =>
                        handleRemoveGallery(
                          "service_gallery",
                          id,
                          fetchServiceGallery
                        )
                      }
                      className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  id={`srv-${id}`}
                  className="hidden"
                  onChange={(e) =>
                    handleUpdateGallery(
                      "service_gallery",
                      id,
                      e.target.files[0],
                      fetchServiceGallery
                    )
                  }
                />
                <label
                  htmlFor={`srv-${id}`}
                  className="bg-gold px-6 py-2 rounded cursor-pointer font-bold text-xs text-black hover:bg-yellow-500"
                >
                  UPLOAD ẢNH
                </label>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB CAFE --- */}
        {activeTab === "coffees" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Form Thêm Món */}
              <div className="bg-white p-6 rounded-lg border border-gold/30 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                  <Coffee size={18} /> THÊM MÓN MỚI
                </h3>
                <form onSubmit={handleAdd} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Tên món
                      </label>
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="VD: Bạc Xỉu"
                        className="w-full border p-2 rounded text-sm bg-gray-50 text-black focus:border-gold outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Giá bán
                      </label>
                      <input
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="VD: 35000"
                        className="w-full border p-2 rounded text-sm bg-gray-50 text-black focus:border-gold outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Mô tả hương vị
                    </label>
                    <input
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="VD: Đậm đà, béo ngậy..."
                      className="w-full border p-2 rounded text-sm bg-gray-50 text-black focus:border-gold outline-none"
                    />
                  </div>
                  <button
                    disabled={adding}
                    className="bg-black text-white font-bold py-3 rounded text-sm hover:bg-gray-800 uppercase tracking-widest mt-2"
                  >
                    {adding ? "Đang xử lý..." : "+ THÊM VÀO MENU"}
                  </button>
                </form>
              </div>
              {/* Danh sách */}
              <div>
                <h3 className="font-bold text-gray-400 mb-3 text-xs uppercase tracking-wide">
                  MENU HIỆN TẠI ({items.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <AdminProductCard
                      key={item.id}
                      item={item}
                      tableName="coffees"
                      onReload={fetchItems}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Phần 4 Ảnh Decor */}
            <div className="lg:col-span-1">
              <div className="bg-white p-5 rounded-lg shadow-sm sticky top-4 border border-gray-100">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gold uppercase text-sm tracking-wide">
                  <Grid size={18} /> 4 ẢNH DECOR
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="text-center group relative">
                      <div className="aspect-square bg-gray-100 rounded overflow-hidden mb-2 border border-gray-200 relative group/img">
                        {coffeeGallery[id] ? (
                          <img
                            src={coffeeGallery[id]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            Trống
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <label
                            htmlFor={`cof-${id}`}
                            className="cursor-pointer text-white hover:text-gold"
                          >
                            <ImageIcon size={20} />
                          </label>
                          {coffeeGallery[id] && (
                            <button
                              onClick={() =>
                                handleRemoveGallery(
                                  "coffee_gallery",
                                  id,
                                  fetchCoffeeGallery
                                )
                              }
                              className="text-white hover:text-red-500"
                            >
                              <XCircle size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="file"
                        id={`cof-${id}`}
                        className="hidden"
                        onChange={(e) =>
                          handleUpdateGallery(
                            "coffee_gallery",
                            id,
                            e.target.files[0],
                            fetchCoffeeGallery
                          )
                        }
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        VỊ TRÍ {id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB WATCHES --- */}
        {activeTab === "watches" && (
          <div className="space-y-8">
            {/* Form Thêm Đồng Hồ */}
            <div className="bg-white p-6 rounded-lg border border-gold/30 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                <Watch size={18} /> THÊM ĐỒNG HỒ MỚI
              </h3>
              <form
                onSubmit={handleAdd}
                className="flex flex-col md:flex-row gap-4 items-end"
              >
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Tên đồng hồ
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nhập tên..."
                    className="w-full border p-2 rounded text-sm bg-gray-50 text-black focus:border-gold outline-none"
                    required
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Giá bán
                  </label>
                  <input
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Nhập giá..."
                    className="w-full border p-2 rounded text-sm bg-gray-50 text-black focus:border-gold outline-none"
                    required
                  />
                </div>
                <div className="w-full md:w-auto">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Ảnh sản phẩm
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    className="text-xs bg-gray-50 p-2 rounded border w-full"
                    required
                  />
                </div>
                <button
                  disabled={adding}
                  className="w-full md:w-auto bg-black text-white font-bold py-2.5 px-8 rounded text-sm hover:bg-gray-800 uppercase tracking-widest whitespace-nowrap"
                >
                  {adding ? "..." : "+ THÊM NGAY"}
                </button>
              </form>

              {/* Input thêm Link FB (Optional khi thêm mới) */}
              <div className="mt-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Link FB / Messenger (Tùy chọn)
                </label>
                <input
                  value={newFbLink}
                  onChange={(e) => setNewFbLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full border p-2 rounded text-sm bg-blue-50 text-blue-800 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Danh sách Đồng Hồ */}
            <div>
              <h3 className="font-bold text-gray-400 mb-4 text-xs uppercase tracking-wide">
                DANH SÁCH ĐỒNG HỒ ({items.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <AdminProductCard
                    key={item.id}
                    item={item}
                    tableName="watches"
                    onReload={fetchItems}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
