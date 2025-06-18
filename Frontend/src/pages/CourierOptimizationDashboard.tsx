import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Filter, Download, Package, Truck, Map, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { apiService, Delivery, CourierStats, CityStats, DeliverySummary } from "@/services/api";
import { Link } from "react-router-dom";

export default function CourierOptimizationDashboard() {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [courierStats, setCourierStats] = useState<{[key: string]: CourierStats}>({});
  const [cityStats, setCityStats] = useState<CityStats[]>([]);
  const [summary, setSummary] = useState<DeliverySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);

      console.log('Starting to fetch courier data...');

      // Track if any request used fallback data
      let fallbackUsed = false;

      // Fetch all data in parallel with better error handling
      const [deliveriesData, courierStatsData, cityStatsData, summaryData] = await Promise.all([
        apiService.getDeliveries().catch(err => {
          fallbackUsed = true;
          console.warn('Using fallback data for deliveries:', err);
          return apiService.getDeliveries(); // This will return mock data due to our fallback logic
        }),
        apiService.getCourierStats().catch(err => {
          fallbackUsed = true;
          console.warn('Using fallback data for courier stats:', err);
          return apiService.getCourierStats(); // This will return mock data due to our fallback logic
        }),
        apiService.getCityStats().catch(err => {
          fallbackUsed = true;
          console.warn('Using fallback data for city stats:', err);
          return apiService.getCityStats(); // This will return mock data due to our fallback logic
        }),
        apiService.getDeliverySummary().catch(err => {
          fallbackUsed = true;
          console.warn('Using fallback data for summary:', err);
          return apiService.getDeliverySummary(); // This will return mock data due to our fallback logic
        })
      ]);

      setDeliveries(deliveriesData);
      setCourierStats(courierStatsData);
      setCityStats(cityStatsData);
      setSummary(summaryData);
      setUsingFallbackData(fallbackUsed);

      if (fallbackUsed) {
        toast({
          title: "Using Sample Data",
          description: "Backend server not available. Displaying sample courier data for demonstration.",
          variant: "default"
        });
      } else {
        console.log('All data fetched successfully from backend');
      }

    } catch (err: any) {
      console.error('Error fetching courier data:', err);
      const errorMessage = err.message || 'Failed to fetch courier data. Please ensure the backend server is running on port 8000.';
      setError(errorMessage);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the backend server. Please check if the server is running.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAnalysis = () => {
    fetchData();
    toast({
      title: "Refreshing Data",
      description: "Attempting to fetch latest delivery data from the database.",
    });
  };
  
  // Get courier badge color based on assigned courier
  const getCourierBadgeVariant = (courier: string) => {
    switch (courier) {
      case "postex": return "info";
      case "leopard": return "purple";
      default: return "warning";
    }
  };
  
  // Get courier display name
  const getCourierName = (courier: string) => {
    switch (courier) {
      case "postex": return "PostEx";
      case "leopard": return "Leopard";
      default: return "Default";
    }
  };
  
  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered": return "success";
      case "dispatched": 
      case "on_route_to_customer": return "info";
      case "unbooked": return "warning";
      case "returned":
      case "on_route_to_be_returned":
      case "on_route_to_the_warehouse": return "destructive";
      default: return "secondary";
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gradient">Courier Optimization</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cod-purple"></div>
          <span className="ml-2 text-muted-foreground">Loading courier data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gradient">Courier Optimization</h1>
        </div>
        <div className="text-center mt-20 p-6">
          <div className="mb-4">
            <Package className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Backend Connection Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="text-sm text-muted-foreground mb-4">
              Please ensure:
              <ul className="list-disc text-left inline-block mt-2">
                <li>Backend server is running on port 8000</li>
                <li>MongoDB is connected</li>
                <li>CORS is properly configured</li>
              </ul>
            </div>
          </div>
          <Button 
            onClick={fetchData} 
            className="button-gradient"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gradient">Courier Optimization</h1>
          {usingFallbackData && (
            <Badge variant="warning" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Sample Data Mode
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="button-gradient shadow-lg" onClick={handleRefreshAnalysis}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </div>
      
      <main className="p-6">
          <div className="space-y-6">
            {usingFallbackData && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-400/5 border border-yellow-500/20 text-sm shadow-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Demo Mode Active</span>
                </div>
                <p className="text-muted-foreground mt-1">
                  Backend server is not available. This dashboard is showing sample courier data for demonstration. 
                  Please start the backend server on port 8000 to see real MongoDB data.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="data-card card-hover">
                <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                  <CardTitle className="flex items-center text-lg">
                    <Package className="mr-2 h-4 w-4 text-cod-orange" />
                    Total Orders
                  </CardTitle>
                  <CardDescription>All courier deliveries</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold">{summary?.total_orders || 0}</div>
                  <div className="text-sm text-green-500 flex items-center gap-1">
                    <Badge className="bg-green-500/20 text-green-400 rounded-full">
                      PostEx: {summary?.postex_orders || 0}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 rounded-full">
                      Leopard: {summary?.leopard_orders || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="data-card card-hover">
                <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                  <CardTitle className="flex items-center text-lg">
                    <Truck className="mr-2 h-4 w-4 text-cod-blue" />
                    PostEx Success
                  </CardTitle>
                  <CardDescription>Current delivery rate</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold">
                    {courierStats.postex?.successRate || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {courierStats.postex?.totalOrders || 0} total orders
                  </p>
                </CardContent>
              </Card>
              
              <Card className="data-card card-hover">
                <CardHeader className="pb-2 bg-gradient-to-br from-cod-dark to-cod-charcoal">
                  <CardTitle className="flex items-center text-lg">
                    <Truck className="mr-2 h-4 w-4 text-cod-purple" />
                    Leopard Success
                  </CardTitle>
                  <CardDescription>Current delivery rate</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-3xl font-bold">
                    {courierStats.leopard?.successRate || 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {courierStats.leopard?.totalOrders || 0} total orders
                  </p>
                </CardContent>
              </Card>
            </div>
                        
            <Card className="data-card">
              <CardHeader className="bg-gradient-to-r from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-cod-orange" />
                  Current Deliveries
                </CardTitle>
                <CardDescription>
                  Live delivery data from MongoDB showing courier assignments and status
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="all">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="glass-morphism border border-white/10 rounded-full shadow-lg">
                      <TabsTrigger value="all" className="rounded-full">All Orders</TabsTrigger>
                      <TabsTrigger value="postex" className="rounded-full">PostEx</TabsTrigger>
                      <TabsTrigger value="leopard" className="rounded-full">Leopard</TabsTrigger>
                    </TabsList>
                    <Button variant="outline" className="bg-white/5 border-white/10">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tracking ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Assigned Courier</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveries.map((delivery) => (
                            <TableRow key={delivery.id}>
                              <TableCell className="font-medium font-mono text-xs">{delivery.tracking}</TableCell>
                              <TableCell>
                                <div>{delivery.customer_name}</div>
                                <div className="text-xs text-muted-foreground">{delivery.customer_phone}</div>
                              </TableCell>
                              <TableCell>{delivery.city}</TableCell>
                              <TableCell>{delivery.value}</TableCell>
                              <TableCell>{delivery.date}</TableCell>
                              <TableCell>
                                <Badge variant={getCourierBadgeVariant(delivery.assignedCourier)}>
                                  {getCourierName(delivery.assignedCourier)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge variant={getStatusBadgeVariant(delivery.status)}>
                                  {formatStatus(delivery.status)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="postex" className="mt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tracking ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveries
                            .filter(delivery => delivery.assignedCourier === "postex")
                            .map((delivery) => (
                              <TableRow key={delivery.id}>
                                <TableCell className="font-medium font-mono text-xs">{delivery.tracking}</TableCell>
                                <TableCell>
                                  <div>{delivery.customer_name}</div>
                                  <div className="text-xs text-muted-foreground">{delivery.customer_phone}</div>
                                </TableCell>
                                <TableCell>{delivery.city}</TableCell>
                                <TableCell>{delivery.value}</TableCell>
                                <TableCell>{delivery.date}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={getStatusBadgeVariant(delivery.status)}>
                                    {formatStatus(delivery.status)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="leopard" className="mt-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tracking ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveries
                            .filter(delivery => delivery.assignedCourier === "leopard")
                            .map((delivery) => (
                              <TableRow key={delivery.id}>
                                <TableCell className="font-medium font-mono text-xs">{delivery.tracking}</TableCell>
                                <TableCell>
                                  <div>{delivery.customer_name}</div>
                                  <div className="text-xs text-muted-foreground">{delivery.customer_phone}</div>
                                </TableCell>
                                <TableCell>{delivery.city}</TableCell>
                                <TableCell>{delivery.value}</TableCell>
                                <TableCell>{delivery.date}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={getStatusBadgeVariant(delivery.status)}>
                                    {formatStatus(delivery.status)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="data-card">
              <CardHeader className="bg-gradient-to-r from-cod-dark to-cod-charcoal">
                <CardTitle className="flex items-center">
                  <Map className="mr-2 h-5 w-5 text-cod-blue" />
                  City-wise Courier Performance
                </CardTitle>
                <CardDescription>
                  Analysis of courier performance by city based on delivery success rates
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-400/5 border border-blue-500/20 text-sm mb-6 shadow-lg">
                  <p className="text-muted-foreground">
                    Real-time data from MongoDB showing actual delivery success rates for PostEx and Leopard 
                    across different cities to help optimize courier selection.
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>PostEx Success Rate</TableHead>
                        <TableHead>Leopard Success Rate</TableHead>
                        <TableHead className="text-right">Recommended Courier</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cityStats.map((city) => (
                        <TableRow key={city.city}>
                          <TableCell className="font-medium">{city.city}</TableCell>
                          <TableCell>
                            <span className={`font-semibold ${city.postexRate > city.leopardRate ? "text-green-400" : ""}`}>
                              {city.postexRate}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${city.leopardRate > city.postexRate ? "text-green-400" : ""}`}>
                              {city.leopardRate}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {city.postexRate > city.leopardRate ? (
                              <Badge variant="info">PostEx</Badge>
                            ) : city.leopardRate > city.postexRate ? (
                              <Badge variant="purple">Leopard</Badge>
                            ) : (
                              <Badge variant="warning">Equal</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
