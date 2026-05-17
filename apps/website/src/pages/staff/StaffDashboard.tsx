import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShoppingCart, History, LogOut, Film, Ticket, Users, Clock } from "lucide-react";
import { clearUserSession, getCurrentRole } from "../../utils/mockAuth";

const NAV_ITEMS = [
  { icon: ShoppingCart, label: "POS Bán vé", path: "/staff/pos" },
  { icon: History, label: "Lịch sử giao dịch", path: "/staff/history" },
];

const STATS = [
  { icon: Ticket, label: "Vé bán hôm nay", value: "128", color: "from-tickify-pink to-tickify-purple" },
  { icon: Users, label: "Khách hàng", value: "94", color: "from-tickify-cyan to-blue-600" },
  { icon: Film, label: "Phim đang chiếu", value: "12", color: "from-amber-500 to-orange-600" },
  { icon: Clock, label: "Ca làm việc", value: "08:00–17:00", color: "from-green-500 to-teal-600" },
];

export default function StaffDashboard() {
  const navigate = useNavigate();
  const role = getCurrentRole();

  const handleLogout = () => {
    clearUserSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Film size={18} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-display font-bold text-white">Tickify</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors font-semibold"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white mb-1">
            Chào buổi sáng, Nhân viên! 👋
          </h1>
          <p className="text-gray-400">Hôm nay bạn có 128 vé cần xử lý.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-display font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NAV_ITEMS.map(({ icon: Icon, label, path }, i) => (
            <motion.button
              key={path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => navigate(path)}
              className="bg-slate-900/60 border border-white/[0.06] rounded-2xl p-6 flex items-center gap-4 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                <Icon size={22} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white font-bold">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">Nhấn để truy cập</p>
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}
