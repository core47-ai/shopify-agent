import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, MessageSquare, Phone, UserCheck } from "lucide-react";
import { apiService, ResolvedCustomer } from "@/services/api";

export function ResolvedCustomersGrid() {
  const [resolvedCustomers, setResolvedCustomers] = useState<ResolvedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResolvedCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCustomers = await apiService.getResolvedCustomers();
        setResolvedCustomers(fetchedCustomers);
      } catch (err) {
        console.error('Error fetching resolved customers:', err);
        setError('Failed to fetch resolved customers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedCustomers();
  }, []);

  const getResolutionBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case "marked as resolved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400">Manual Resolution</Badge>;
      case "customer confirmed":
      case "response":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">Customer Confirmed</Badge>;
      case "reminder sent":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400">After Reminder</Badge>;
      case "customer called":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400">After Call</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-400">{method}</Badge>;
    }
  };

  const getResolutionIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "marked as resolved":
        return <UserCheck className="h-4 w-4 text-green-400" />;
      case "customer confirmed":
      case "response":
        return <Check className="h-4 w-4 text-blue-400" />;
      case "reminder sent":
        return <MessageSquare className="h-4 w-4 text-yellow-400" />;
      case "customer called":
        return <Phone className="h-4 w-4 text-purple-400" />;
      default:
        return <Check className="h-4 w-4 text-green-400" />;
    }
  };

  const getResolutionTimeBadge = (days: number) => {
    if (days === 0) {
      return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400">Same Day</Badge>;
    } else if (days === 1) {
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">1 Day</Badge>;
    } else if (days <= 3) {
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-400">{days} Days</Badge>;
    } else {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400">{days} Days</Badge>;
    }
  };

  if (loading) {
    return (
      <CardContent className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cod-purple"></div>
          <span className="ml-2 text-muted-foreground">Loading resolved customers...</span>
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
          <div className="col-span-1">Method</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Order #</div>
          <div className="col-span-2">Resolved Date</div>
          <div className="col-span-2">Resolution Time</div>
          <div className="col-span-3">Notes</div>
        </div>
        
        {resolvedCustomers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No resolved customers found.
          </div>
        ) : (
          resolvedCustomers.map((customer) => (
            <div 
              key={customer._id}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm hover:bg-white/5 rounded-md"
            >
              <div className="col-span-1 flex items-center">
                {getResolutionIcon(customer.resolution_method)}
              </div>
              <div className="col-span-2">
                <div className="font-medium">{customer.customer_name}</div>
                <div className="text-xs text-muted-foreground">{customer.customer_phone}</div>
              </div>
              <div className="col-span-2">
                <div className="font-mono text-xs">{customer.order_id}</div>
                <div className="text-xs text-muted-foreground">Rs.{customer.order_total}</div>
              </div>
              <div className="col-span-2">
                <div>{customer.resolved_date}</div>
                {customer.resolved_time && (
                  <div className="text-xs text-muted-foreground">{customer.resolved_time}</div>
                )}
              </div>
              <div className="col-span-2">
                <div className="flex flex-col gap-1">
                  {getResolutionTimeBadge(customer.days_to_resolve)}
                  {getResolutionBadge(customer.resolution_method)}
                </div>
              </div>
              <div className="col-span-3">
                <div className="text-xs text-muted-foreground max-w-full truncate" title={customer.resolution_note}>
                  {customer.resolution_note || "No additional notes"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  );
} 