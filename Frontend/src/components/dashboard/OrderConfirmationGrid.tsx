import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { ChevronDown, ChevronRight, Filter, Check, X, CheckSquare, Square, Edit2, Save, XCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { apiService, Order } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface OrderConfirmationGridProps {
  statusFilter?: string;
}

interface FilterState {
  trackingId: string;
  orderId: string;
  assignedCourier: string;
  status: string;
  deliveryStatus: string;
}

export function OrderConfirmationGrid({ statusFilter = "all" }: OrderConfirmationGridProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{orderId: string, address: string} | null>(null);
  const [loadingStates, setLoadingStates] = useState({
    postex: false,
    leopard: false,
    recommended: false,
    confirm: false,
    cancel: false
  });
  const [filters, setFilters] = useState<FilterState>({
    trackingId: "",
    orderId: "",
    assignedCourier: "",
    status: "",
    deliveryStatus: ""
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await apiService.getOrders(statusFilter);
        
        // Better product names
        const productNames = [
          "Salsa Spirit", "Wild Essence", "Million Smiles", "Crimson Charm", "Azure Dreams",
          "Golden Glow", "Mystic Mist", "Velvet Vibes", "Crystal Clear", "Midnight Magic",
          "Ruby Rush", "Emerald Elegance", "Diamond Daze", "Silver Shine", "Pearl Paradise"
        ];
        
        // Add mock data for product info and delivery status for demonstration
        const ordersWithMockData = fetchedOrders.map(order => ({
          ...order,
          product_name: order.product_name || productNames[Math.floor(Math.random() * productNames.length)],
          product_quantity: order.product_quantity || Math.floor(Math.random() * 5) + 1,
          delivery_status: order.delivery_status || getDeliveryStatusFromTracking(order.tracking, order.status)
        }));
        setOrders(ordersWithMockData);
        setFilteredOrders(ordersWithMockData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  // Helper function to determine delivery status based on tracking and order status
  const getDeliveryStatusFromTracking = (tracking?: string, orderStatus?: string): "pending" | "shipped" | "in_transit" | "delivered" | "failed" | "returned" => {
    if (!tracking || orderStatus === "unconfirmed") return "pending";
    if (orderStatus === "confirmed") {
      // Mock delivery status based on random selection for demo
      const statuses = ["shipped", "in_transit", "delivered"] as const;
      return statuses[Math.floor(Math.random() * statuses.length)];
    }
    return "pending";
  };

  // Apply filters whenever filters or orders change
  useEffect(() => {
    let filtered = orders;

    if (filters.trackingId) {
      filtered = filtered.filter(order => 
        order.tracking?.toLowerCase().includes(filters.trackingId.toLowerCase())
      );
    }

    if (filters.orderId) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(filters.orderId.toLowerCase())
      );
    }

    if (filters.assignedCourier) {
      filtered = filtered.filter(order => 
        order.assigned_courier?.toLowerCase().includes(filters.assignedCourier.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    if (filters.deliveryStatus) {
      filtered = filtered.filter(order => 
        order.delivery_status?.toLowerCase().includes(filters.deliveryStatus.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    // Reset select all when filters change
    setSelectedOrders(new Set());
    setSelectAll(false);
  }, [filters, orders]);

  const toggleExpand = (orderId: string) => {
    setFilteredOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, expanded: !order.expanded };
        }
        return order;
      })
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
    setSelectAll(newSelected.size === filteredOrders.length && filteredOrders.length > 0);
  };

  const handleEditAddress = (orderId: string, currentAddress: string) => {
    setEditingAddress({ orderId, address: currentAddress });
  };

  const handleSaveAddress = async () => {
    if (!editingAddress) return;
    
    try {
      // Here you would make an API call to update the address
      // For now, we'll update it locally
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === editingAddress.orderId 
            ? { ...order, customer_address: editingAddress.address }
            : order
        )
      );
      setEditingAddress(null);
    } catch (err) {
      console.error('Error updating address:', err);
    }
  };

  const handleCancelEditAddress = () => {
    setEditingAddress(null);
  };

  const handleBulkConfirm = async () => {
    if (selectedOrders.size === 0) return;
    
    setLoadingStates(prev => ({ ...prev, confirm: true }));
    try {
      const orderIds = Array.from(selectedOrders);
      console.log('🚀 Confirming orders via backend:', orderIds);
      
      const response = await apiService.confirmOrders(orderIds);
      console.log('✅ Orders confirmed successfully:', response);
      
      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          selectedOrders.has(order.id) 
            ? { ...order, status: "confirmed" }
            : order
        )
      );
      
      setSelectedOrders(new Set());
      setSelectAll(false);

      toast({
        title: "Success!",
        description: response.message,
        duration: 3000,
      });
    } catch (err) {
      console.error('❌ Error bulk confirming orders:', err);
      toast({
        title: "Error",
        description: "Failed to confirm orders. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, confirm: false }));
    }
  };

  const handleBulkCancel = async () => {
    if (selectedOrders.size === 0) return;
    
    setLoadingStates(prev => ({ ...prev, cancel: true }));
    try {
      const orderIds = Array.from(selectedOrders);
      console.log('🚀 Cancelling orders via backend:', orderIds);
      
      const response = await apiService.cancelOrders(orderIds);
      console.log('✅ Orders cancelled successfully:', response);
      
      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          selectedOrders.has(order.id) 
            ? { ...order, status: "unconfirmed" }
            : order
        )
      );
      
      setSelectedOrders(new Set());
      setSelectAll(false);

      toast({
        title: "Success!",
        description: response.message,
        duration: 3000,
      });
    } catch (err) {
      console.error('❌ Error bulk cancelling orders:', err);
      toast({
        title: "Error",
        description: "Failed to cancel orders. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, cancel: false }));
    }
  };

  const handleBulkBookWithPostex = async () => {
    if (selectedOrders.size === 0) return;
    
    setLoadingStates(prev => ({ ...prev, postex: true }));
    
    const orderIds = Array.from(selectedOrders);
    console.log('🚀 Booking orders with PostEx via backend:', orderIds);
    
    try {
      const response = await apiService.bookWithPostex(orderIds);
      console.log('✅ PostEx booking successful:', response);

      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          selectedOrders.has(order.id) 
            ? { ...order, assigned_courier: "postex", status: "confirmed" }
            : order
        )
      );
      
      setSelectedOrders(new Set());
      setSelectAll(false);

      toast({
        title: "Success!",
        description: `${orderIds.length} order(s) successfully booked with PostEx`,
        duration: 3000,
      });
      
    } catch (err) {
      console.error('❌ Error booking orders with PostEx:', err);
      toast({
        title: "Error",
        description: `Failed to book orders with PostEx. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, postex: false }));
    }
  };

  const handleBulkBookWithLeopard = async () => {
    if (selectedOrders.size === 0) return;
    
    setLoadingStates(prev => ({ ...prev, leopard: true }));
    
    const orderIds = Array.from(selectedOrders);
    console.log('🚀 Booking orders with Leopard via backend:', orderIds);
    
    try {
      const response = await apiService.bookWithLeopard(orderIds);
      console.log('✅ Leopard booking successful:', response);

      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          selectedOrders.has(order.id) 
            ? { ...order, assigned_courier: "leopard", status: "confirmed" }
            : order
        )
      );
      
      setSelectedOrders(new Set());
      setSelectAll(false);

      toast({
        title: "Success!",
        description: `${orderIds.length} order(s) successfully booked with Leopard`,
        duration: 3000,
      });
      
    } catch (err) {
      console.error('❌ Error booking orders with Leopard:', err);
      toast({
        title: "Error",
        description: `Failed to book orders with Leopard. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, leopard: false }));
    }
  };

  const handleBulkBook = async () => {
    if (selectedOrders.size === 0) return;
    
    setLoadingStates(prev => ({ ...prev, recommended: true }));
    
    const orderIds = Array.from(selectedOrders);
    console.log('🚀 Booking orders with recommended portals via backend:', orderIds);
    
    try {
      const response = await apiService.bookRecommended(orderIds);
      console.log('✅ Recommended portals booking successful:', response);

      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          selectedOrders.has(order.id) 
            ? { ...order, status: "confirmed" }
            : order
        )
      );
      
      setSelectedOrders(new Set());
      setSelectAll(false);

      toast({
        title: "Success!",
        description: `${orderIds.length} order(s) successfully booked to recommended portals`,
        duration: 3000,
      });
      
    } catch (err) {
      console.error('❌ Error bulk booking orders:', err);
      toast({
        title: "Error",
        description: `Failed to book orders to recommended portals. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, recommended: false }));
    }
  };

  const handleManualConfirm = async (orderId: string) => {
    try {
      console.log('🚀 Manually confirming order:', orderId);
      
      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "confirmed" }
            : order
        )
      );
      
      console.log('✅ Order confirmed successfully:', orderId);
      toast({
        title: "Success!",
        description: `Order ${orderId} confirmed successfully`,
        duration: 3000,
      });
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      toast({
        title: "Error",
        description: `Failed to confirm order ${orderId}. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleManualCancel = async (orderId: string) => {
    try {
      console.log('🚀 Manually cancelling order:', orderId);
      
      // Update local state immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "unconfirmed" }
            : order
        )
      );
      
      console.log('✅ Order cancelled successfully:', orderId);
      toast({
        title: "Success!",
        description: `Order ${orderId} cancelled successfully`,
        duration: 3000,
      });
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      toast({
        title: "Error",
        description: `Failed to cancel order ${orderId}. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [key]: "" }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "unconfirmed":
        return "status-unconfirmed";
      case "sent":
        return "text-blue-500";
      case "delivered":
        return "text-blue-400";
      case "read":
        return "text-blue-300";
      case "responded":
        return "text-green-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getDeliveryStatusColor = (deliveryStatus: string) => {
    switch (deliveryStatus) {
      case "delivered":
        return "text-green-400";
      case "shipped":
        return "text-blue-500";
      case "in_transit":
        return "text-yellow-500";
      case "pending":
        return "text-gray-400";
      case "failed":
        return "text-red-400";
      case "returned":
        return "text-orange-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getCourierBadgeVariant = (courier: string) => {
    switch (courier) {
      case "postex": return "info";
      case "leopard": return "purple";
      default: return "warning";
    }
  };
  
  const getCourierName = (courier: string) => {
    switch (courier) {
      case "postex": return "PostEx";
      case "leopard": return "Leopard";
      default: return "Not Assigned";
    }
  };

  const FilterPopover = ({ title, value, onChange, options }: { 
    title: string; 
    value: string; 
    onChange: (value: string) => void;
    options?: string[];
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
          <Filter className={cn("h-3 w-3", value ? "text-cod-purple" : "")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 bg-cod-dark border border-white/10">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{title} Filter</h4>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onChange("")}
              >
                Clear
              </Button>
            )}
          </div>
          <Input
            placeholder={`Filter by ${title.toLowerCase()}...`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/5 border-white/10"
          />
          {options && options.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              <div className="text-xs text-muted-foreground mb-1">Quick select:</div>
              {options.map(option => (
                <Button
                  key={option}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs hover:bg-white/10"
                  onClick={() => onChange(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );

  if (loading) {
    return (
      <Card className="data-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cod-purple"></div>
            <span className="ml-2 text-muted-foreground">Loading orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="data-card">
        <CardContent className="p-8">
          <div className="text-center text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-cod-purple hover:text-cod-purple-light underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get unique values for filter options
  const uniqueCouriers = [...new Set(orders.map(order => order.assigned_courier).filter(Boolean))];
  const uniqueStatuses = [...new Set(orders.map(order => order.status))];
  const uniqueDeliveryStatuses = [...new Set(orders.map(order => order.delivery_status).filter(Boolean))];

  return (
    <Card className="data-card">
      <CardContent className="p-0">
        {/* Selection and Filter Summary */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2 text-sm hover:bg-white/10" 
                onClick={handleSelectAll}
              >
                {selectAll ? 
                  <CheckSquare className="h-4 w-4" /> : 
                  <Square className="h-4 w-4" />
                }
                <span>Select All ({filteredOrders.length})</span>
              </Button>
              
              {/* Bulk Action Buttons */}
              {selectedOrders.size > 0 && (
                <div className="flex items-center space-x-2 flex-wrap">
                  <Badge variant="outline" className="bg-cod-purple/20 text-cod-purple">
                    {selectedOrders.size} selected
                  </Badge>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={handleBulkBookWithPostex}
                    disabled={loadingStates.postex}
                  >
                    <Package className={cn("mr-2 h-4 w-4", loadingStates.postex && "animate-spin")} />
                    {loadingStates.postex ? "Booking..." : "Book with PostEx"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={handleBulkBookWithLeopard}
                    disabled={loadingStates.leopard}
                  >
                    <Package className={cn("mr-2 h-4 w-4", loadingStates.leopard && "animate-spin")} />
                    {loadingStates.leopard ? "Booking..." : "Book with Leopard"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={handleBulkBook}
                    disabled={loadingStates.recommended}
                  >
                    <Package className={cn("mr-2 h-4 w-4", loadingStates.recommended && "animate-spin")} />
                    {loadingStates.recommended ? "Booking..." : "Book"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={handleBulkConfirm}
                    disabled={loadingStates.confirm}
                  >
                    <Check className={cn("mr-2 h-4 w-4", loadingStates.confirm && "animate-spin")} />
                    {loadingStates.confirm ? "Confirming..." : "Manually Confirm"}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={handleBulkCancel}
                    disabled={loadingStates.cancel}
                  >
                    <X className={cn("mr-2 h-4 w-4", loadingStates.cancel && "animate-spin")} />
                    {loadingStates.cancel ? "Cancelling..." : "Manually Cancel"}
                  </Button>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(filters.trackingId || filters.orderId || filters.assignedCourier || filters.status || filters.deliveryStatus) && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {filters.trackingId && (
                <Badge variant="outline" className="text-xs">
                  Tracking ID: {filters.trackingId}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => clearFilter('trackingId')}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {filters.orderId && (
                <Badge variant="outline" className="text-xs">
                  Order ID: {filters.orderId}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => clearFilter('orderId')}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {filters.assignedCourier && (
                <Badge variant="outline" className="text-xs">
                  Courier: {filters.assignedCourier}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => clearFilter('assignedCourier')}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {filters.status && (
                <Badge variant="outline" className="text-xs">
                  Status: {filters.status}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => clearFilter('status')}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
              {filters.deliveryStatus && (
                <Badge variant="outline" className="text-xs">
                  Delivery Status: {filters.deliveryStatus}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => clearFilter('deliveryStatus')}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1 p-4">
          {/* Header with filters */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 font-medium text-sm border-b border-white/10 bg-white/5 rounded-t-lg">
            <div className="col-span-1 flex items-center">
              <ChevronRight className="h-4 w-4 text-transparent" />
            </div>
            <div className="col-span-1 flex items-center">
              <Square className="h-4 w-4 text-transparent" />
            </div>
            <div className="col-span-2 flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span>Customer</span>
            </div>
            <div className="col-span-2 flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span>Tracking ID</span>
              <div className="ml-2 pl-2 border-l border-white/20">
                <FilterPopover
                  title="Tracking ID"
                  value={filters.trackingId}
                  onChange={(value) => updateFilter('trackingId', value)}
                />
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span>Order ID</span>
              <div className="ml-2 pl-2 border-l border-white/20">
                <FilterPopover
                  title="Order ID"
                  value={filters.orderId}
                  onChange={(value) => updateFilter('orderId', value)}
                />
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span>Courier</span>
              <div className="ml-2 pl-2 border-l border-white/20">
                <FilterPopover
                  title="Assigned Courier"
                  value={filters.assignedCourier}
                  onChange={(value) => updateFilter('assignedCourier', value)}
                  options={uniqueCouriers}
                />
              </div>
            </div>
            <div className="col-span-1 flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span>Status</span>
              <div className="ml-1 pl-1 border-l border-white/20">
                <FilterPopover
                  title="Status"
                  value={filters.status}
                  onChange={(value) => updateFilter('status', value)}
                  options={uniqueStatuses}
                />
              </div>
            </div>
            <div className="col-span-1 flex items-center justify-between bg-white/5 rounded px-2 py-1">
              <span>Delivery</span>
              <div className="ml-1 pl-1 border-l border-white/20">
                <FilterPopover
                  title="Delivery Status"
                  value={filters.deliveryStatus}
                  onChange={(value) => updateFilter('deliveryStatus', value)}
                  options={uniqueDeliveryStatuses}
                />
              </div>
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {orders.length === 0 ? "No orders available." : "No orders found for the selected filter."}
            </div>
          ) : (
            filteredOrders.map((order: any) => (
              <div key={order.id} className="space-y-1">
                <div 
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-white/5 rounded-md transition-colors duration-200"
                >
                  <div className="col-span-1 flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleExpand(order.id)}
                    >
                      {order.expanded ? 
                        <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      }
                    </Button>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOrder(order.id);
                      }}
                    >
                      {selectedOrders.has(order.id) ? 
                        <CheckSquare className="h-4 w-4 text-cod-purple" /> : 
                        <Square className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  <div className="col-span-2 text-xs font-medium cursor-pointer truncate" onClick={() => toggleExpand(order.id)}>{order.customer}</div>
                  <div className="col-span-2 font-medium font-mono text-xs cursor-pointer truncate" onClick={() => toggleExpand(order.id)}>{order.tracking || 'Not assigned'}</div>
                  <div className="col-span-2 font-medium text-xs cursor-pointer truncate" onClick={() => toggleExpand(order.id)}>{order.id}</div>
                  <div className="col-span-2 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <Badge variant={getCourierBadgeVariant(order.assigned_courier)} className="text-xs">
                      {getCourierName(order.assigned_courier)}
                    </Badge>
                  </div>
                  <div className="col-span-1 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <Badge variant="outline" className={cn("status-tag text-xs", getStatusColor(order.status))}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                    <Badge variant="outline" className={cn("status-tag text-xs", getDeliveryStatusColor(order.delivery_status))}>
                      {order.delivery_status}
                    </Badge>
                  </div>
                </div>
                
                {order.expanded && (
                  <div className="ml-6 space-y-2">
                    {/* Order Details */}
                    <div className="p-4 bg-white/5 border-l-2 border-cod-purple rounded-md">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-cod-purple">Order Details</h4>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 text-xs h-8 px-4"
                            onClick={() => handleManualConfirm(order.id)}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Manually Confirm
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 text-xs h-8 px-4"
                            onClick={() => handleManualCancel(order.id)}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Manually Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="text-muted-foreground">Address:</span>
                              {editingAddress && editingAddress.orderId === order.id ? (
                                <div className="mt-1 flex items-center space-x-2">
                                  <Input
                                    value={editingAddress.address}
                                    onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                                    className="bg-white/5 border-white/10 text-sm"
                                    placeholder="Enter customer address"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSaveAddress}
                                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelEditAddress}
                                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="mt-1 flex items-start space-x-2">
                                  <span className="flex-1">{order.customer_address}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditAddress(order.id, order.customer_address)}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-cod-purple"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Product:</span>
                          <span className="ml-2 font-medium">{order.product_name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="ml-2">{order.product_quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="ml-2">{order.customer_phone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <span className="ml-2">{order.customer_email}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Order Total:</span>
                          <span className="ml-2 font-medium">Rs.{order.total_price}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Order Date:</span>
                          <span className="ml-2">{order.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation History */}
                    {order.children?.map((child: any, index: number) => (
                      <div 
                        key={`${order.id}-child-${index}`}
                        className="grid grid-cols-12 gap-4 px-4 py-2 text-sm bg-white/5 border-l-2 border-cod-purple ml-6 rounded-md"
                      >
                        <div className="col-span-3 pl-6 font-medium">{child.type}</div>
                        <div className="col-span-5">{child.content}</div>
                        <div className="col-span-2">
                          {child.status && (
                            <Badge variant="outline" className={cn("status-tag", getStatusColor(child.status))}>
                              {child.status}
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-2 text-muted-foreground">{child.timestamp}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
