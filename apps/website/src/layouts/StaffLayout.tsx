import type { ReactNode } from "react";

interface StaffLayoutProps {
  children: ReactNode;
}

export default function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-tickify-cyan/10 blur-3xl rounded-full" />

        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}