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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth — full-screen, không có header/footer */}
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Các route chính sử dụng MainLayout */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/theater" element={<Theater />} />
                <Route path="/seats" element={<Seats />} />
                <Route path="/snacks" element={<Snacks />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/confirmation" element={<BookingConfirmation />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
