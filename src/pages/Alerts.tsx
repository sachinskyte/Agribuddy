
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Cloud, Bell, Calendar, IndianRupee, FileText, CheckCircle2, X } from "lucide-react";

// Mock data for alerts and notifications
const notifications = [
  {
    id: 1,
    title: "Heavy Rainfall Alert",
    message: "Heavy rainfall (5-7cm) expected in your area in the next 24-48 hours. Please take necessary precautions to protect crops.",
    type: "weather",
    priority: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: 2,
    title: "Wheat Price Update",
    message: "Wheat prices have increased by 5% at Azadpur Mandi. Current rate: ₹2,100/quintal.",
    type: "mandi",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
  },
  {
    id: 3,
    title: "Upcoming Task: Fertilizer Application",
    message: "Reminder: Apply fertilizer to wheat field (North) tomorrow as per your farming calendar.",
    type: "calendar",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: false,
  },
  {
    id: 4,
    title: "New Government Scheme",
    message: "New crop insurance scheme announced by the government. Check the Government Schemes section for details.",
    type: "scheme",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
  {
    id: 5,
    title: "Temperature Alert",
    message: "Unusually high temperatures expected next week. Consider adjusting irrigation schedule for cotton fields.",
    type: "weather",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
    read: true,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "weather":
      return <Cloud className="h-5 w-5 text-blue-500" />;
    case "mandi":
      return <IndianRupee className="h-5 w-5 text-green-500" />;
    case "calendar":
      return <Calendar className="h-5 w-5 text-purple-500" />;
    case "scheme":
      return <FileText className="h-5 w-5 text-amber-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
    case "medium":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
    case "low":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge>;
    default:
      return null;
  }
};

const Alerts = () => {
  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Notifications & Alerts</h2>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <Tabs defaultValue="all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Notifications</CardTitle>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>
                  Stay updated with important alerts and information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : 'bg-muted/30'}`}
                      >
                        <div className="flex items-start">
                          <div className="mr-4 mt-0.5">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${notification.read ? '' : 'text-agribuddy-primary'}`}>
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority)}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp.toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Load More Notifications
                </Button>
              </CardFooter>
            </Tabs>
          </Card>
          
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Customize how you receive alerts
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Alert Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-blue-500" />
                      <Label htmlFor="weather-alerts">Weather Alerts</Label>
                    </div>
                    <Switch id="weather-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-green-500" />
                      <Label htmlFor="price-alerts">Price Updates</Label>
                    </div>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <Label htmlFor="calendar-alerts">Calendar Reminders</Label>
                    </div>
                    <Switch id="calendar-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-500" />
                      <Label htmlFor="scheme-alerts">Government Schemes</Label>
                    </div>
                    <Switch id="scheme-alerts" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Notification Methods</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-notifications">In-App Notifications</Label>
                    <Switch id="app-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full">Save Preferences</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
};

export default Alerts;
