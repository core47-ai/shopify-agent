import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { ApiConnectButtons } from "@/components/dashboard/ApiConnectButtons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, MessageSquare, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gradient">
              Welcome back, {user?.name || 'User'}!
            </h2>
            <Button 
              className="button-gradient shadow-lg"
              onClick={() => navigate('/order-confirmation')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Manage Orders
            </Button>
          </div>
          
          <ApiConnectButtons />
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="data-card card-hover">
              <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="mr-2 h-4 w-4 text-cod-orange" />
                  Total Orders
                </CardTitle>
                <CardDescription>Today's orders</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">156</div>
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
                  Deliveries
                </CardTitle>
                <CardDescription>Successful deliveries</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">89%</div>
                <div className="text-sm text-green-500 flex items-center gap-1">
                  <Badge className="bg-green-500/20 text-green-400 rounded-full">+3%</Badge>
                  from last week
                </div>
              </CardContent>
            </Card>

            <Card className="data-card card-hover">
              <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                  Pending Review
                </CardTitle>
                <CardDescription>Address verification</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-bold">23</div>
                <div className="text-sm text-yellow-500 flex items-center gap-1">
                  <Badge className="bg-yellow-500/20 text-yellow-400 rounded-full">+8</Badge>
                  new today
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="data-card card-hover cursor-pointer" onClick={() => navigate('/order-confirmation')}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="mr-2 h-5 w-5 text-cod-purple" />
                  Order Management
                </CardTitle>
                <CardDescription>
                  Manage order confirmations and address verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confirmed</span>
                    <span className="text-sm font-medium text-green-400">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="text-sm font-medium text-yellow-400">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Unconfirmed</span>
                    <span className="text-sm font-medium text-red-400">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="data-card card-hover cursor-pointer" onClick={() => navigate('/unresponsive-customers')}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="mr-2 h-5 w-5 text-cod-blue" />
                  Customer Management
                </CardTitle>
                <CardDescription>
                  Handle unresponsive customers and follow-ups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Unresponsive</span>
                    <span className="text-sm font-medium text-orange-400">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Resolved Today</span>
                    <span className="text-sm font-medium text-green-400">7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="data-card card-hover cursor-pointer" onClick={() => navigate('/deliveries')}>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5 text-cod-orange" />
                  Delivery Analytics
                </CardTitle>
                <CardDescription>
                  Track delivery performance and optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-sm font-medium text-green-400">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Delivery Time</span>
                    <span className="text-sm font-medium">2.3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
