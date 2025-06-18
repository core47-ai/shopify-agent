import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, Check, AlertCircle } from "lucide-react";
import { apiService, ReminderHistory } from "@/services/api";

export function ReminderHistoryGrid() {
  const [reminders, setReminders] = useState<ReminderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedReminders = await apiService.getReminderHistory();
        setReminders(fetchedReminders);
      } catch (err) {
        console.error('Error fetching reminder history:', err);
        setError('Failed to fetch reminder history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const getStatusBadge = (status: string, daysAgo: number) => {
    if (status === "sent") {
      if (daysAgo === 0) {
        return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400">Sent Today</Badge>;
      } else if (daysAgo <= 3) {
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400">Sent {daysAgo}d ago</Badge>;
      } else {
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400">Sent {daysAgo}d ago</Badge>;
      }
    }
    return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-400">{status}</Badge>;
  };

  const getReminderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "reminder sent":
      case "whatsapp message":
        return <MessageSquare className="h-4 w-4 text-cod-purple" />;
      case "follow-up reminder":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <CardContent className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cod-purple"></div>
          <span className="ml-2 text-muted-foreground">Loading reminder history...</span>
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
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-2">Order #</div>
          <div className="col-span-2">Sent Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Content</div>
        </div>
        
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reminders found in history.
          </div>
        ) : (
          reminders.map((reminder) => (
            <div 
              key={`${reminder._id}-${reminder.sent_date}`}
              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm hover:bg-white/5 rounded-md"
            >
              <div className="col-span-1 flex items-center">
                {getReminderIcon(reminder.reminder_type)}
              </div>
              <div className="col-span-2">
                <div className="font-medium">{reminder.customer_name}</div>
                <div className="text-xs text-muted-foreground">{reminder.customer_phone}</div>
              </div>
              <div className="col-span-2">
                <div className="font-mono text-xs">{reminder.order_id}</div>
                <div className="text-xs text-muted-foreground">Rs.{reminder.order_total}</div>
              </div>
              <div className="col-span-2">
                <div>{reminder.sent_date}</div>
                {reminder.sent_time && (
                  <div className="text-xs text-muted-foreground">{reminder.sent_time}</div>
                )}
              </div>
              <div className="col-span-2">
                {getStatusBadge(reminder.status, reminder.days_since_reminder)}
              </div>
              <div className="col-span-3">
                <div className="text-xs text-muted-foreground max-w-full truncate" title={reminder.reminder_content}>
                  {reminder.reminder_content || "Standard reminder message"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  );
} 