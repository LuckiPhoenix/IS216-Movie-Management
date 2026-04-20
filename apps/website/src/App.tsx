import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Home from "./pages/home/Home.tsx";
import Movies from "./pages/movie/Movies.tsx";
import Theater from "./pages/movie/Theater.tsx";
import Seats from "./pages/movie/Seats.tsx";
import Snacks from "./pages/movie/Snacks.tsx";
import Payment from "./pages/movie/Payment.tsx";
import BookingConfirmation from "./pages/movie/BookingConfirmation.tsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.tsx";
import AdminProfile from "./pages/dashboard/AdminProfile.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/movies" element={<MainLayout><Movies /></MainLayout>} />
        <Route path="/theater" element={<MainLayout><Theater /></MainLayout>} />
        <Route path="/seats" element={<MainLayout><Seats /></MainLayout>} />
        <Route path="/snacks" element={<MainLayout><Snacks /></MainLayout>} />
        <Route path="/payment" element={<MainLayout><Payment /></MainLayout>} />
        <Route path="/confirmation" element={<MainLayout><BookingConfirmation /></MainLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/showtimes" element={<AdminDashboard />} /> {/* Placeholder */}
        <Route path="/admin/movies" element={<AdminDashboard />} /> {/* Placeholder */}
        <Route path="/admin/cinemas" element={<AdminDashboard />} /> {/* Placeholder */}
        <Route path="/admin/analytics" element={<AdminDashboard />} /> {/* Placeholder */}

        {/* Fallback route */}
        <Route path="*" element={<MainLayout><Home /></MainLayout>} />
      </Routes>
    </Router>
  );
}