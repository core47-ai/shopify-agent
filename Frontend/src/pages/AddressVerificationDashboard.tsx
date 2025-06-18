import { useState } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  Filter, 
  Download, 
  AlertTriangle, 
  Clock, 
  Ban,
  RefreshCw,
  Edit2,
  Save,
  XCircle,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OrderStatus = 'incomplete' | 'complete' | 'waiting' | 'received' | 'no_response' | 'manual_review';

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  status: OrderStatus;
  date: string;
  expanded?: boolean;
};

const statusLabels: Record<OrderStatus, string> = {
  incomplete: 'Incomplete Address',
  complete: 'Complete & Reliable',
  waiting: 'Waiting for Response',
  received: 'Response Received',
  no_response: 'No Response',
  manual_review: 'Manual Review'
};

const statusIcons: Record<OrderStatus, JSX.Element> = {
  incomplete: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  complete: <CheckCircle className="h-4 w-4 text-green-500" />,
  waiting: <Clock className="h-4 w-4 text-blue-500" />,
  received: <CheckCircle className="h-4 w-4 text-green-500" />,
  no_response: <Ban className="h-4 w-4 text-red-500" />,
  manual_review: <AlertTriangle className="h-4 w-4 text-orange-500" />
};

export default function AddressVerificationDashboard() {
  const { toast } = useToast();
  const [editingAddress, setEditingAddress] = useState<{orderId: string, address: string, city: string} | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "O1001",
      customer: "Ahmad Khan",
      phone: "+92 300 1234567",
      address: "House 123, Street 4",
      city: "Lahore",
      status: "incomplete",
      date: "2025-05-22",
      expanded: false
    },
    {
      id: "O1002",
      customer: "Sara Ali",
      phone: "+92 321 9876543",
      address: "Apartment 45",
      city: "Karachi",
      status: "waiting",
      date: "2025-05-22",
      expanded: false
    },
    {
      id: "O1003",
      customer: "Fatima Ahmed",
      phone: "+92 333 4567890",
      address: "Block B, DHA Phase 5",
      city: "Islamabad",
      status: "received",
      date: "2025-05-21",
      expanded: false
    },
    {
      id: "O1004",
      customer: "Zain Khan",
      phone: "+92 345 1234567",
      address: "Shop 12",
      city: "Lahore",
      status: "no_response",
      date: "2025-05-20",
      expanded: false
    },
    {
      id: "O1005",
      customer: "Ayesha Malik",
      phone: "+92 300 9876543",
      address: "F-10 Markaz",
      city: "Islamabad",
      status: "manual_review",
      date: "2025-05-20",
      expanded: false
    },
    {
      id: "O1006",
      customer: "Mohammed Ali",
      phone: "+92 321 4567890",
      address: "House 456, Block C, Garden Town",
      city: "Lahore",
      status: "complete",
      date: "2025-05-19",
      expanded: false
    },
  ]);

  const handleExpand = (orderId: string) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, expanded: !order.expanded };
      }
      return order;
    }));
  };

  const handleEditAddress = (orderId: string, currentAddress: string, currentCity: string) => {
    setEditingAddress({ orderId, address: currentAddress, city: currentCity });
  };

  const handleSaveAddress = async () => {
    if (!editingAddress) return;
    
    try {
      // Update the address locally
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === editingAddress.orderId 
            ? { ...order, address: editingAddress.address, city: editingAddress.city }
            : order
        )
      );
      setEditingAddress(null);
      
      toast({
        title: "Address updated",
        description: `Address updated for order ${editingAddress.orderId}`,
      });
    } catch (err) {
      console.error('Error updating address:', err);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEditAddress = () => {
    setEditingAddress(null);
  };

  const handleManualConfirm = (orderId: string) => {
    handleStatusChange(orderId, 'complete');
    toast({
      title: "Address confirmed",
      description: `Order ${orderId} address marked as complete and reliable`,
    });
  };

  const handleManualCancel = (orderId: string) => {
    handleStatusChange(orderId, 'incomplete');
    toast({
      title: "Address rejected", 
      description: `Order ${orderId} address marked as incomplete`,
    });
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  const countByStatus = (status: OrderStatus) => {
    return orders.filter(order => order.status === status).length;
  };

  const handleRefresh = () => {
    toast({
      title: "Data refreshed",
      description: "Address verification data has been refreshed",
    });
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-400';
      case 'incomplete':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'waiting':
        return 'bg-blue-500/20 text-blue-400';
      case 'received':
        return 'bg-green-500/20 text-green-400';
      case 'no_response':
        return 'bg-red-500/20 text-red-400';
      case 'manual_review':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredOrders = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <main className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gradient">Address Verification</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white/5 border-white/10">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="button-gradient shadow-lg" onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </Button>
              </div>
            </div>
            
            <Card className="data-card border border-white/10">
              <div className="h-[calc(100vh-300px)]">
                <Tabs defaultValue="all" className="h-full flex flex-col">
                  <div className="px-4 pt-4 border-b border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <TabsList className="glass-morphism border border-white/10 rounded-full shadow-lg">
                        <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
                        <TabsTrigger value="incomplete" className="rounded-full">Incomplete</TabsTrigger>
                        <TabsTrigger value="waiting" className="rounded-full">Waiting</TabsTrigger>
                        <TabsTrigger value="received" className="rounded-full">Received</TabsTrigger>
                      </TabsList>
                      <Button variant="outline" className="bg-white/5 border-white/10">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <TabsContent value="all" className="flex-1 overflow-auto p-0 m-0">
                    <div className="h-full overflow-auto">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders('all').map((order) => (
                            <>
                              <TableRow 
                                key={order.id}
                                className="hover:bg-white/5"
                              >
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell className="hidden md:table-cell">{order.address}, {order.city}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {statusIcons[order.status]}
                                    <Badge className={`${getStatusClass(order.status)}`}>
                                      {statusLabels[order.status]}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExpand(order.id);
                                    }}
                                  >
                                    {order.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </Button>
                                </TableCell>
                              </TableRow>
                              {order.expanded && (
                                <TableRow>
                                  <TableCell colSpan={5} className="p-0">
                                    <div className="bg-white/5 rounded-md m-2 p-4 space-y-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-cod-purple">Address Details</h4>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleManualConfirm(order.id);
                                            }}
                                          >
                                            <Check className="mr-2 h-4 w-4" />
                                            Mark Complete
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleManualCancel(order.id);
                                            }}
                                          >
                                            <X className="mr-2 h-4 w-4" />
                                            Mark Incomplete
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleStatusChange(order.id, 'manual_review');
                                            }}
                                          >
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Send to Review
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 gap-4 text-sm">
                                        <div className="space-y-2">
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <span className="text-muted-foreground">Address:</span>
                                              {editingAddress && editingAddress.orderId === order.id ? (
                                                <div className="mt-1 space-y-2">
                                                  <div className="flex items-center space-x-2">
                                                    <Input
                                                      value={editingAddress.address}
                                                      onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                                                      className="bg-white/5 border-white/10 text-sm"
                                                      placeholder="Enter address"
                                                    />
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                    <Input
                                                      value={editingAddress.city}
                                                      onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                                                      className="bg-white/5 border-white/10 text-sm"
                                                      placeholder="Enter city"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={handleSaveAddress}
                                                      className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                                                    >
                                                      <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={handleCancelEditAddress}
                                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                                    >
                                                      <XCircle className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="mt-1 flex items-start space-x-2">
                                                  <span className="flex-1">{order.address}, {order.city}</span>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditAddress(order.id, order.address, order.city)}
                                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-cod-purple"
                                                  >
                                                    <Edit2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span className="ml-2">{order.phone}</span>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Order Date:</span>
                                            <span className="ml-2">{order.date}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="incomplete" className="flex-1 overflow-auto p-0 m-0">
                    <div className="h-full overflow-auto">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders('incomplete').map((order) => (
                            <TableRow 
                              key={order.id}
                              className="hover:bg-white/5"
                            >
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell className="hidden md:table-cell">{order.address}, {order.city}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {statusIcons[order.status]}
                                  <Badge className={`${getStatusClass(order.status)}`}>
                                    {statusLabels[order.status]}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand(order.id);
                                  }}
                                >
                                  {order.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="waiting" className="flex-1 overflow-auto p-0 m-0">
                    <div className="h-full overflow-auto">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders('waiting').map((order) => (
                            <TableRow 
                              key={order.id}
                              className="hover:bg-white/5"
                            >
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell className="hidden md:table-cell">{order.address}, {order.city}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {statusIcons[order.status]}
                                  <Badge className={`${getStatusClass(order.status)}`}>
                                    {statusLabels[order.status]}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand(order.id);
                                  }}
                                >
                                  {order.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="received" className="flex-1 overflow-auto p-0 m-0">
                    <div className="h-full overflow-auto">
                      <Table className="relative">
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders('received').map((order) => (
                            <TableRow 
                              key={order.id}
                              className="hover:bg-white/5"
                            >
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer}</TableCell>
                              <TableCell className="hidden md:table-cell">{order.address}, {order.city}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {statusIcons[order.status]}
                                  <Badge className={`${getStatusClass(order.status)}`}>
                                    {statusLabels[order.status]}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand(order.id);
                                  }}
                                >
                                  {order.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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

// Missing import definitions
function ChevronDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUp(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}
