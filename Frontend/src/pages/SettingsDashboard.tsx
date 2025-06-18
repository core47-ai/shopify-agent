
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/Layout";
import { DashboardHeader } from "@/components/dashboard/Header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { 
  BellRing, 
  Mail, 
  MessageSquare, 
  Phone, 
  Lock, 
  Settings, 
  Globe 
} from "lucide-react";

interface SettingsForm {
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  callEnabled: boolean;
  apiKey: string;
  whatsappApiKey: string;
  webhookUrl: string;
  timezone: string;
  retryAttempts: string;
  waitTime: string;
}

export default function SettingsDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SettingsForm>({
    defaultValues: {
      whatsappEnabled: true,
      smsEnabled: false,
      emailEnabled: true,
      callEnabled: false,
      apiKey: "sk_test_1234567890abcdef",
      whatsappApiKey: "wh_test_1234567890abcdef",
      webhookUrl: "https://yourwebsite.com/webhook",
      timezone: "UTC",
      retryAttempts: "3",
      waitTime: "60",
    },
  });

  const onSubmit = (data: SettingsForm) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", data);
      setIsLoading(false);
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Settings" 
        description="Configure your CODVerify dashboard and notification settings"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dashboard Configuration
            </CardTitle>
            <CardDescription>
              Manage your dashboard settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="whatsappEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              WhatsApp
                            </FormLabel>
                            <FormDescription>
                              Send order confirmations via WhatsApp
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="smsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              SMS
                            </FormLabel>
                            <FormDescription>
                              Send SMS notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </FormLabel>
                            <FormDescription>
                              Send email notifications
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="callEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              Phone Call
                            </FormLabel>
                            <FormDescription>
                              Enable automated phone calls
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Configuration</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            API Key
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormDescription>
                            Your secret API key for CODVerify platform
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="whatsappApiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            WhatsApp API Key
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormDescription>
                            Your WhatsApp Business API key
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Webhook URL
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            URL for receiving webhook notifications
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Your preferred timezone for notifications
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="retryAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retry Attempts</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" max="10" />
                          </FormControl>
                          <FormDescription>
                            Number of retry attempts for failed confirmations
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="waitTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wait Time (mins)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="5" max="1440" />
                          </FormControl>
                          <FormDescription>
                            Wait time between retry attempts (in minutes)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellRing className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Receive daily order summary
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High Risk Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for high-risk orders
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Failed Confirmations</p>
                  <p className="text-sm text-muted-foreground">
                    Alert on failed confirmation attempts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Enable 2FA for your account
                  </p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after inactivity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Manage API Keys
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
