import { useState, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, Filter, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { OrderConfirmationGrid } from "@/components/dashboard/OrderConfirmationGrid";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiService, OrderStats, FakeOrderStats } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AddressVerificationStats {
  incomplete: number;
  waiting: number;
  received: number;
  manual_review: number;
}

export default function OrderConfirmationDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [orderStats, setOrderStats] = useState<OrderStats>({
    confirmed: 0,
    pending: 0,
    unconfirmed: 0,
    total: 0
  });
  const [fakeOrderStats, setFakeOrderStats] = useState<FakeOrderStats>({
    total: 0,
    new: 0,
    checking: 0,
    requires_verification: 0,
    partial_payment_requested: 0,
    flagged: 0,
    blacklisted: 0,
    processing: 0,
    completed: 0,
    canceled: 0,
    suspicious: 0
  });
  const [addressStats, setAddressStats] = useState<AddressVerificationStats>({
    incomplete: 0,
    waiting: 0,
    received: 0,
    manual_review: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [orderStatsData, fakeOrderStatsData] = await Promise.all([
          apiService.getOrderStats(),
          apiService.getFakeOrderStats()
        ]);
        setOrderStats(orderStatsData);
        setFakeOrderStats(fakeOrderStatsData);
        
        // Mock address verification stats for now - you can replace this with real API call
        setAddressStats({
          incomplete: 2, // addr_001, addr_005
          waiting: 2, // addr_002, addr_006  
          received: 2, // addr_003, addr_007
          manual_review: 2 // addr_004, addr_008
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRefresh = () => {
    const fetchStats = async () => {
      try {
        const [orderStatsData, fakeOrderStatsData] = await Promise.all([
          apiService.getOrderStats(),
          apiService.getFakeOrderStats()
        ]);
        setOrderStats(orderStatsData);
        setFakeOrderStats(fakeOrderStatsData);
        
        // Update address verification stats
        setAddressStats({
          incomplete: 2,
          waiting: 2,
          received: 2,
          manual_review: 2
        });
        
        toast({
          title: "Data refreshed",
          description: "Order management data has been refreshed",
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
        const [orderStatsData, fakeOrderStatsData] = await Promise.all([
          apiService.getOrderStats(),
          apiService.getFakeOrderStats()
        ]);
        setOrderStats(orderStatsData);
        setFakeOrderStats(fakeOrderStatsData);
        
        // Update address verification stats when orders are updated
        // For demo purposes, simulate some orders moving to address verification
        setAddressStats(prev => {
          // When orders are confirmed, some might need address verification
          const newIncomplete = Math.max(0, prev.incomplete + Math.floor(Math.random() * 2) - 1);
          const newWaiting = Math.max(0, prev.waiting + Math.floor(Math.random() * 2) - 1);
          const newReceived = Math.max(0, prev.received + Math.floor(Math.random() * 2) - 1);
          const newManualReview = Math.max(0, prev.manual_review + Math.floor(Math.random() * 1));
          
          return {
            incomplete: newIncomplete,
            waiting: newWaiting,
            received: newReceived,
            manual_review: newManualReview
          };
        });
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
                      <TabsTrigger value="suspicious" className="rounded-full">
                        Suspicious ({loading ? "..." : fakeOrderStats.suspicious})
                      </TabsTrigger>
                      <TabsTrigger value="incomplete" className="rounded-full">
                        Incomplete Address ({loading ? "..." : addressStats.incomplete})
                      </TabsTrigger>
                      <TabsTrigger value="waiting" className="rounded-full">
                        Waiting Response ({loading ? "..." : addressStats.waiting})
                      </TabsTrigger>
                      <TabsTrigger value="received" className="rounded-full">
                        Response Received ({loading ? "..." : addressStats.received})
                      </TabsTrigger>
                      <TabsTrigger value="manual_review" className="rounded-full">
                        Manual Review ({loading ? "..." : addressStats.manual_review})
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                {/* All Orders Tab */}
                <TabsContent value="all" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="all" 
                      dataType="orders"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Confirmed Orders Tab */}
                <TabsContent value="confirmed" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="confirmed" 
                      dataType="orders"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Pending Orders Tab */}
                <TabsContent value="pending" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="pending" 
                      dataType="orders"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Unconfirmed Orders Tab */}
                <TabsContent value="unconfirmed" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="unconfirmed" 
                      dataType="orders"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Suspicious Orders Tab */}
                <TabsContent value="suspicious" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="suspicious" 
                      dataType="fake_orders"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                {/* Address Verification Tabs */}
                <TabsContent value="incomplete" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="incomplete" 
                      dataType="address_verification"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="waiting" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="waiting" 
                      dataType="address_verification"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="received" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="received" 
                      dataType="address_verification"
                      onOrderUpdate={onOrderUpdate}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="manual_review" className="flex-1 overflow-auto p-0 m-0">
                  <div className="p-6">
                    <OrderConfirmationGrid 
                      statusFilter="manual_review" 
                      dataType="address_verification"
                      onOrderUpdate={onOrderUpdate}
                    />
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
