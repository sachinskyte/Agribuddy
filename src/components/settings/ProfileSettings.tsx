
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ProfileSettings({ onSave }: { onSave: () => void }) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user.id) return;
      
      try {
        setLoading(true);
        // Get user metadata
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData.user) {
          setEmail(userData.user.email || "");
          
          // Get metadata
          const metadata = userData.user.user_metadata;
          if (metadata) {
            setFullName(metadata.full_name || "");
            setPhoneNumber(metadata.phone_number || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [session, toast]);
  
  const handleProfileSave = async () => {
    if (!session?.user.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update your profile.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          phone_number: phoneNumber 
        }
      });
      
      if (error) throw error;
      
      // If password fields are filled, update password
      if (currentPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords don't match");
        }
        
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (passwordError) throw passwordError;
        
        // Clear password fields after successful update
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
      
      onSave();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input 
              id="full-name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            readOnly
          />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input 
            id="current-password" 
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleProfileSave} 
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
}
