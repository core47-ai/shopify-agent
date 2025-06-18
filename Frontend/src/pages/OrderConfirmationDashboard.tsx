import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings } from "lucide-react";
import { OrderConfirmationGrid } from "@/components/dashboard/OrderConfirmationGrid";

export default function OrderConfirmationDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-cod-purple" />
                <h2 className="text-2xl font-bold text-gradient">Order Confirmation Status</h2>
              </div>
              <p className="text-gray-400">Track the status of WhatsApp order confirmations</p>
            </div>
            <Button className="button-gradient shadow-lg">
              <Settings className="mr-2 h-4 w-4" />
              Configure Service
            </Button>
          </div>
              
          <OrderConfirmationGrid statusFilter="all" />
        </div>
      </main>
    </div>
  );
}
