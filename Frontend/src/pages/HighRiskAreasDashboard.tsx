import { useState, useMemo, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Check, MessageSquare, Package, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, HighRiskAreaOrder } from "@/services/api";

// Define types for our data
type OrderStatus = "new" | "analyzing" | "high_risk" | "payment_requested" | "payment_received" | "processing" | "review" | "completed";

interface Message {
  id: string;
  text: string;
  sender: "system" | "user";
  timestamp: string;
}

interface Order {
  id: string;
  order_id: string;
  customer: string;
  area: string;
  address: string;
  riskRate: number;
  risk_rate: number;
  riskFactors: string[];
  risk_factors: string[];
  status: OrderStatus;
  date: string;
  messages: Message[];
  expanded?: boolean;
}

export default function HighRiskAreasDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messageText, setMessageText] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const backendOrders = await apiService.getHighRiskAreaOrders(statusFilter);
      
      // Transform backend data to match frontend interface
      const transformedOrders = backendOrders.map((order: HighRiskAreaOrder) => ({
        id: order.order_id,
        order_id: order.order_id,
        customer: order.customer,
        area: order.area,
        address: order.address,
        riskRate: order.risk_rate,
        risk_rate: order.risk_rate,
        riskFactors: order.risk_factors,
        risk_factors: order.risk_factors,
        status: order.status as OrderStatus,
        date: order.date,
        messages: order.messages,
        expanded: order.expanded || false
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search term and status filter
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [orders, searchTerm]);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const messageText = `Order status changed to ${newStatus.replace('_', ' ')}`;
      const updatedOrder = await apiService.updateHighRiskAreaOrderStatus(orderId, newStatus, messageText);
      
      if (updatedOrder) {
        // Transform the updated order
        const transformedOrder = {
          id: updatedOrder.order_id,
          order_id: updatedOrder.order_id,
          customer: updatedOrder.customer,
          area: updatedOrder.area,
          address: updatedOrder.address,
          riskRate: updatedOrder.risk_rate,
          risk_rate: updatedOrder.risk_rate,
          riskFactors: updatedOrder.risk_factors,
          risk_factors: updatedOrder.risk_factors,
          status: updatedOrder.status as OrderStatus,
          date: updatedOrder.date,
          messages: updatedOrder.messages,
          expanded: updatedOrder.expanded || false
        };
        
        // Update orders list
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return transformedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
        
        // Update selected order if it's the same one
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(transformedOrder);
        }
        
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus.replace('_', ' ')}`,
    });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedOrder) return;
    
    try {
      const updatedOrder = await apiService.addHighRiskAreaMessage(selectedOrder.id, messageText, "user");
      
      if (updatedOrder) {
        // Transform the updated order
        const transformedOrder = {
          id: updatedOrder.order_id,
          order_id: updatedOrder.order_id,
          customer: updatedOrder.customer,
          area: updatedOrder.area,
          address: updatedOrder.address,
          riskRate: updatedOrder.risk_rate,
          risk_rate: updatedOrder.risk_rate,
          riskFactors: updatedOrder.risk_factors,
          risk_factors: updatedOrder.risk_factors,
          status: updatedOrder.status as OrderStatus,
          date: updatedOrder.date,
          messages: updatedOrder.messages,
          expanded: updatedOrder.expanded || false
        };
        
        // Update orders list
        const updatedOrders = orders.map(order => {
          if (order.id === selectedOrder.id) {
            return transformedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
        setSelectedOrder(transformedOrder);
    setMessageText("");
    
    toast({
      title: "Message Sent",
      description: `Message sent for order ${selectedOrder.id}`,
    });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string, label: string }> = {
      new: { color: "bg-blue-500", label: "New" },
      analyzing: { color: "bg-purple-500", label: "Analyzing" },
      high_risk: { color: "bg-red-500", label: "High Risk" },
      payment_requested: { color: "bg-yellow-500", label: "Payment Requested" },
      payment_received: { color: "bg-green-500", label: "Payment Received" },
      processing: { color: "bg-indigo-500", label: "Processing" },
      review: { color: "bg-orange-500", label: "Manual Review" },
      completed: { color: "bg-green-700", label: "Completed" }
    };

    const { color, label } = statusMap[status] || { color: "bg-gray-500", label: status };
    return <Badge className={`${color} text-white`}>{label}</Badge>;
  };

  const renderRiskBadge = (riskRate: number) => {
    let color = "bg-green-500";
    if (riskRate > 90) {
      color = "bg-red-600";
    } else if (riskRate > 70) {
      color = "bg-orange-500";
    } else if (riskRate > 50) {
      color = "bg-yellow-500";
    }
    return <Badge className={`${color} text-white`}>{riskRate}%</Badge>;
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gradient">Identify High Risk Areas</h2>
              <Button className="button-gradient">
                <AlertTriangle className="mr-1 h-4 w-4" />
                Add Risk Area
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Area Management</CardTitle>
                <CardDescription>
                  Analyze delivery performance and identify high-risk areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search orders, customers, or areas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="analyzing">Analyzing</SelectItem>
                      <SelectItem value="high_risk">High Risk</SelectItem>
                      <SelectItem value="payment_requested">Payment Requested</SelectItem>
                      <SelectItem value="payment_received">Payment Received</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="review">Manual Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="overflow-auto border rounded-md shadow">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Risk Rate</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              Loading orders...
                            </TableCell>
                          </TableRow>
                        ) : filteredOrders.length > 0 ? (
                          filteredOrders.map((order) => (
                            <TableRow 
                              key={order.id}
                              className={selectedOrder?.id === order.id ? "bg-muted" : ""}
                              onClick={() => handleOrderSelect(order)}
                            >
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.area}</TableCell>
                              <TableCell>{renderRiskBadge(order.riskRate)}</TableCell>
                              <TableCell>{getStatusBadge(order.status)}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {order.status === "new" && (
                                    <Button size="sm" variant="outline" onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(order.id, "analyzing");
                                    }}>
                                      Analyze
                                    </Button>
                                  )}
                                  {order.status === "analyzing" && (
                                    <Button size="sm" variant="destructive" onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(order.id, "high_risk");
                                    }}>
                                      Flag High Risk
                                    </Button>
                                  )}
                                  {order.status === "high_risk" && (
                                    <Button size="sm" variant="outline" onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(order.id, "payment_requested");
                                    }}>
                                      Request Payment
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No orders found matching your criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {selectedOrder ? (
                    <Card className="border shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>{selectedOrder.id} - {selectedOrder.customer}</CardTitle>
                          {getStatusBadge(selectedOrder.status)}
                        </div>
                        <CardDescription>{selectedOrder.area}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Details</h4>
                            <p className="text-sm">{selectedOrder.address}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold">Risk Rate:</span>
                              {renderRiskBadge(selectedOrder.riskRate)}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Risk Factors</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedOrder.riskFactors.map((factor, index) => (
                                <Badge key={index} variant="outline" className="bg-background">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Tabs defaultValue="actions">
                            <TabsList className="grid grid-cols-2">
                              <TabsTrigger value="actions">Actions</TabsTrigger>
                              <TabsTrigger value="messages">Messages</TabsTrigger>
                            </TabsList>
                            <TabsContent value="actions" className="space-y-2 pt-2">
                              {selectedOrder.status === "new" && (
                                <Button className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "analyzing")}>
                                  Start Analysis
                                </Button>
                              )}
                              {selectedOrder.status === "analyzing" && (
                                <>
                                  <Button variant="destructive" className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "high_risk")}>
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Mark as High Risk
                                  </Button>
                                  <Button variant="outline" className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "processing")}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve for Processing
                                  </Button>
                                </>
                              )}
                              {selectedOrder.status === "high_risk" && (
                                <Button className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "payment_requested")}>
                                  Request Advance Payment
                                </Button>
                              )}
                              {selectedOrder.status === "payment_requested" && (
                                <>
                                  <Button className="w-full" variant="default" onClick={() => handleStatusChange(selectedOrder.id, "payment_received")}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark Payment Received
                                  </Button>
                                </>
                              )}
                              {selectedOrder.status === "payment_received" && (
                                <Button className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "processing")}>
                                  <Package className="mr-2 h-4 w-4" />
                                  Process Order
                                </Button>
                              )}
                              {["analyzing", "high_risk", "payment_requested"].includes(selectedOrder.status) && (
                                <Button variant="outline" className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "review")}>
                                  Flag for Manual Review
                                </Button>
                              )}
                              {selectedOrder.status === "review" && (
                                <>
                                  <Button variant="default" className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "processing")}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve for Processing
                                  </Button>
                                  <Button variant="destructive" className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "high_risk")}>
                                    <X className="mr-2 h-4 w-4" />
                                    Mark as High Risk
                                  </Button>
                                </>
                              )}
                              {selectedOrder.status === "processing" && (
                                <Button className="w-full" onClick={() => handleStatusChange(selectedOrder.id, "completed")}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark as Completed
                                </Button>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="messages" className="pt-2">
                              <div className="h-[200px] overflow-y-auto border rounded-md p-2 mb-2">
                                {selectedOrder.messages.length > 0 ? (
                                  selectedOrder.messages.map((message) => (
                                    <div 
                                      key={message.id} 
                                      className={`mb-2 p-2 rounded ${message.sender === 'system' ? 'bg-muted' : 'bg-primary/10'}`}
                                    >
                                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>{message.sender === 'system' ? 'System' : 'User'}</span>
                                        <span>{message.timestamp}</span>
                                      </div>
                                      <p className="text-sm">{message.text}</p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="h-full flex items-center justify-center">
                                    <p className="text-muted-foreground text-sm">No messages yet</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Input 
                                  placeholder="Enter message..." 
                                  value={messageText}
                                  onChange={(e) => setMessageText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button onClick={handleSendMessage} type="button">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border shadow flex items-center justify-center h-full">
                      <CardContent className="text-center p-8">
                        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Select an order to view details</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
