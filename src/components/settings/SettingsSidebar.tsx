
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Languages, MapPin, User } from "lucide-react";

export function SettingsSidebar() {
  return (
    <Card className="md:w-[200px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account settings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <TabsList className="flex flex-col w-full rounded-none h-auto">
          <TabsTrigger value="profile" className="justify-start py-2 px-4 rounded-none data-[state=active]:bg-muted">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="farm" className="justify-start py-2 px-4 rounded-none data-[state=active]:bg-muted">
            <MapPin className="h-4 w-4 mr-2" />
            Farm Details
          </TabsTrigger>
          <TabsTrigger value="preferences" className="justify-start py-2 px-4 rounded-none data-[state=active]:bg-muted">
            <Languages className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="data" className="justify-start py-2 px-4 rounded-none data-[state=active]:bg-muted">
            <FileText className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
        </TabsList>
      </CardContent>
    </Card>
  );
}
