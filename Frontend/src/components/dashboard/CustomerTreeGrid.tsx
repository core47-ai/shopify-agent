
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type CustomerTreeGridProps = {
  customers: HighRiskCustomer[];
};

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

export const CustomerTreeGrid: React.FC<CustomerTreeGridProps> = ({ customers }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleRow = (customerId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  const handleModifyMessage = (customerId: string) => {
    toast({
      title: "Message Modified",
      description: `Customer ${customerId} will be asked for Rs. 300 advance payment.`,
    });
  };

  return (
    <div className="rounded-md border border-white/10 shadow-inner bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="hover:bg-white/5 border-white/10">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expand</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer ID</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Return Rate</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order Count</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tags</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Order</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <React.Fragment key={customer.id}>
              <tr className="hover:bg-white/5 border-white/10">
                <td className="p-4 align-middle">
                  <button onClick={() => toggleRow(customer.id)} className="h-6 w-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    {expandedRows[customer.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                </td>
                <td className="p-4 align-middle">{customer.id}</td>
                <td className="p-4 align-middle">{customer.name}</td>
                <td className="p-4 align-middle">{customer.phone}</td>
                <td className="p-4 align-middle">
                  <Badge 
                    variant={
                      parseFloat(customer.returnRate) > 60 ? "danger" :
                      parseFloat(customer.returnRate) > 40 ? "warning" : 
                      "success"
                    }
                  >
                    {customer.returnRate}
                  </Badge>
                </td>
                <td className="p-4 align-middle">{customer.orderCount}</td>
                <td className="p-4 align-middle">
                  {customer.tags.includes("multiple_orders") && (
                    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/50">
                      Multiple Orders
                    </Badge>
                  )}
                </td>
                <td className="p-4 align-middle">{customer.lastOrder}</td>
                <td className="p-4 align-middle">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border border-white/10">
                      <DialogHeader>
                        <DialogTitle>AI Message Templates</DialogTitle>
                        <DialogDescription>
                          Review messages sent by AI to this customer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="rounded-md bg-white/5 border border-white/10 p-4">
                          <p className="text-sm text-white mb-2">Current Message Template:</p>
                          <div className="p-3 rounded-md bg-white/10 border border-white/10 text-sm">
                            Hello {customer.name}, please confirm your order #{customer.id.replace('C', 'O')} by replying YES.
                          </div>
                        </div>
                        
                        <div className="rounded-md bg-orange-500/10 border border-orange-500/20 p-4">
                          <p className="text-sm text-white mb-2">AI Generated Message (High Risk Customer):</p>
                          <div className="p-3 rounded-md bg-white/10 border border-white/10 text-sm">
                            Hello {customer.name}, please confirm your order #{customer.id.replace('C', 'O')} by replying YES. 
                            <span className="text-cod-orange font-semibold">
                              As per our policy, we request an advance payment of Rs. 300 before confirming your order.
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button className="button-gradient" onClick={() => handleModifyMessage(customer.id)}>
                            Apply AI Message
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
              
              {expandedRows[customer.id] && (
                <tr className="bg-white/5 border-white/10">
                  <td colSpan={9} className="p-0">
                    <div className="p-4 space-y-4 bg-gradient-to-r from-cod-dark/40 to-cod-charcoal/40">
                      <div className="rounded-md border border-white/10 bg-white/5 p-4">
                        <h4 className="text-sm font-medium mb-2">Message History</h4>
                        {customer.messageHistory && customer.messageHistory.length > 0 ? (
                          <div className="space-y-3">
                            {customer.messageHistory.map((msg, idx) => (
                              <div key={idx} className="rounded-md bg-white/5 border border-white/10 p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                                  {msg.responseReceived ? (
                                    <Badge variant="success">Response Received</Badge>
                                  ) : (
                                    <Badge variant="warning">Awaiting Response</Badge>
                                  )}
                                </div>
                                <div className="text-sm">{msg.message}</div>
                                {msg.advanceAmount && (
                                  <div className="flex items-center mt-2">
                                    <Badge variant="custom" className="text-cod-purple bg-cod-purple/10">
                                      Rs. {msg.advanceAmount} Advance
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No message history available.</div>
                        )}
                      </div>
                      
                      <div className="rounded-md border border-white/10 bg-white/5 p-4">
                        <h4 className="text-sm font-medium mb-2">AI Analysis</h4>
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-2">This customer has been flagged by our AI system due to:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>High return rate ({customer.returnRate})</li>
                            {customer.orderCount > 5 && <li>Multiple orders placed ({customer.orderCount})</li>}
                            {customer.tags.includes("multiple_orders") && <li>Pattern of ordering multiple items</li>}
                            <li>Recent activity detected {customer.lastOrder}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
