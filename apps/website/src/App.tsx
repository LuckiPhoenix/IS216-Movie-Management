import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Home from "./pages/home/Home.tsx";
import Movies from "./pages/movie/Movies.tsx";
import Theater from "./pages/movie/Theater.tsx";
import Seats from "./pages/movie/Seats.tsx";
import Snacks from "./pages/movie/Snacks.tsx";
import Payment from "./pages/movie/Payment.tsx";
import BookingConfirmation from "./pages/movie/BookingConfirmation.tsx";

import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";

import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import AdminRooms from "./pages/admin/AdminRooms.tsx";
import AdminMovies from "./pages/admin/AdminMovies.tsx";
import AdminFoods from "./pages/admin/AdminFoods.tsx";
import AdminShowtimes from "./pages/admin/AdminShowtimes.tsx";
import AdminStaff from "./pages/admin/AdminStaff.tsx";

import StaffDashboard from "./pages/staff/StaffDashboard.tsx";
import StaffPOS from "./pages/staff/POS.tsx";
import FoodPOS from "./pages/staff/FoodPOS.tsx";
import StaffHistory from "./pages/staff/StaffHistory.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= AUTH ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= USER ROUTES ================= */}
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/movies" element={<MainLayout><Movies /></MainLayout>} />
        <Route path="/theater" element={<MainLayout><Theater /></MainLayout>} />
        <Route path="/seats" element={<MainLayout><Seats /></MainLayout>} />
        <Route path="/snacks" element={<MainLayout><Snacks /></MainLayout>} />
        <Route path="/payment" element={<MainLayout><Payment /></MainLayout>} />
        <Route path="/confirmation" element={<MainLayout><BookingConfirmation /></MainLayout>} />

        {/* ================= STAFF ROUTES ================= */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/pos" element={<StaffPOS />} />
        <Route path="/staff/food" element={<FoodPOS />} />
        <Route path="/staff/history" element={<StaffHistory />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/showtimes" element={<AdminShowtimes />} />
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/foods" element={<AdminFoods />} />
        <Route path="/admin/cinemas" element={<AdminRooms />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/analytics" element={<AdminDashboard />} /> {/* Placeholder */}

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<MainLayout><Home /></MainLayout>} />
      </Routes>
    </Router>
  );
}