import React from "react";
import StaffSideBar from "../components/StaffSideBar";

interface StaffLayoutProps {
  children: React.ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="flex min-h-screen bg-tickify-bg text-white">
      <StaffSideBar />
      <main className="flex-1 p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
