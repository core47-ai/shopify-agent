import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <header className="border-b border-white/10 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search..."
          className="w-64 bg-white/5 border-white/10"
        />
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="bg-black text-white hover:bg-zinc-900 px-4 py-2 rounded-md font-semibold shadow-md"
        >
          Back to Home
        </Button>
      </div>
      <Button
        onClick={handleLogout}
        className="bg-black text-white hover:bg-zinc-900 px-4 py-2 rounded-md font-semibold shadow-md"
      >
        Logout
      </Button>
    </header>
  );
}
