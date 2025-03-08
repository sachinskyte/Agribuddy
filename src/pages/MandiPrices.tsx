
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, TrendingUp, TrendingDown, Search, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for crop prices
const cropPriceData = [
  { name: 'Jan', wheat: 2100, rice: 3600, cotton: 6000 },
  { name: 'Feb', wheat: 2000, rice: 3500, cotton: 5800 },
  { name: 'Mar', wheat: 2200, rice: 3700, cotton: 6200 },
  { name: 'Apr', wheat: 2300, rice: 3800, cotton: 6100 },
  { name: 'May', wheat: 2100, rice: 3600, cotton: 5900 },
  { name: 'Jun', wheat: 2000, rice: 3500, cotton: 5700 },
];

// Mock data for nearby mandis
const nearbyMandis = [
  { id: 1, name: 'Azadpur Mandi', distance: '5km', wheat: 2100, rice: 3600, cotton: 6000, trend: 'up' },
  { id: 2, name: 'Ghazipur Mandi', distance: '12km', wheat: 2050, rice: 3580, cotton: 5950, trend: 'down' },
  { id: 3, name: 'Okhla Mandi', distance: '15km', wheat: 2150, rice: 3620, cotton: 6050, trend: 'up' },
];

const MandiPrices = () => {
  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Mandi Prices</h2>
          <div className="flex items-center">
            <Badge className="bg-agribuddy-primary text-white">Updated: Today at 2:30 PM</Badge>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Search Mandi Prices</CardTitle>
              <CardDescription>
                Find current crop prices by location or crop type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Select defaultValue="wheat">
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="delhi">
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi NCR</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="haryana">Haryana</SelectItem>
                      <SelectItem value="up">Uttar Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Search by mandi name" />
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wheat Price
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-agribuddy-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,100/quintal</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+5% from last week</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rice Price
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-agribuddy-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹3,600/quintal</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">+2% from last week</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cotton Price
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-agribuddy-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹6,000/quintal</div>
              <div className="flex items-center pt-1">
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600">-1% from last week</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="trends" className="w-full">
          <TabsList>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="nearby">Nearby Mandis</TabsTrigger>
          </TabsList>
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Crop Price Trends (₹/quintal)</CardTitle>
                <CardDescription>
                  Compare prices across different crops over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={cropPriceData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="wheat" stroke="#2E7D32" />
                      <Line type="monotone" dataKey="rice" stroke="#1565C0" />
                      <Line type="monotone" dataKey="cotton" stroke="#FFC107" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nearby">
            <Card>
              <CardHeader>
                <CardTitle>Nearby Mandis</CardTitle>
                <CardDescription>
                  Find prices at mandis closest to your location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mandi Name</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Wheat (₹/qtl)</TableHead>
                      <TableHead>Rice (₹/qtl)</TableHead>
                      <TableHead>Cotton (₹/qtl)</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nearbyMandis.map((mandi) => (
                      <TableRow key={mandi.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-agribuddy-primary" />
                            {mandi.name}
                          </div>
                        </TableCell>
                        <TableCell>{mandi.distance}</TableCell>
                        <TableCell>₹{mandi.wheat}</TableCell>
                        <TableCell>₹{mandi.rice}</TableCell>
                        <TableCell>₹{mandi.cotton}</TableCell>
                        <TableCell>
                          {mandi.trend === 'up' ? (
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Rising
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <TrendingDown className="h-4 w-4 mr-1" />
                              Falling
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Load More Mandis</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default MandiPrices;
