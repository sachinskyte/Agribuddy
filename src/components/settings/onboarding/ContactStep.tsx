
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { StepProps } from "./types";

export function ContactStep({ data, updateData }: StepProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone-number" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Your Phone Number
          </Label>
          <Input 
            id="phone-number" 
            placeholder="+91 98765 43210" 
            value={data.phoneNumber}
            onChange={(e) => updateData({ phoneNumber: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            We'll use this to send you important alerts
          </p>
        </div>
      </div>
    </CardContent>
  );
}
