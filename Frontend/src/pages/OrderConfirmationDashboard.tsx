import { useState, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, Filter, Download, RefreshCw } from "lucide-react";
import { OrderConfirmationGrid } from "@/components/dashboard/OrderConfirmationGrid";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, OrderStats } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function OrderConfirmationDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [orderStats, setOrderStats] = useState<OrderStats>({
    confirmed: 0,
    pending: 0,
    unconfirmed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setLoading(true);
        const stats = await apiService.getOrderStats();
        setOrderStats(stats);
      } catch (error) {
        console.error('Error fetching order stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  const handleRefresh = () => {
    const fetchStats = async () => {
      try {
        const stats = await apiService.getOrderStats();
        setOrderStats(stats);
        toast({
          title: "Data refreshed",
          description: "Order confirmation data has been refreshed",
        });
      } catch (error) {
        console.error('Error refreshing stats:', error);
        toast({
          title: "Error",
          description: "Failed to refresh data",
          variant: "destructive"
        });
      }
    };
    fetchStats();
  };

  const onOrderUpdate = () => {
    const fetchStats = async () => {
      try {
        const stats = await apiService.getOrderStats();
        setOrderStats(stats);
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }
    };
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-cod-purple" />
                <h2 className="text-2xl font-bold text-gradient">Order Management</h2>
              </div>
              <p className="text-gray-400">Manage orders, confirmations, and address verification</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/5 border-white/10">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="button-gradient shadow-lg" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>

          {/* Main Content Card with Tabs */}
          <Card className="data-card border border-white/10">
            <div className="h-[calc(100vh-200px)]">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="px-6 pt-6 border-b border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="glass-morphism border border-white/10 rounded-full shadow-lg">
                      <TabsTrigger value="all" className="rounded-full">
                        All Orders ({loading ? "..." : orderStats.total})
                      </TabsTrigger>
                      <TabsTrigger value="confirmed" className="rounded-full">
                        Confirmed ({loading ? "..." : orderStats.confirmed})
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="rounded-full">
                        Pending ({loading ? "..." : orderStats.pending})
                      </TabsTrigger>
                      <TabsTrigger value="unconfirmed" className="rounded-full">
                        Unconfirmed ({loading ? "..." : orderStats.unconfirmed})
                      </TabsTrigger>
                      <TabsTrigger value="incomplete" className="rounded-full">
                        Incomplete Address (12)
                      </TabsTrigger>
                      <TabsTrigger value="waiting" className="rounded-full">
                        Waiting Response (8)
                      </TabsTrigger>
                      <TabsTrigger value="received" className="rounded-full">
                        Response Received (15)
                      </TabsTrigger>
                      <TabsTrigger value="manual_review" className="rounded-full">
                        Manual Review (3)
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                {/* All Orders Tab */}
                <TabsContent value="all" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="all" 
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Confirmed Orders Tab */}
                <TabsContent value="confirmed" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="confirmed" 
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Pending Orders Tab */}
                <TabsContent value="pending" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="pending" 
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Unconfirmed Orders Tab */}
                <TabsContent value="unconfirmed" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="unconfirmed" 
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Address Verification Tabs */}
                <TabsContent value="incomplete" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-4 text-cod-purple/50" />
                      <h3 className="text-lg font-medium mb-2">Incomplete Address Orders</h3>
                      <p>Orders with incomplete or missing address information</p>
                      <Button className="mt-4 button-gradient">
                        View Address Verification
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="waiting" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-4 text-cod-purple/50" />
                      <h3 className="text-lg font-medium mb-2">Waiting for Customer Response</h3>
                      <p>Orders waiting for customer address confirmation</p>
                      <Button className="mt-4 button-gradient">
                        View Address Verification
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="received" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-4 text-cod-purple/50" />
                      <h3 className="text-lg font-medium mb-2">Response Received</h3>
                      <p>Orders with customer address responses ready for review</p>
                      <Button className="mt-4 button-gradient">
                        Review Responses
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="manual_review" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-4 text-cod-purple/50" />
                      <h3 className="text-lg font-medium mb-2">Manual Review Required</h3>
                      <p>Orders requiring manual address verification review</p>
                      <Button className="mt-4 button-gradient">
                        Start Manual Review
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
