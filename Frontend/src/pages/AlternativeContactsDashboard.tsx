import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Phone,
  UserRound,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Define the type for order status
type OrderStatus = 'pending' | 'contacted' | 'confirmed' | 'unconfirmed' | 'processed' | 'delivered' | 'alternate_provided' | 'high_risk';

// Define types for message and order
type Message = {
  id: string;
  text: string;
  sender: 'system' | 'user';
  timestamp: string;
};

type Order = {
  id: string;
  customer: string;
  phone: string;
  alternativePhone?: string;
  address: string;
  date: string;
  status: OrderStatus;
  highRisk: boolean;
  messages?: Message[];
  expanded?: boolean;
};

// Sample data for contacts dashboard
const initialOrders: Order[] = [
  {
    id: "ORD-1001",
    customer: "Maria Garcia",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Springfield, IL",
    date: "2023-05-20",
    status: "pending",
    highRisk: false,
    messages: [
      {
        id: "msg1",
        text: "Order placed. Ready for contact attempt.",
        sender: "system",
        timestamp: "2023-05-20 10:30 AM"
      }
    ]
  },
  {
    id: "ORD-1002",
    customer: "John Smith",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Springfield, IL",
    date: "2023-05-20",
    status: "unconfirmed",
    highRisk: false,
    messages: [
      {
        id: "msg1",
        text: "Order placed. Ready for contact attempt.",
        sender: "system",
        timestamp: "2023-05-20 09:15 AM"
      },
      {
        id: "msg2",
        text: "First contact attempt - no response.",
        sender: "user",
        timestamp: "2023-05-20 11:20 AM"
      }
    ]
  },
  {
    id: "ORD-1003",
    customer: "Sarah Johnson",
    phone: "+1 (555) 345-6789",
    address: "789 Pine Rd, Springfield, IL",
    date: "2023-05-19",
    status: "confirmed",
    highRisk: false,
    messages: [
      {
        id: "msg1",
        text: "Order placed. Ready for contact attempt.",
        sender: "system",
        timestamp: "2023-05-19 14:30 PM"
      },
      {
        id: "msg2",
        text: "Customer confirmed the order.",
        sender: "user",
        timestamp: "2023-05-19 15:45 PM"
      }
    ]
  },
  {
    id: "ORD-1004",
    customer: "Robert Williams",
    phone: "+1 (555) 567-8901",
    address: "101 Elm Blvd, Springfield, IL",
    date: "2023-05-19",
    status: "alternate_provided",
    highRisk: false,
    alternativePhone: "+1 (555) 234-5678",
    messages: [
      {
        id: "msg1",
        text: "Order placed. Ready for contact attempt.",
        sender: "system",
        timestamp: "2023-05-19 10:30 AM"
      },
      {
        id: "msg2",
        text: "Could not reach customer on primary number.",
        sender: "user",
        timestamp: "2023-05-19 11:20 AM"
      },
      {
        id: "msg3",
        text: "Alternative number provided.",
        sender: "system",
        timestamp: "2023-05-19 11:25 AM"
      }
    ]
  },
  {
    id: "ORD-1005",
    customer: "Emily Davis",
    phone: "+1 (555) 678-9012",
    address: "202 Maple Dr, Springfield, IL",
    date: "2023-05-18",
    status: "high_risk",
    highRisk: true,
    messages: [
      {
        id: "msg1",
        text: "Order placed. Ready for contact attempt.",
        sender: "system",
        timestamp: "2023-05-18 16:30 PM"
      },
      {
        id: "msg2",
        text: "Multiple failed contact attempts.",
        sender: "user",
        timestamp: "2023-05-18 17:45 PM"
      },
      {
        id: "msg3",
        text: "Order marked as high risk after verification issues.",
        sender: "system",
        timestamp: "2023-05-19 09:15 AM"
      }
    ]
  }
];

