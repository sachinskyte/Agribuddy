
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { 
  ProfileSettings, 
  FarmSettings, 
  PreferencesSettings, 
  DataManagementSettings,
  SettingsSidebar
} from "@/components/settings";

const Settings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate a delay to show loading state
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully saved.",
      });
    }, 800);
  };

  // Handle saving for each individual tab
  const handleTabSave = () => {
    toast({
      title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved`,
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
        
        <Tabs 
          defaultValue="profile" 
          value={activeTab} 
          onValueChange={setActiveTab}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <SettingsSidebar />
            
            <div className="flex-1">
              <TabsContent value="profile" className="m-0">
                <ProfileSettings onSave={handleTabSave} />
              </TabsContent>
              
              <TabsContent value="farm" className="m-0">
                <FarmSettings onSave={handleTabSave} />
              </TabsContent>
              
              <TabsContent value="preferences" className="m-0">
                <PreferencesSettings onSave={handleTabSave} />
              </TabsContent>
              
              <TabsContent value="data" className="m-0">
                <DataManagementSettings />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Settings;
