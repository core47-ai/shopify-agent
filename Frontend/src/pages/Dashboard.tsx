import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { ApiConnectButtons } from "@/components/dashboard/ApiConnectButtons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderConfirmationGrid } from "@/components/dashboard/OrderConfirmationGrid";
import { ShoppingCart, Package, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gradient">
            Welcome back, {user?.name || 'User'}!
          </h2>
          
          <ApiConnectButtons />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="data-card card-hover">
              <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="mr-2 h-4 w-4 text-cod-orange" />
                  Orders
                </CardTitle>
                <CardDescription>Today's orders</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">56</div>
                <div className="text-sm text-green-500 flex items-center gap-1">
                  <Badge className="bg-green-500/20 text-green-400 rounded-full">+12%</Badge>
                  from yesterday
                </div>
              </CardContent>
            </Card>
            
            <Card className="data-card card-hover">
              <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="mr-2 h-4 w-4 text-cod-blue" />
                  Confirmations
                </CardTitle>
                <CardDescription>Confirmation rate</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">72%</div>
                <div className="text-sm text-green-500 flex items-center gap-1">
                  <Badge className="bg-green-500/20 text-green-400 rounded-full">+5%</Badge>
                  from yesterday
                </div>
              </CardContent>
            </Card>
            
            <Card className="data-card card-hover">
              <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center text-lg">
                  <Package className="mr-2 h-4 w-4 text-cod-purple" />
                  Return Rate
                </CardTitle>
                <CardDescription>Current return rate</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">8.4%</div>
                <div className="text-sm text-green-500 flex items-center gap-1">
                  <Badge className="bg-green-500/20 text-green-400 rounded-full">-2.1%</Badge>
                  from last week
                </div>
              </CardContent>
            </Card>
          </div>
          
          <OrderConfirmationGrid />
        </div>
      </main>
    </div>
  );
}
