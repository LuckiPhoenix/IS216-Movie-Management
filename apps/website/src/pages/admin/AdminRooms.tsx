import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.tsx";
import { Plus, Edit2, Trash2, Search, ArrowUpDown } from "lucide-react";
import type { Room } from "../../types/cinema.ts";
import RoomModals from "./components/RoomModals.tsx";
import { DEFAULT_TYPE_CONFIGS } from "../../types/cinema.ts";

const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    roomId: "ROOM-001",
    name: "Grand Theater 1",
    description: "Standard large screen with premium sound system.",
    rowCount: 10,
    colCount: 12,
    seats: [],
    seatTypeConfigs: DEFAULT_TYPE_CONFIGS,
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "2",
    roomId: "ROOM-002",
    name: "VIP Lounge 1",
    description: "Exclusive VIP experience with recliners.",
    rowCount: 6,
    colCount: 8,
    seats: [],
    seatTypeConfigs: DEFAULT_TYPE_CONFIGS,
    createdAt: "2024-03-21T14:30:00Z",
  },
];

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this room? This action cannot be undone.",
      )
    ) {
      setRooms(rooms.filter((r) => r.id !== id));
    }
  };

  const handleSaveRoom = (room: Room) => {
    if (editingRoom) {
      setRooms(rooms.map((r) => (r.id === room.id ? room : r)));
    } else {
      setRooms([
        ...rooms,
        { ...room, id: Math.random().toString(36).substr(2, 9) },
      ]);
    }
    setIsModalOpen(false);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Cinema Rooms
            </h1>
            <p className="text-gray-500 font-medium">
              Manage your theater layout and seat configurations.
            </p>
          </div>
          <button
            onClick={handleAddRoom}
            className="flex items-center gap-2 bg-linear-to-r from-tickify-pink to-tickify-purple px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,128,0.3)] hover:shadow-[0_0_30px_rgba(255,0,128,0.5)] transition-all"
          >
            <Plus size={20} />
            Add New Room
          </button>
        </div>

        <div className="bg-tickify-card border border-white/5 rounded-4xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-tickify-pink transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="px-8 py-6">
                    Room ID <ArrowUpDown size={12} className="inline ml-1" />
                  </th>
                  <th className="px-8 py-6">Name</th>
                  <th className="px-8 py-6">Capacity</th>
                  <th className="px-8 py-6">Dimensions</th>
                  <th className="px-8 py-6">Created At</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-8 py-6 font-bold text-tickify-pink">
                      {room.roomId}
                    </td>
                    <td className="px-8 py-6">{room.name}</td>
                    <td className="px-8 py-6">
                      {room.rowCount * room.colCount} Seats
                    </td>
                    <td className="px-8 py-6 text-gray-400">
                      {room.rowCount}R x {room.colCount}C
                    </td>
                    <td className="px-8 py-6 text-gray-500">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-tickify-cyan transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <RoomModals
          room={editingRoom}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRoom}
          existingRooms={rooms}
        />
      )}
    </AdminLayout>
  );
}
