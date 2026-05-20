import { useState } from "react";
import StaffLayout from "../../layouts/StaffLayout";
import {
  History,
  Search,
  Ticket,
  CupSoda,
  DollarSign,
  Calendar,
  CheckCircle2,
  ShoppingBag
} from "lucide-react";

interface Transaction {
  id: string;
  type: "Ticket" | "Snack";
  dateTime: string;
  items: string;
  amount: number;
  paymentMethod: "Cash" | "Card" | "E-Wallet";
  status: "Completed" | "Refunded";
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-984021",
    type: "Ticket",
    dateTime: "2026-05-20, 09:45 AM",
    items: "Dune: Part Two (2x Regular - Row F)",
    amount: 24.0,
    paymentMethod: "Card",
    status: "Completed"
  },
  {
    id: "FB-104829",
    type: "Snack",
    dateTime: "2026-05-20, 09:40 AM",
    items: "Couple Combo (1x Popcorn, 2x Drink)",
    amount: 11.0,
    paymentMethod: "Cash",
    status: "Completed"
  },
  {
    id: "TX-984020",
    type: "Ticket",
    dateTime: "2026-05-20, 09:12 AM",
    items: "Godzilla x Kong (3x VIP - Row G)",
    amount: 45.0,
    paymentMethod: "E-Wallet",
    status: "Completed"
  },
  {
    id: "FB-104828",
    type: "Snack",
    dateTime: "2026-05-20, 08:55 AM",
    items: "1x Large Popcorn + 1x Coffee",
    amount: 9.9,
    paymentMethod: "Cash",
    status: "Completed"
  },
  {
    id: "TX-984019",
    type: "Ticket",
    dateTime: "2026-05-20, 08:30 AM",
    items: "Kung Fu Panda 4 (1x Couple - Row J)",
    amount: 25.0,
    paymentMethod: "Card",
    status: "Completed"
  },
  {
    id: "TX-984018",
    type: "Ticket",
    dateTime: "2026-05-20, 08:15 AM",
    items: "Dune: Part Two (2x Regular - Row D)",
    amount: 24.0,
    paymentMethod: "Card",
    status: "Refunded"
  }
];

export default function StaffHistory() {
  const [filterType, setFilterType] = useState<"All" | "Ticket" | "Snack">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesType = filterType === "All" || tx.type === filterType;
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalSales = MOCK_TRANSACTIONS.reduce((acc, tx) => {
    if (tx.status === "Completed") return acc + tx.amount;
    return acc;
  }, 0);

  const ticketSales = MOCK_TRANSACTIONS.reduce((acc, tx) => {
    if (tx.type === "Ticket" && tx.status === "Completed") return acc + tx.amount;
    return acc;
  }, 0);

  const snackSales = MOCK_TRANSACTIONS.reduce((acc, tx) => {
    if (tx.type === "Snack" && tx.status === "Completed") return acc + tx.amount;
    return acc;
  }, 0);

  return (
    <StaffLayout>
      <div className="space-y-10 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div>
          <div className="flex items-center gap-2 text-tickify-cyan mb-3">
            <History size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">
              Sales History
            </span>
          </div>
          <h1 className="text-5xl font-display font-bold text-white tracking-tight">
            Transaction History
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Overview of transactions handled during your current shift
          </p>
        </div>

        {/* Shift Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-tickify-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-tickify-cyan/5 rounded-full blur-3xl" />
            <div className="w-10 h-10 rounded-xl bg-tickify-cyan/15 flex items-center justify-center mb-4 text-tickify-cyan">
              <DollarSign size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-white">${totalSales.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Total Shift Sales</p>
          </div>

          <div className="bg-tickify-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-tickify-purple/5 rounded-full blur-3xl" />
            <div className="w-10 h-10 rounded-xl bg-tickify-purple/15 flex items-center justify-center mb-4 text-tickify-purple">
              <Ticket size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-white">${ticketSales.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">Ticket Revenues</p>
          </div>

          <div className="bg-tickify-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mb-4 text-amber-500">
              <CupSoda size={20} />
            </div>
            <p className="text-3xl font-display font-bold text-white">${snackSales.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-black">F&B Revenues</p>
          </div>
        </div>

        {/* Filter and Search controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-tickify-card/50 border border-white/5 rounded-2xl p-2 flex items-center gap-1.5 w-fit">
            <button
              onClick={() => setFilterType("All")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                filterType === "All"
                  ? "bg-tickify-cyan text-tickify-dark shadow-[0_0_12px_rgba(0,255,242,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType("Ticket")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                filterType === "Ticket"
                  ? "bg-tickify-cyan text-tickify-dark shadow-[0_0_12px_rgba(0,255,242,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Ticket size={14} /> Ticket
            </button>
            <button
              onClick={() => setFilterType("Snack")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                filterType === "Snack"
                  ? "bg-tickify-cyan text-tickify-dark shadow-[0_0_12px_rgba(0,255,242,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <CupSoda size={14} /> F&B
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by ID or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-tickify-card/50 border border-white/5 focus:border-tickify-cyan/30 rounded-2xl text-sm focus:outline-none transition-all placeholder-gray-500 text-white"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-tickify-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-black">
                  <th className="px-8 py-5">Tx ID</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Date & Time</th>
                  <th className="px-6 py-5">Items / Description</th>
                  <th className="px-6 py-5">Method</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.01] transition-colors text-xs font-bold">
                    <td className="px-8 py-5 text-white">{tx.id}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest font-black border ${
                        tx.type === "Ticket" 
                          ? "bg-tickify-purple/10 border-tickify-purple/20 text-tickify-purple" 
                          : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      }`}>
                        {tx.type === "Ticket" ? (
                          <>
                            <Ticket size={10} /> Ticket
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={10} /> F&B
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-600" />
                        {tx.dateTime}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-white font-medium max-w-xs truncate">{tx.items}</td>
                    <td className="px-6 py-5 text-gray-400">{tx.paymentMethod}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === "Completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {tx.status === "Completed" && <CheckCircle2 size={12} />}
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-8 py-5 text-right text-base ${
                      tx.status === "Completed" ? "text-white" : "text-gray-500 line-through"
                    }`}>
                      ${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <p className="text-gray-500 font-medium">No transactions found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
