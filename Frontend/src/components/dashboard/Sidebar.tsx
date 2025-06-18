import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  List,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Phone,
  AlertTriangle,
  Search,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Order Confirmation",
    icon: MessageSquare,
    href: "/dashboard/order-confirmation",
  },
  {
    title: "Address Verification",
    icon: List,
    href: "/dashboard/fraud",
  },
  {
    title: "High Risk Areas",
    icon: AlertTriangle,
    href: "/dashboard/high-risk-areas",
  },
  {
    title: "Fake Order Detection",
    icon: AlertCircle,
    href: "/dashboard/fake-order-detection",
  },
  {
    title: "Return Management",
    icon: ShoppingCart,
    href: "/dashboard/returns",
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <aside
      className={cn(
        "glass-morphism h-screen sticky top-0 left-0 z-30 flex flex-col border-r border-white/10",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <Link to="/" className="text-xl font-bold text-gradient-primary">
            CODVerify
          </Link>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      <div className="flex flex-col flex-grow px-3 py-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              location.pathname === item.href
                ? "bg-cod-purple text-white"
                : "text-muted-foreground hover:bg-white/10",
              collapsed && "justify-center"
            )}
          >
            <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-cod-purple flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
