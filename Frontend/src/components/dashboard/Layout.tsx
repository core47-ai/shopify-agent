
import React from "react";
import { DashboardSidebar } from "./Sidebar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="glass-morphism sticky top-0 z-50 py-3 px-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient-primary">CODVerify</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Home size={16} />
              Back to Home
            </Button>
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
