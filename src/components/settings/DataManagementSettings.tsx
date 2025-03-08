
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

export function DataManagementSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Manage your data and privacy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Data Export</h4>
          <p className="text-sm text-muted-foreground">
            Download a copy of all your data from AgriBuddy
          </p>
          <Button variant="outline">Export All Data</Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Clear Data</h4>
          <p className="text-sm text-muted-foreground">
            Clear specific data from your account
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">Clear Chat History</Button>
            <Button variant="outline">Reset Preferences</Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data
          </p>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
