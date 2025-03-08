
import { useEffect, useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { session } = useAuth();
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({
    current: {
      temp: 32,
      feels_like: 35,
      humidity: 65,
      wind_speed: 15,
      wind_direction: "North East",
      description: "Partly Cloudy",
      rain_chance: 25
    },
    alert: {
      title: "Weather Alert",
      description: "Heavy rainfall expected in your area in the next 24 hours. Consider delaying outdoor activities."
    }
  });

  // Mock data for weekly weather (would be replaced with actual API data)
  const [weeklyWeatherData, setWeeklyWeatherData] = useState([
    { name: 'Mon', temp: 32, humidity: 65 },
    { name: 'Tue', temp: 30, humidity: 60 },
    { name: 'Wed', temp: 34, humidity: 45 },
    { name: 'Thu', temp: 31, humidity: 80 },
    { name: 'Fri', temp: 29, humidity: 70 },
    { name: 'Sat', temp: 28, humidity: 55 },
    { name: 'Sun', temp: 33, humidity: 50 },
  ]);

  useEffect(() => {
    const fetchFarmLocation = async () => {
      if (!session?.user.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("location")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data?.location) {
          setLocation(data.location);
          
          // In a real app, we would call a weather API here with the location
          // For this demo, we'll just simulate different weather based on the location
          simulateWeatherForLocation(data.location);
        }
      } catch (error) {
        console.error("Error fetching farm location:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFarmLocation();
  }, [session]);
  
  // Simulate different weather based on location (in a real app, this would be an API call)
  const simulateWeatherForLocation = (location: string) => {
    const lowercaseLocation = location.toLowerCase();
    
    // Generate somewhat realistic temperature and humidity variations based on location
    const baseTemp = Math.floor(Math.random() * 10) + 25; // Random base temp between 25-34°C
    const baseHumidity = Math.floor(Math.random() * 30) + 50; // Random humidity between 50-79%
    
    let weatherDescription = "Partly Cloudy";
    let rainChance = 25;
    let alertTitle = "Weather Alert";
    let alertDescription = "Heavy rainfall expected in your area in the next 24 hours. Consider delaying outdoor activities.";
    
    // Customize based on state/district
    if (lowercaseLocation.includes("haryana")) {
      if (lowercaseLocation.includes("sonipat")) {
        weatherDescription = "Clear Sky";
        rainChance = 5;
        alertTitle = "Heat Alert";
        alertDescription = "High temperatures expected in Sonipat area. Ensure proper hydration for crops.";
      } else if (lowercaseLocation.includes("karnal")) {
        weatherDescription = "Light Rain";
        rainChance = 40;
      }
    } else if (lowercaseLocation.includes("punjab")) {
      weatherDescription = "Overcast";
      rainChance = 30;
      alertTitle = "Wind Alert";
      alertDescription = "Strong winds expected in Punjab region. Secure any loose farm equipment.";
    } else if (lowercaseLocation.includes("uttar pradesh") || lowercaseLocation.includes("up")) {
      weatherDescription = "Thunderstorms";
      rainChance = 70;
    }
    
    // Build weekly data with some randomization
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const newWeeklyData = weekdays.map(day => {
      const tempVariation = Math.floor(Math.random() * 8) - 4; // -4 to +4 degrees variation
      const humidityVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10% variation
      
      return {
        name: day,
        temp: baseTemp + tempVariation,
        humidity: Math.min(Math.max(baseHumidity + humidityVariation, 30), 90) // Keep between 30-90%
      };
    });
    
    setWeeklyWeatherData(newWeeklyData);
    setWeather({
      current: {
        temp: baseTemp,
        feels_like: baseTemp + Math.floor(Math.random() * 4),
        humidity: baseHumidity,
        wind_speed: Math.floor(Math.random() * 15) + 5,
        wind_direction: ["North East", "South East", "North West", "South West"][Math.floor(Math.random() * 4)],
        description: weatherDescription,
        rain_chance: rainChance
      },
      alert: {
        title: alertTitle,
        description: alertDescription
      }
    });
  };

  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Weather Dashboard</h2>
          <div className="flex items-center">
            {location && (
              <Badge className="mr-2 bg-gray-100 text-gray-800">
                {location}
              </Badge>
            )}
            <Badge className="bg-agribuddy-primary text-white">Updated: Just now</Badge>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-agribuddy-primary" />
            <span className="ml-2">Loading weather data...</span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Temperature
                  </CardTitle>
                  <Thermometer className="h-4 w-4 text-agribuddy-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.current.temp}°C</div>
                  <p className="text-xs text-muted-foreground">
                    Feels like {weather.current.feels_like}°C
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Humidity
                  </CardTitle>
                  <Droplets className="h-4 w-4 text-agribuddy-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.current.humidity}%</div>
                  <p className="text-xs text-muted-foreground">
                    {weather.current.humidity > 70 ? "High humidity today" : "Moderate humidity"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Wind Speed
                  </CardTitle>
                  <Wind className="h-4 w-4 text-agribuddy-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.current.wind_speed} km/h</div>
                  <p className="text-xs text-muted-foreground">
                    {weather.current.wind_direction}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Forecast
                  </CardTitle>
                  <CloudSun className="h-4 w-4 text-agribuddy-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.current.description}</div>
                  <p className="text-xs text-muted-foreground">
                    {weather.current.rain_chance}% chance of rain
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="bg-amber-50 border-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">{weather.alert.title}</AlertTitle>
              <AlertDescription className="text-amber-700">
                {weather.alert.description}
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="temperature" className="w-full">
              <TabsList>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="humidity">Humidity</TabsTrigger>
              </TabsList>
              <TabsContent value="temperature">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Temperature (°C)</CardTitle>
                    <CardDescription>
                      The average temperature for the week is {Math.round(weeklyWeatherData.reduce((acc, curr) => acc + curr.temp, 0) / weeklyWeatherData.length)}°C
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={weeklyWeatherData}
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
                          <Area type="monotone" dataKey="temp" stroke="#2E7D32" fill="#C8E6C9" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="humidity">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Humidity (%)</CardTitle>
                    <CardDescription>
                      The average humidity for the week is {Math.round(weeklyWeatherData.reduce((acc, curr) => acc + curr.humidity, 0) / weeklyWeatherData.length)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={weeklyWeatherData}
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
                          <Area type="monotone" dataKey="humidity" stroke="#1565C0" fill="#BBDEFB" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Dashboard>
  );
};

export default Index;
