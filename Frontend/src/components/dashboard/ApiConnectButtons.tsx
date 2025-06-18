
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, MessageSquare } from "lucide-react";

export function ApiConnectButtons() {
  const { toast } = useToast();
  
  const handleConnect = (service: string) => {
    toast({
      title: `Connect to ${service}`,
      description: `Initiating connection to ${service} API...`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="data-card card-hover">
        <CardHeader className="bg-gradient-to-br from-cod-dark to-cod-charcoal">
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-cod-orange" />
            Connect to Shopify
          </CardTitle>
          <CardDescription>Integrate with your Shopify store to sync orders</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button 
            className="w-full bg-gradient-to-r from-cod-orange/30 to-cod-orange/20 hover:from-cod-orange/40 hover:to-cod-orange/30 border border-cod-orange/30" 
            onClick={() => handleConnect("Shopify")}
          >
            Connect Shopify API
          </Button>
        </CardContent>
      </Card>
      
      <Card className="data-card card-hover">
        <CardHeader className="bg-gradient-to-br from-cod-dark to-cod-charcoal">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-cod-blue" />
            Connect to WhatsApp
          </CardTitle>
          <CardDescription>Setup WhatsApp Business API for messaging</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button 
            className="w-full button-gradient" 
            onClick={() => handleConnect("WhatsApp")}
          >
            Connect WhatsApp API
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