export default function AlternativeContactsDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messageText, setMessageText] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const { toast } = useToast();
  
  // Filter orders based on selected filter status
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);
  
  // Toggle the expanded state of an order
  const toggleOrderExpanded = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, expanded: !order.expanded }
        : order
    ));
  };
  
  // Select an order to view detailed information
  const selectOrder = (order: Order) => {
    setSelectedOrder(order);
    setMessageText("");
    setAlternativePhone(order.alternativePhone || "");
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!selectedOrder || !messageText.trim()) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date().toLocaleString()
    };
    
    setMessageText("");

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedOrder: Order = {
          ...order,
          messages: [...(order.messages || []), newMessage],
          status: 'contacted' as OrderStatus
        };
        setSelectedOrder(updatedOrder);
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the customer.",
    });
  };
  
  // Handle changing the status of an order
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder: Order = { ...order, status };
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    toast({
      title: "Status updated",
      description: `Order status changed to ${status}`,
    });
  };
  
  // Handle adding an alternative phone number
  const handleAddAlternativePhone = () => {
    if (!selectedOrder || !alternativePhone.trim()) return;
    
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        const updatedOrder: Order = { 
          ...order, 
          alternativePhone: alternativePhone,
          status: 'alternate_provided' as OrderStatus
        };
        setSelectedOrder(updatedOrder);
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    toast({
      title: "Phone updated",
      description: "Alternative phone number has been added.",
    });
  };
  
  // Handle marking an order as high risk
  const handleMarkAsHighRisk = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder: Order = { 
          ...order, 
          status: 'high_risk' as OrderStatus,
          highRisk: true
        };
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    toast({
      title: "Order marked as high risk",
      description: `Order ${orderId} has been marked as high risk`,
    });
  };

  const handleMarkAsProcessed = (orderId: string) => {
    handleStatusChange(orderId, 'processed');
  };
  
  const countByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
  };
  
  const getOrderStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'contacted':
        return <Badge className="bg-blue-600">Contacted</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-600">Confirmed</Badge>;
      case 'unconfirmed':
        return <Badge className="bg-orange-600">Unconfirmed</Badge>;
      case 'processed':
        return <Badge className="bg-purple-600">Processed</Badge>;
      case 'delivered':
        return <Badge className="bg-teal-600">Delivered</Badge>;
      case 'alternate_provided':
        return <Badge className="bg-sky-600">Alt. Contact</Badge>;
      case 'high_risk':
        return <Badge className="bg-red-600">High Risk</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gradient">Alternative Contacts Management</h2>
              <p className="text-gray-400">Manage and track alternative contact methods for your orders</p>
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
                <CardTitle className="text-sm font-medium">Need Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countByStatus('pending')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alt. Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{countByStatus('alternate_provided')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{countByStatus('high_risk')}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Orders Requiring Alternative Contact</CardTitle>
                    <Tabs defaultValue="all" className="w-[400px]" onValueChange={(value) => setFilterStatus(value as OrderStatus | 'all')}>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="unconfirmed">Unconfirmed</TabsTrigger>
                        <TabsTrigger value="alternate_provided">Alt. Contact</TabsTrigger>
                        <TabsTrigger value="high_risk">High Risk</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardDescription>
                    Manage orders that require alternative contact methods
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
                        <TableHead>Phone</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map(order => (
                          <TableRow key={order.id} className="cursor-pointer hover:bg-muted/30" onClick={() => selectOrder(order)}>
                            <TableCell>
                              {order.highRisk && (
                                <AlertTriangle size={16} className="text-red-500" />
                              )}
                            </TableCell>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="font-medium">{order.customer}</TableCell>
                            <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                            <TableCell>{order.phone}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  selectOrder(order);
                                }}>
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsProcessed(order.id);
                                }}>
                                  Process
                                </Button>
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
                        <CardTitle>Order Details {selectedOrder.id}</CardTitle>
                        <CardDescription>
                          {selectedOrder.customer} - {selectedOrder.address}
                        </CardDescription>
                      </div>
                      {getOrderStatusBadge(selectedOrder.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Phone Information</h3>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <Phone size={16} />
                            <span className="text-sm">{selectedOrder.phone} (Primary)</span>
                          </div>
                          
                          {selectedOrder.alternativePhone && (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                              <Phone size={16} />
                              <span className="text-sm">{selectedOrder.alternativePhone} (Alternative)</span>
                            </div>
                          )}
                          
                          {!selectedOrder.alternativePhone && (
                            <div className="flex gap-2 items-center">
                              <Input 
                                placeholder="Add alternative phone" 
                                value={alternativePhone}
                                onChange={(e) => setAlternativePhone(e.target.value)}
                              />
                              <Button size="sm" onClick={handleAddAlternativePhone}>Add</Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Actions</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                          >
                            <CheckCircle size={16} className="mr-2" /> Confirm
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(selectedOrder.id, 'unconfirmed')}
                          >
                            <X size={16} className="mr-2" /> Unconfirm
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleMarkAsHighRisk(selectedOrder.id)}
                          >
                            <AlertCircle size={16} className="mr-2" /> Mark High Risk
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Message History</h3>
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
                          placeholder="Type your message here..." 
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
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
                      Select an order from the list to view details and manage alternative contacts.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
