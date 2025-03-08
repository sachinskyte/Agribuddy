
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { StepProps } from "./types";

export function PersonalInfoStep({ data, updateData }: StepProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full-name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Your Full Name
          </Label>
          <Input 
            id="full-name" 
            placeholder="Enter your full name" 
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
          />
        </div>
      </div>
    </CardContent>
  );
}
