import { useState, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Phone,
  UserRound,
  ArrowRight,
  AlertCircle,
  Clock,
  History,
  Flag,
  X,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiService, FakeOrder } from "@/services/api";

// Define the type for order status in fake order detection workflow
type OrderStatus = 'new' | 'checking' | 'requires_verification' | 'partial_payment_requested' | 
  'flagged' | 'blacklisted' | 'processing' | 'completed' | 'canceled';

// Define types for message
type Message = {
  id: string;
  text: string;
  sender: 'system' | 'user';
  timestamp: string;
};

// Define type for order
type Order = {
  id: string;
  order_id: string;
  customer: string;
  phone: string;
  address: string;
  amount: number;
  date: string;
  status: OrderStatus;
  suspicious: boolean;
  flagCount: number;
  orderHistory: string[];
  verificationRequired: boolean;
  messages: Message[];
  expanded?: boolean;
};

export default function FakeOrderDetectionDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messageText, setMessageText] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const backendOrders = await apiService.getFakeOrders(filterStatus === 'all' ? undefined : filterStatus);
      
      // Transform backend data to match frontend interface
      const transformedOrders = backendOrders.map((order: FakeOrder) => ({
        id: order.order_id,
        order_id: order.order_id,
        customer: order.customer,
        phone: order.phone,
        address: order.address,
        amount: order.amount,
        date: order.date,
        status: order.status as OrderStatus,
        suspicious: order.suspicious,
        flagCount: order.flagCount || order.flag_count || 0,
        orderHistory: order.orderHistory || order.order_history || [],
        verificationRequired: order.verificationRequired || order.verification_required || false,
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
  
  // Filter orders based on selected filter status
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);
  
  // Select an order to view detailed information
  const selectOrder = (order: Order) => {
    setSelectedOrder(order);
    setMessageText("");
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!selectedOrder || !messageText.trim()) return;
    
    try {
      const updatedOrder = await apiService.addFakeOrderMessage(selectedOrder.id, messageText.trim(), "user");
      
      if (updatedOrder) {
        // Transform the updated order
        const transformedOrder = {
          id: updatedOrder.order_id,
          order_id: updatedOrder.order_id,
          customer: updatedOrder.customer,
          phone: updatedOrder.phone,
          address: updatedOrder.address,
          amount: updatedOrder.amount,
          date: updatedOrder.date,
          status: updatedOrder.status as OrderStatus,
          suspicious: updatedOrder.suspicious,
          flagCount: updatedOrder.flagCount || updatedOrder.flag_count || 0,
          orderHistory: updatedOrder.orderHistory || updatedOrder.order_history || [],
          verificationRequired: updatedOrder.verificationRequired || updatedOrder.verification_required || false,
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
          title: "Message added",
          description: "Your note has been added to the order.",
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
  
  // Handle changing the status of an order
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const messageText = `Order status changed to ${newStatus.replace(/_/g, ' ')}`;
      const updatedOrder = await apiService.updateFakeOrderStatus(orderId, newStatus, messageText);

      if (updatedOrder) {
        // Transform the updated order
        const transformedOrder = {
          id: updatedOrder.order_id,
          order_id: updatedOrder.order_id,
          customer: updatedOrder.customer,
          phone: updatedOrder.phone,
          address: updatedOrder.address,
          amount: updatedOrder.amount,
          date: updatedOrder.date,
          status: updatedOrder.status as OrderStatus,
          suspicious: updatedOrder.suspicious,
          flagCount: updatedOrder.flagCount || updatedOrder.flag_count || 0,
          orderHistory: updatedOrder.orderHistory || updatedOrder.order_history || [],
          verificationRequired: updatedOrder.verificationRequired || updatedOrder.verification_required || false,
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
          title: "Status updated",
          description: `Order status changed to ${newStatus.replace(/_/g, ' ')}`,
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

  // Handle check for repeat fake orders
  const handleCheckForFakeOrders = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Simulate checking process
    const isFake = order.suspicious || order.flagCount > 2;
    const newStatus: OrderStatus = isFake ? 'checking' : 'processing';
    
    await handleStatusChange(orderId, newStatus);
    
    toast({
      title: "Order checked",
      description: isFake ? 
        "Suspicious activity detected. Order requires verification." : 
        "No suspicious activity detected. Order is being processed.",
    });
  };

  // Handle requiring phone verification
  const handleRequirePhoneVerification = async (orderId: string) => {
    await handleStatusChange(orderId, 'requires_verification');
    
    toast({
      title: "Verification required",
      description: `Phone verification is now required for order ${orderId}`,
    });
  };

  // Handle requesting partial payment
  const handleRequestPartialPayment = async (orderId: string) => {
    await handleStatusChange(orderId, 'partial_payment_requested');
    
    toast({
      title: "Payment requested",
      description: `Partial advance payment requested for order ${orderId}`,
    });
  };

  // Handle flagging an order multiple times
  const handleFlagOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newFlagCount = order.flagCount + 1;
    let newStatus: OrderStatus = order.status;
    
    // Update status based on flag count according to flowchart
    if (newFlagCount >= 5) {
      newStatus = 'blacklisted';
    } else if (newFlagCount >= 3) {
      newStatus = 'flagged';
    }

    try {
      const messageText = `Order has been flagged. Flag count: ${newFlagCount}${newFlagCount >= 5 ? ". Customer blacklisted." : ""}`;
      
      // Update flag count first
      const updatedOrder = await apiService.updateFakeOrderFlag(orderId, newFlagCount, true, messageText);
      
      if (updatedOrder && newStatus !== order.status) {
        // Then update status if needed
        await handleStatusChange(orderId, newStatus);
      } else if (updatedOrder) {
        // Just update the orders list with flag count change
        const transformedOrder = {
          id: updatedOrder.order_id,
          order_id: updatedOrder.order_id,
          customer: updatedOrder.customer,
          phone: updatedOrder.phone,
          address: updatedOrder.address,
          amount: updatedOrder.amount,
          date: updatedOrder.date,
          status: updatedOrder.status as OrderStatus,
          suspicious: updatedOrder.suspicious,
          flagCount: updatedOrder.flagCount || updatedOrder.flag_count || 0,
          orderHistory: updatedOrder.orderHistory || updatedOrder.order_history || [],
          verificationRequired: updatedOrder.verificationRequired || updatedOrder.verification_required || false,
          messages: updatedOrder.messages,
          expanded: updatedOrder.expanded || false
        };

        const updatedOrders = orders.map(o => {
          if (o.id === orderId) {
            return transformedOrder;
          }
          return o;
        });
        
        setOrders(updatedOrders);
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(transformedOrder);
        }
      }
      
      toast({
        title: "Order flagged",
        description: `Order ${orderId} has been flagged (${newFlagCount})`,
      });
    } catch (error) {
      console.error('Error flagging order:', error);
      toast({
        title: "Error",
        description: "Failed to flag order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle blacklisting a customer
  const handleBlacklistCustomer = async (orderId: string) => {
    await handleStatusChange(orderId, 'blacklisted');
    
    toast({
      title: "Customer blacklisted",
      description: `Customer for order ${orderId} has been blacklisted`,
      variant: "destructive"
    });
  };

  // Handle proceeding with order processing
  const handleProceedWithOrder = async (orderId: string) => {
    await handleStatusChange(orderId, 'processing');
    
    toast({
      title: "Processing order",
      description: `Order ${orderId} is now being processed`,
    });
  };
  
  // Get badge for order status
  const getOrderStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'new':
        return <Badge className="bg-blue-600">New</Badge>;
      case 'checking':
        return <Badge className="bg-yellow-600">Checking</Badge>;
      case 'requires_verification':
        return <Badge className="bg-orange-600">Verification Required</Badge>;
      case 'partial_payment_requested':
        return <Badge className="bg-purple-600">Payment Requested</Badge>;
      case 'flagged':
        return <Badge className="bg-red-400">Flagged</Badge>;
      case 'blacklisted':
        return <Badge className="bg-red-600">Blacklisted</Badge>;
      case 'processing':
        return <Badge className="bg-green-600">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-700">Completed</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-600">Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get count of orders by status
  const countByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
  };

  // Get suspicious orders count
  const countSuspicious = () => {
    return orders.filter(order => order.suspicious).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gradient">Fake Order Detection</h2>
              <p className="text-gray-400">Identify and manage potentially fraudulent orders</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countByStatus('new')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Need Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countByStatus('requires_verification')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Suspicious</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{countSuspicious()}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Verification</CardTitle>
                    <Tabs defaultValue="all" className="w-[400px]" onValueChange={(value) => setFilterStatus(value as OrderStatus | 'all')}>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="new">New</TabsTrigger>
                        <TabsTrigger value="checking">Checking</TabsTrigger>
                        <TabsTrigger value="requires_verification">Verification</TabsTrigger>
                        <TabsTrigger value="flagged">Flagged</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardDescription>
                    Verify orders and detect potential fraud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            Loading orders...
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map(order => (
                          <TableRow key={order.id} className="cursor-pointer hover:bg-muted/30" onClick={() => selectOrder(order)}>
                            <TableCell>
                              {order.suspicious && (
                                <AlertTriangle size={16} className="text-red-500" />
                              )}
                            </TableCell>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="font-medium">{order.customer}</TableCell>
                            <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                            <TableCell>${order.amount.toFixed(2)}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  selectOrder(order);
                                }}>
                                  View
                                </Button>
                                {order.status === 'new' && (
                                  <Button variant="ghost" size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    handleCheckForFakeOrders(order.id);
                                  }}>
                                    Check
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full lg:w-1/3">
              {selectedOrder ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Order {selectedOrder.id}</CardTitle>
                        <CardDescription>
                          {selectedOrder.customer} - ${selectedOrder.amount.toFixed(2)}
                        </CardDescription>
                      </div>
                      {getOrderStatusBadge(selectedOrder.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Order Information</h3>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Phone:</div>
                            <div className="text-sm">{selectedOrder.phone}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Address:</div>
                            <div className="text-sm">{selectedOrder.address}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Flag count:</div>
                            <div className="text-sm">{selectedOrder.flagCount}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-muted-foreground">Suspicious:</div>
                            <div className="text-sm">{selectedOrder.suspicious ? "Yes" : "No"}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Order History</h3>
                        <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
                          {selectedOrder.orderHistory.length > 0 ? (
                            <ul className="space-y-1 list-disc list-inside">
                              {selectedOrder.orderHistory.map((item, index) => (
                                <li key={index} className="text-sm">{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No order history</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Actions</h3>
                        <div className="flex flex-wrap gap-2">
                          {/* Show actions based on flowchart logic */}
                          {selectedOrder.status === 'new' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCheckForFakeOrders(selectedOrder.id)}
                            >
                              <CheckCircle size={16} className="mr-2" /> Check Order
                            </Button>
                          )}
                          
                          {(selectedOrder.status === 'checking' || selectedOrder.status === 'new') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRequirePhoneVerification(selectedOrder.id)}
                            >
                              <Phone size={16} className="mr-2" /> Require Phone Verification
                            </Button>
                          )}
                          
                          {selectedOrder.status === 'requires_verification' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRequestPartialPayment(selectedOrder.id)}
                            >
                              <AlertCircle size={16} className="mr-2" /> Request Partial Payment
                            </Button>
                          )}
                          
                          {['requires_verification', 'partial_payment_requested'].includes(selectedOrder.status) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleFlagOrder(selectedOrder.id)}
                            >
                              <Flag size={16} className="mr-2" /> Flag Order
                            </Button>
                          )}
                          
                          {selectedOrder.status === 'flagged' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500 text-red-500 hover:bg-red-500/10"
                                onClick={() => handleBlacklistCustomer(selectedOrder.id)}
                              >
                                <X size={16} className="mr-2" /> Blacklist Customer
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-green-500 text-green-500 hover:bg-green-500/10"
                                onClick={() => handleProceedWithOrder(selectedOrder.id)}
                              >
                                <ArrowRight size={16} className="mr-2" /> Proceed with Order
                              </Button>
                            </>
                          )}
                          
                          {['checking', 'requires_verification', 'partial_payment_requested'].includes(selectedOrder.status) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleProceedWithOrder(selectedOrder.id)}
                            >
                              <CheckCircle size={16} className="mr-2" /> Process Order
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Notes & Activity</h3>
                        <div className="border rounded-md h-64 overflow-y-auto p-2 flex flex-col gap-2">
                          {selectedOrder.messages && selectedOrder.messages.map(message => (
                            <div 
                              key={message.id} 
                              className={`p-2 rounded-md ${message.sender === 'system' ? 'bg-muted' : 'bg-primary/10 ml-auto'}`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Textarea 
                          placeholder="Add a note..." 
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>Add Note</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
                    <UserRound size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Order Selected</h3>
                    <p className="text-muted-foreground">
                      Select an order from the list to view details and verify orders.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
