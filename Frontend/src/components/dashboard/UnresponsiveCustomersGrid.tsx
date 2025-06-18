import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, MessageSquare, Phone, Flag, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService, UnresponsiveCustomer } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnresponsiveCustomersGridProps {
  statusFilter?: string;
  onActionComplete?: () => void;
}

export function UnresponsiveCustomersGrid({ statusFilter, onActionComplete }: UnresponsiveCustomersGridProps) {
  const [customers, setCustomers] = useState<UnresponsiveCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCustomers = await apiService.getUnresponsiveCustomers(statusFilter);
        setCustomers(fetchedCustomers);
      } catch (err) {
        console.error('Error fetching unresponsive customers:', err);
        setError('Failed to fetch unresponsive customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [statusFilter]);

  const toggleExpand = (customerId: string) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => {
        if (customer.id === customerId) {
          return { ...customer, expanded: !customer.expanded };
        }
        return customer;
      })
    );
  };

  const handleActionSelect = async (customerId: string, action: string) => {
    try {
      setActionLoading(customerId);
      
      // Map display names to API values
      const actionMap: { [key: string]: string } = {
        "Send Reminder": "send_reminder",
        "Call Customer": "call_customer", 
        "Mark as Resolved": "mark_resolved"
      };

      const apiAction = actionMap[action];
      if (!apiAction) {
        throw new Error("Invalid action selected");
      }

      await apiService.updateCustomerAction(customerId, apiAction);
      
      // Refresh the customers list to show updated data
      const fetchedCustomers = await apiService.getUnresponsiveCustomers(statusFilter);
      setCustomers(fetchedCustomers);
      
      // Notify parent component that an action was completed
      // This will trigger refresh of reminder history and resolved customers tabs
      if (onActionComplete) {
        onActionComplete();
      }
      
    } catch (err) {
      console.error('Error updating customer action:', err);
      setError('Failed to update customer action. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "waiting":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">Waiting</Badge>;
      case "reminder_sent":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400">Reminder Sent</Badge>;
      case "no_response":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400">No Response</Badge>;
      case "tagged":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400">Call Tagged</Badge>;
      case "manual_followup":
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-400">Manual Follow-up</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-400">{status}</Badge>;
    }
  };

  const getFlowStageBadge = (stage: string) => {
    switch (stage) {
      case "confirmation":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">Waiting Confirmation</Badge>;
      case "reminder":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400">Reminder Phase</Badge>;
      case "no_response":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400">No Response</Badge>;
      case "call_tagged":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400">Tagged for Call</Badge>;
      case "manual_followup":
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-400">Manual Follow-up</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400">Completed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-400">{stage}</Badge>;
    }
  };

  if (loading) {
        return (
      <CardContent className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cod-purple"></div>
          <span className="ml-2 text-muted-foreground">Loading unresponsive customers...</span>
        </div>
      </CardContent>
    );
  }

  if (error) {
        return (
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
    );
  }

  return (
    <CardContent className="p-0">
      <div className="space-y-1 p-4">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm border-b border-white/10">
          <div className="col-span-1"></div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Order #</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last Contact</div>
          <div className="col-span-3">Actions</div>
        </div>
        
        {customers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No unresponsive customers found.
          </div>
        ) : (
          customers.map((customer) => (
          <div key={customer.id} className="space-y-1">
            <div 
              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm hover:bg-white/5 cursor-pointer rounded-md"
              onClick={() => toggleExpand(customer.id)}
            >
              <div className="col-span-1 flex items-center">
                {customer.expanded ? 
                  <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              <div className="col-span-2 font-medium">{customer.name}</div>
                <div className="col-span-2">{customer.order_number}</div>
              <div className="col-span-2">{getStatusBadge(customer.status)}</div>
                <div className="col-span-2 text-muted-foreground">{customer.last_contact}</div>
                <div className="col-span-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Select 
                    onValueChange={(value) => handleActionSelect(customer.id, value)}
                    disabled={actionLoading === customer.id}
                  >
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue placeholder="Select action..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Send Reminder">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3" />
                          Send Reminder
                        </div>
                      </SelectItem>
                      <SelectItem value="Call Customer">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          Call Customer
                        </div>
                      </SelectItem>
                      <SelectItem value="Mark as Resolved">
                        <div className="flex items-center gap-2">
                          <Check className="h-3 w-3" />
                          Mark as Resolved
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {actionLoading === customer.id && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cod-purple"></div>
                  )}
                </div>
            </div>
            
            {customer.expanded && (
              <div className="bg-white/5 rounded-md mb-2 overflow-hidden">
                <div className="border-l-2 border-cod-purple ml-6 p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Customer Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Customer ID</p>
                        <p>{customer.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                          <p>{customer.order_date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p>{customer.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p>{customer.phone}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Address</p>
                          <p>{customer.address}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Order Total</p>
                          <p className="font-medium">Rs.{customer.order_total}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days Since Order</p>
                          <p>{customer.days_since_order} days</p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Current Flow Stage</h4>
                      <div>{getFlowStageBadge(customer.flow_stage)}</div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Timeline</h4>
                    <div className="space-y-2">
                      {customer.actions.map((action, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "flex items-center justify-between p-2 text-xs rounded",
                            action.status === "pending" ? "bg-cod-purple/10" : "bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {action.status === "pending" ? (
                              <Clock className="h-3 w-3 text-cod-purple" />
                            ) : (
                              <Check className="h-3 w-3 text-green-400" />
                            )}
                            <span>{action.type}</span>
                            {action.note && (
                              <span className="text-muted-foreground ml-2">
                                - {action.note}
                              </span>
                            )}
                          </div>
                          <span className="text-muted-foreground">{action.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          ))
        )}
      </div>
    </CardContent>
  );
}
