
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wheat } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { StepProps } from "./types";
import { useState } from "react";

// Common crops in India
const commonCrops = [
  { id: "wheat", label: "Wheat" },
  { id: "rice", label: "Rice" },
  { id: "cotton", label: "Cotton" },
  { id: "sugarcane", label: "Sugarcane" },
  { id: "maize", label: "Maize" },
  { id: "pulses", label: "Pulses" },
  { id: "oilseeds", label: "Oilseeds" },
  { id: "vegetables", label: "Vegetables" },
];

export function CropsStep({ data, updateData }: StepProps) {
  const [customCrop, setCustomCrop] = useState("");

  const handleCropToggle = (cropId: string) => {
    const updatedCrops = data.selectedCrops.includes(cropId)
      ? data.selectedCrops.filter(id => id !== cropId)
      : [...data.selectedCrops, cropId];
    
    updateData({ selectedCrops: updatedCrops });
  };

  const addCustomCrop = () => {
    if (customCrop.trim() && !data.selectedCrops.includes(customCrop.trim().toLowerCase())) {
      updateData({ 
        selectedCrops: [...data.selectedCrops, customCrop.trim().toLowerCase()]
      });
      setCustomCrop("");
    }
  };

  return (
    <CardContent>
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Wheat className="h-4 w-4" />
          Crops You Grow
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {commonCrops.map((crop) => (
            <div key={crop.id} className="flex items-center space-x-2">
              <Checkbox 
                id={crop.id} 
                checked={data.selectedCrops.includes(crop.id)}
                onCheckedChange={() => handleCropToggle(crop.id)}
              />
              <Label htmlFor={crop.id} className="cursor-pointer">
                {crop.label}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="pt-2 space-y-2">
          <Label htmlFor="custom-crop">Add Other Crops</Label>
          <div className="flex space-x-2">
            <Input 
              id="custom-crop" 
              placeholder="Enter crop name" 
              value={customCrop}
              onChange={(e) => setCustomCrop(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomCrop();
                }
              }}
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addCustomCrop}
            >
              Add
            </Button>
          </div>
        </div>
        
        {data.selectedCrops.filter(crop => !commonCrops.map(c => c.id).includes(crop)).length > 0 && (
          <div className="pt-2">
            <Label>Your Custom Crops:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.selectedCrops
                .filter(crop => !commonCrops.map(c => c.id).includes(crop))
                .map(crop => (
                  <div 
                    key={crop} 
                    className="bg-muted px-3 py-1 rounded-full flex items-center"
                  >
                    <span className="mr-1 capitalize">{crop}</span>
                    <button 
                      onClick={() => handleCropToggle(crop)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
}
