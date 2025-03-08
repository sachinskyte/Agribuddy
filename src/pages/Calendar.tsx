
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Plus, Calendar as CalendarIcon, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Define the task type
interface FarmingTask {
  id: number;
  title: string;
  date: Date;
  type: string;
  status: string;
  location: string;
  notes: string;
}

// Define the crop season type
interface SeasonalCrop {
  crop: string;
  season: string;
  sowingPeriod: string;
  harvestPeriod: string;
}

// Mock data for suitable crops based on season
const seasonalCrops: SeasonalCrop[] = [
  { crop: "Wheat", season: "Rabi", sowingPeriod: "October-November", harvestPeriod: "April-May" },
  { crop: "Rice", season: "Kharif", sowingPeriod: "June-July", harvestPeriod: "November-December" },
  { crop: "Mustard", season: "Rabi", sowingPeriod: "October-November", harvestPeriod: "February-March" },
  { crop: "Cotton", season: "Kharif", sowingPeriod: "April-May", harvestPeriod: "October-November" },
  { crop: "Gram", season: "Rabi", sowingPeriod: "October-November", harvestPeriod: "March-April" },
];

const taskTypeColors: Record<string, string> = {
  "Fertilizing": "bg-green-100 text-green-800",
  "Irrigation": "bg-blue-100 text-blue-800",
  "Pest Control": "bg-red-100 text-red-800",
  "Harvesting": "bg-amber-100 text-amber-800",
  "Planting": "bg-purple-100 text-purple-800",
};

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [farmingTasks, setFarmingTasks] = useState<FarmingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "",
    location: "",
    notes: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();
  
  // Determine current season based on date
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    
    // In India, Kharif is roughly June to October, Rabi is October to March
    if (month >= 6 && month <= 10) {
      return "Kharif (June-October)";
    } else if (month >= 10 || month <= 3) {
      return "Rabi (October-March)";
    } else {
      return "Zaid (March-June)";
    }
  };
  
  // Load demo tasks on first render
  useEffect(() => {
    // In a real app, these would come from a database
    // For now, we'll use mock data with dates relative to current date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    const demoTasks: FarmingTask[] = [
      {
        id: 1,
        title: "Apply Fertilizer to Wheat Field",
        date: tomorrow,
        type: "Fertilizing",
        status: "upcoming",
        location: "North Field",
        notes: "Use NPK 20-20-20 fertilizer, 200kg/hectare",
      },
      {
        id: 2,
        title: "Irrigate Rice Paddies",
        date: new Date(today.setDate(today.getDate() + 3)),
        type: "Irrigation",
        status: "upcoming",
        location: "East Field",
        notes: "Ensure water level is 5cm above soil",
      },
      {
        id: 3,
        title: "Pesticide Application",
        date: nextWeek,
        type: "Pest Control",
        status: "upcoming",
        location: "South Field",
        notes: "Use organic neem-based pesticide",
      },
      {
        id: 4,
        title: "Harvest Wheat",
        date: twoWeeksFromNow,
        type: "Harvesting",
        status: "upcoming",
        location: "North Field",
        notes: "Arrange for combine harvester rental",
      },
    ];
    
    // Get the user's crops from profile to customize tasks
    const fetchUserCrops = async () => {
      if (!session?.user.id) {
        setFarmingTasks(demoTasks);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("crops, location")
          .eq("id", session.user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data?.crops && data.crops.length > 0) {
          // Customize some tasks based on user's crops
          const customizedTasks = [...demoTasks];
          
          if (data.crops.includes("rice")) {
            customizedTasks.push({
              id: 5,
              title: "Rice Seedling Transplantation",
              date: new Date(today.setDate(today.getDate() + 5)),
              type: "Planting",
              status: "upcoming",
              location: data.location ? data.location.split(',')[0] : "Main Field",
              notes: "Prepare paddy field one day before transplantation",
            });
          }
          
          if (data.crops.includes("wheat")) {
            customizedTasks.push({
              id: 6,
              title: "Wheat Field Preparation",
              date: new Date(today.setDate(today.getDate() + 10)),
              type: "Planting",
              status: "upcoming",
              location: data.location ? data.location.split(',')[0] : "West Field",
              notes: "Till soil and add base fertilizer",
            });
          }
          
          setFarmingTasks(customizedTasks);
        } else {
          setFarmingTasks(demoTasks);
        }
      } catch (error) {
        console.error("Error fetching user crops:", error);
        setFarmingTasks(demoTasks);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCrops();
  }, [session]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [id.replace('task-', '')]: value
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewTask(prev => ({
      ...prev,
      type: value
    }));
  };
  
  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Missing title",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    
    if (!newTask.date) {
      toast({
        title: "Missing date",
        description: "Please select a task date",
        variant: "destructive",
      });
      return;
    }
    
    if (!newTask.type) {
      toast({
        title: "Missing task type",
        description: "Please select a task type",
        variant: "destructive",
      });
      return;
    }
    
    const newTaskObj: FarmingTask = {
      id: Date.now(), // Use timestamp as id
      title: newTask.title,
      date: new Date(newTask.date),
      type: newTask.type,
      status: "upcoming",
      location: newTask.location || "Main Field",
      notes: newTask.notes || ""
    };
    
    setFarmingTasks(prev => [...prev, newTaskObj]);
    
    // Reset form
    setNewTask({
      title: "",
      date: new Date().toISOString().split("T")[0],
      type: "",
      location: "",
      notes: ""
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Task added",
      description: "Your farming task has been added to the calendar",
    });
  };
  
  // Filter tasks for the selected date
  const getTasksForSelectedDate = () => {
    if (!date) return [];
    
    return farmingTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === date.toDateString();
    });
  };
  
  // Get next upcoming task
  const getNextTask = () => {
    const today = new Date();
    const upcoming = farmingTasks
      .filter(task => new Date(task.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  const nextTask = getNextTask();
  const daysUntilNextTask = nextTask 
    ? Math.ceil((new Date(nextTask.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Farming Calendar</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Farming Task</DialogTitle>
                <DialogDescription>
                  Create a new task for your farming calendar. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-title" className="text-right">
                    Title
                  </Label>
                  <Input 
                    id="task-title" 
                    className="col-span-3" 
                    value={newTask.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-date" className="text-right">
                    Date
                  </Label>
                  <Input 
                    id="task-date" 
                    type="date" 
                    className="col-span-3" 
                    value={newTask.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-type" className="text-right">
                    Type
                  </Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fertilizing">Fertilizing</SelectItem>
                      <SelectItem value="Irrigation">Irrigation</SelectItem>
                      <SelectItem value="Pest Control">Pest Control</SelectItem>
                      <SelectItem value="Harvesting">Harvesting</SelectItem>
                      <SelectItem value="Planting">Planting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-location" className="text-right">
                    Location
                  </Label>
                  <Input 
                    id="task-location" 
                    className="col-span-3" 
                    value={newTask.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea 
                    id="task-notes" 
                    className="col-span-3" 
                    value={newTask.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddTask}>Save Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-agribuddy-primary" />
            <span className="ml-2">Loading calendar data...</span>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-12">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Select a date to view or add tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                />
                
                {date && getTasksForSelectedDate().length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Tasks on {date.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</h4>
                    <ul className="space-y-2">
                      {getTasksForSelectedDate().map(task => (
                        <li key={task.id} className="text-sm">
                          <Badge className={taskTypeColors[task.type] || ""} variant="outline">
                            {task.type}
                          </Badge>
                          <span className="ml-2">{task.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-8">
              <Tabs defaultValue="tasks">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Farming Schedule</CardTitle>
                    <TabsList>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                      <TabsTrigger value="seasonal">Seasonal Guide</TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>
                    Manage your upcoming farming activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TabsContent value="tasks" className="m-0">
                    {farmingTasks.length > 0 && nextTask && (
                      <Alert className="mb-4 bg-amber-50 border-amber-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800">Plan ahead!</AlertTitle>
                        <AlertDescription className="text-amber-700">
                          You have {farmingTasks.length} upcoming farming {farmingTasks.length === 1 ? 'task' : 'tasks'}. 
                          The next task is {daysUntilNextTask === 0 ? 'today' : 
                            daysUntilNextTask === 1 ? 'tomorrow' : 
                            `in ${daysUntilNextTask} days`}.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <ScrollArea className="h-[280px]">
                      <div className="space-y-4">
                        {farmingTasks.length > 0 ? (
                          farmingTasks.map((task) => (
                            <div key={task.id} className="flex p-3 border rounded-lg">
                              <div className="mr-4 mt-1">
                                <CheckCircle2 className="h-5 w-5 text-gray-300" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Badge className={taskTypeColors[task.type] || ""}>
                                    {task.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {new Date(task.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </div>
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Location:</span> {task.location}
                                </p>
                                <p className="text-sm mt-1">
                                  <span className="font-medium">Notes:</span> {task.notes}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No tasks scheduled yet. Click "Add Task" to create your first task.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="seasonal" className="m-0">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Current Season: {getCurrentSeason()}</h3>
                      <p className="text-muted-foreground">
                        {getCurrentSeason().includes("Rabi") 
                          ? "The Rabi season is ideal for wheat, barley, mustard, and other cool-season crops."
                          : getCurrentSeason().includes("Kharif")
                            ? "The Kharif season is best for rice, maize, cotton, and other warm-season crops."
                            : "The Zaid season is good for short-duration crops like cucumber, watermelon, and vegetables."}
                      </p>
                    </div>
                    
                    <ScrollArea className="h-[280px]">
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left p-3 font-medium">Crop</th>
                                <th className="text-left p-3 font-medium">Season</th>
                                <th className="text-left p-3 font-medium">Sowing Period</th>
                                <th className="text-left p-3 font-medium">Harvest Period</th>
                              </tr>
                            </thead>
                            <tbody>
                              {seasonalCrops.map((crop, index) => (
                                <tr key={index} className="border-t">
                                  <td className="p-3 font-medium">{crop.crop}</td>
                                  <td className="p-3">{crop.season}</td>
                                  <td className="p-3">{crop.sowingPeriod}</td>
                                  <td className="p-3">{crop.harvestPeriod}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
                    Add New Task
                  </Button>
                </CardFooter>
              </Tabs>
            </Card>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Calendar;
