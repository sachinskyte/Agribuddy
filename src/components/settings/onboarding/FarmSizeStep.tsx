
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { StepProps } from "./types";

export function FarmSizeStep({ data, updateData }: StepProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="farm-size" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Total Farm Area (in acres)
          </Label>
          <Input 
            id="farm-size" 
            type="number" 
            placeholder="Enter your farm size" 
            value={data.farmSize}
            onChange={(e) => updateData({ farmSize: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            This helps us provide more accurate recommendations
          </p>
        </div>
      </div>
    </CardContent>
  );
}
