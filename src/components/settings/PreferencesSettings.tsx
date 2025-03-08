
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function PreferencesSettings({ onSave }: { onSave: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nearby-mandis">Default Mandi Range (in KM)</Label>
          <Input id="nearby-mandis" type="number" defaultValue="25" />
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Application Settings</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Enable Push Notifications</Label>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-updates">Email Updates</Label>
            <Switch id="email-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-refresh">Auto-refresh Weather Data</Label>
            <Switch id="auto-refresh" defaultChecked />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave}>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
