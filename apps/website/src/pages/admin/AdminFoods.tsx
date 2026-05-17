import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminFoodCard from "../home/components/FoodCard";
import {
  Plus,
  LayoutGrid,
  Popcorn,
  CupSoda,
  Candy,
  Combine,
  Users,
  type LucideIcon, // Thêm type này để fix lỗi 'any'
} from "lucide-react";
import type { FoodItem, FoodCategory } from "../../types/food";
import FoodFormPopup from "../../components/Popups/FoodFormPopup";

const MOCK_FOODS: FoodItem[] = [
  {
    id: 1,
    name: "Large Classic Popcorn",
    description: "Buttery and delicious, perfect for sharing",
    price: 85,
    category: "Popcorn",
    image_url: "https://www.freeiconspng.com/uploads/popcorn-png-15.png",
    is_popular: true,
  },
  {
    id: 2,
    name: "Medium Caramel Popcorn",
    description: "Sweet caramel coating on fresh popcorn",
    price: 75,
    category: "Popcorn",
    image_url:
      "https://www.pngarts.com/files/3/Popcorn-PNG-High-Quality-Image.png",
  },
  {
    id: 3,
    name: "Large Coca-Cola",
    description: "Ice-cold classic cola, 32oz",
    price: 55,
    category: "Drinks",
    image_url: "https://pngimg.com/d/cocacola_PNG19.png",
    is_popular: true,
  },
];

// Fix lỗi 'any' bằng cách định nghĩa type LucideIcon
const CATEGORIES: { label: FoodCategory; icon: LucideIcon }[] = [
  { label: "All Items", icon: LayoutGrid },
  { label: "Combos", icon: Combine },
  { label: "Couple Sets", icon: Users },
  { label: "Popcorn", icon: Popcorn },
  { label: "Drinks", icon: CupSoda },
  { label: "Candy", icon: Candy },
];

const AdminFoods: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FoodCategory>("All Items");
  // Chuyển sang sử dụng State để có thể thêm/xóa/sửa
  const [foods, setFoods] = useState<FoodItem[]>(MOCK_FOODS);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FoodItem | null>(null);

  const filteredFoods =
    activeTab === "All Items"
      ? foods
      : foods.filter((f) => f.category === activeTab);

  const handleOpenAdd = () => {
    setEditTarget(null);
    setIsPopupOpen(true);
  };

  const handleOpenEdit = (item: FoodItem) => {
    setEditTarget(item);
    setIsPopupOpen(true);
  };

  // --- LOGIC XÓA ---
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setFoods((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // --- LOGIC LƯU (THÊM & SỬA) ---
  const handleSave = (data: Partial<FoodItem>) => {
    // Validation cơ bản
    if (!data.name || !data.price || !data.category) {
      alert("Please fill in all required fields (Name, Price, Category)");
      return;
    }

    if (editTarget) {
      // Logic Cập nhật (Update)
      setFoods((prev) =>
        prev.map((item) =>
          item.id === editTarget.id ? ({ ...item, ...data } as FoodItem) : item,
        ),
      );
    } else {
      // Logic Thêm mới (Create)
      const maxId = foods.length > 0 ? Math.max(...foods.map((f) => f.id)) : 0;
      const newItem: FoodItem = {
        ...data,
        id: maxId + 1,
        image_url: data.image_url || "https://via.placeholder.com/400",
      } as FoodItem;

      setFoods((prev) => [...prev, newItem]);
    }

    setIsPopupOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-white">
              F&B Management
            </h1>
            <p className="text-gray-500 font-medium">
              Manage cinema snacks, drinks and combo deals.
            </p>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all border ${
                  isActive
                    ? "bg-tickify-cyan/10 border-tickify-cyan text-tickify-cyan shadow-[0_0_15px_rgba(0,255,242,0.2)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Foods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* Fix cảnh báo Tailwind: aspect-[4/5] -> aspect-4/5, rounded-[2rem] -> rounded-4xl */}
          <button
            onClick={handleOpenAdd}
            className="group relative aspect-4/5 border-2 border-dashed border-white/10 rounded-4xl flex flex-col items-center justify-center gap-4 hover:border-tickify-pink/50 hover:bg-tickify-pink/5 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-tickify-pink/20 transition-all">
              <Plus
                size={32}
                className="text-gray-500 group-hover:text-tickify-pink"
              />
            </div>
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-tickify-pink">
              Add New Item
            </span>
          </button>

          {/* List Items */}
          {filteredFoods.map((item) => (
            <AdminFoodCard
              key={item.id}
              item={item}
              onEdit={() => handleOpenEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}

          <FoodFormPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onSave={handleSave}
            itemToEdit={editTarget}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFoods;
