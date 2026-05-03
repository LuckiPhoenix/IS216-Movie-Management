import { 
  Monitor, 
  History, 
  LogOut, 
  User,
  Ticket
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function StaffSideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      icon: <Monitor size={20} />,
      label: "POS (Booking)",
      path: "/staff/pos",
    },
    { 
      icon: <History size={20} />, 
      label: "Order History",
      path: "/staff/history" 
    },
  ];

  return (
    <aside className="w-80 bg-tickify-card border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-tickify-cyan rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,242,0.4)]">
            <Ticket size={20} className="text-tickify-dark" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white leading-none">
              TICKIFY
            </h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">
              Staff Portal
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-full transition-all font-bold text-xs uppercase tracking-widest ${
                  isActive
                    ? "bg-linear-to-r from-tickify-cyan to-blue-500 text-tickify-dark shadow-[0_0_25px_rgba(0,255,242,0.4)]"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded-full bg-tickify-cyan flex items-center justify-center text-tickify-dark shadow-[0_0_15px_rgba(0,255,242,0.3)]">
            <User size={20} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white leading-tight">
              Staff Name
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Counter #01</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full text-gray-500 hover:text-tickify-pink transition-all font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
