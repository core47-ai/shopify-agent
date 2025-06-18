import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, RefreshCw, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CustomerTreeGrid } from "@/components/dashboard/CustomerTreeGrid";

type HighRiskCustomer = {
  id: string;
  name: string;
  phone: string;
  returnRate: string;
  orderCount: number;
  tags: string[];
  lastOrder: string;
  status: "high_risk" | "medium_risk" | "flagged";
  messageHistory?: MessageHistory[];
};

type MessageHistory = {
  timestamp: string;
  message: string;
  advanceAmount?: number;
  responseReceived?: boolean;
};

export default function ReturnsManagementDashboard() {
  const { toast } = useToast();
  const [highRiskCustomers, setHighRiskCustomers] = useState<HighRiskCustomer[]>([
    {
      id: "C1001",
      name: "Ahmad Khan",
      phone: "+92 300 1234567",
      returnRate: "68%",
      orderCount: 12,
      tags: ["multiple_orders"],
      lastOrder: "2 days ago",
      status: "high_risk",
      messageHistory: [
        {
          timestamp: "2025-05-21 14:30",
          message: "Hello Ahmad Khan, please confirm your order #O1001 by replying YES. As per our policy, we request an advance payment of Rs. 300 before confirming your order.",
          advanceAmount: 300,
          responseReceived: false
        },
        {
          timestamp: "2025-05-20 10:15",
          message: "Hello Ahmad Khan, thank you for your order #O0985. Your order has been shipped and will arrive within 2-3 business days.",
          responseReceived: true
        }
      ]
    },
    {
      id: "C1002",
      name: "Fatima Ali",
      phone: "+92 321 9876543",
      returnRate: "75%",
      orderCount: 8,
      tags: ["multiple_orders"],
      lastOrder: "5 days ago",
      status: "high_risk",
      messageHistory: [
        {
          timestamp: "2025-05-18 09:45",
          message: "Hello Fatima Ali, please confirm your order #O1002 by replying YES. As per our policy, we request an advance payment of Rs. 300 before confirming your order.",
          advanceAmount: 300,
          responseReceived: true
        }
      ]
    },
    {
      id: "C1003",
      name: "Zain Ahmed",
      phone: "+92 333 4567890",
      returnRate: "52%",
      orderCount: 5,
      tags: [],
      lastOrder: "1 day ago",
      status: "medium_risk",
      messageHistory: []
    },
    {
      id: "C1004",
      name: "Sara Khan",
      phone: "+92 345 1234567",
      returnRate: "45%",
      orderCount: 11,
      tags: ["multiple_orders"],
      lastOrder: "Today",
      status: "flagged",
      messageHistory: [
        {
          timestamp: "2025-05-22 08:20",
          message: "Hello Sara Khan, please confirm your order #O1004 by replying YES.",
          responseReceived: false
        }
      ]
    },
  ]);

  const handleRefreshAnalysis = () => {
    toast({
      title: "AI Analysis Refreshed",
      description: "Customer data has been reanalyzed by AI.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gradient">Returns Management</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/5 border-white/10">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="button-gradient shadow-lg" onClick={handleRefreshAnalysis}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run AI Analysis
              </Button>
            </div>
          </div>
          
          <Card className="data-card">
            <CardHeader className="bg-gradient-to-r from-cod-dark to-cod-charcoal">
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-cod-orange" />
                AI-Detected High Risk Customers
              </CardTitle>
              <CardDescription>
                AI-analyzed customers with high return rates and suspicious order patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-400/5 border border-orange-500/20 text-sm mb-6 shadow-lg">
                <p className="text-muted-foreground">
                  AI has analyzed Shopify/PostEx/Leopard API data for past customer orders.
                  Customers with multiple orders and high return rates are flagged for special handling.
                </p>
              </div>
              
              <Tabs defaultValue="all">
                <div className="flex justify-between items-center mb-4">
                  <TabsList className="glass-morphism border border-white/10 rounded-full shadow-lg">
                    <TabsTrigger value="all" className="rounded-full">All Customers</TabsTrigger>
                    <TabsTrigger value="high_risk" className="rounded-full">High Risk</TabsTrigger>
                    <TabsTrigger value="flagged" className="rounded-full">Flagged</TabsTrigger>
                  </TabsList>
                  <Button variant="outline" className="bg-white/5 border-white/10">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  <CustomerTreeGrid customers={highRiskCustomers} />
                </TabsContent>
                
                <TabsContent value="high_risk" className="mt-0">
                  <CustomerTreeGrid customers={highRiskCustomers.filter(c => c.status === "high_risk")} />
                </TabsContent>
                
                <TabsContent value="flagged" className="mt-0">
                  <CustomerTreeGrid customers={highRiskCustomers.filter(c => c.status === "flagged")} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
