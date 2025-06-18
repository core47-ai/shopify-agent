import { useState, useRef } from "react";
import { 
  Calendar, 
  MessageSquare, 
  Bell, 
  Phone, 
  Flag, 
  Check, 
  X, 
  UserCheck, 
  Clock 
} from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnresponsiveCustomersGrid } from "@/components/dashboard/UnresponsiveCustomersGrid";
import { ReminderHistoryGrid } from "@/components/dashboard/ReminderHistoryGrid";
import { ResolvedCustomersGrid } from "@/components/dashboard/ResolvedCustomersGrid";

export default function UnresponsiveCustomersDashboard() {
  const [activeTab, setActiveTab] = useState("unresponsive");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActionComplete = () => {
    // Increment refresh key to force re-render of all child components
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gradient">Unresponsive Customers</h2>
              <div className="flex items-center gap-2">
               
                <Button size="sm" variant="outline" className="gap-1">
                  <Phone className="h-4 w-4" />
                  Export Call List
                </Button>
              </div>
            </div>

            <Tabs defaultValue="unresponsive" className="w-full" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList className="glass-morphism">
                  <TabsTrigger value="unresponsive">Unresponsive Customers</TabsTrigger>
                  <TabsTrigger value="reminders">Reminder History</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="unresponsive" className="mt-0">
                <Card className="data-card">
                  <CardHeader className="bg-gradient-to-r from-cod-dark to-cod-charcoal">
                    <CardTitle>Unresponsive Customer Management</CardTitle>
                    <CardDescription className="text-white/70">
                      Track and manage customers who haven't responded to order confirmation requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <UnresponsiveCustomersGrid onActionComplete={handleActionComplete} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reminders" className="mt-0">
                <Card className="data-card">
                  <CardHeader className="bg-gradient-to-r from-cod-dark to-cod-charcoal">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Reminder History
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Track all reminders sent to customers for order confirmations
                    </CardDescription>
                  </CardHeader>
                  <ReminderHistoryGrid key={`reminders-${refreshKey}`} />
                </Card>
              </TabsContent>
              
              <TabsContent value="resolved" className="mt-0">
                <Card className="data-card">
                  <CardHeader className="bg-gradient-to-r from-cod-dark to-cod-charcoal">
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Resolved Customers
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Customers who have been successfully resolved through various methods
                    </CardDescription>
                  </CardHeader>
                  <ResolvedCustomersGrid key={`resolved-${refreshKey}`} />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
