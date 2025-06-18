import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  List, 
  AlertCircle, 
  ShoppingCart,
  Home,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

const dashboardTabs = [
  {
    title: "Overview",
    icon: Home,
    href: "/dashboard",
  },
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

export function DashboardNavigation() {
  const location = useLocation();
  
  // Check if we're on any dashboard page
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  
  if (!isDashboardPage) {
    return null;
  }

  return (
    <div className="glass-morphism border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-xl font-bold text-gradient-primary">
          CODVerify
        </Link>
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white/5 border-white/10">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2">
        {dashboardTabs.map((tab) => {
          const isActive = tab.href === location.pathname || 
            (tab.href === "/dashboard" && location.pathname === "/dashboard");
          
          return (
            <Link
              key={tab.title}
              to={tab.href}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-cod-purple text-white shadow-lg"
                  : "text-muted-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
} 