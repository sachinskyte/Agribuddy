
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import { PersonalInfoStep } from "./PersonalInfoStep";
import { ContactStep } from "./ContactStep";
import { LocationStep } from "./LocationStep";
import { FarmSizeStep } from "./FarmSizeStep";
import { CropsStep } from "./CropsStep";
import { StepNavigation } from "./StepNavigation";
import { OnboardingFormData } from "./types";

// Create a new component for Farm Name input
const FarmNameStep = ({ data, updateData }: { 
  data: OnboardingFormData; 
  updateData: (data: Partial<OnboardingFormData>) => void 
}) => {
  return (
    <div className="px-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="farm-name" className="block text-sm font-medium">
            Farm Name
          </label>
          <input
            id="farm-name"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your farm name"
            value={data.farmName}
            onChange={(e) => updateData({ farmName: e.target.value })}
            required
          />
          <p className="text-xs text-muted-foreground">
            This name will identify your farm in our system
          </p>
        </div>
      </div>
    </div>
  );
};

export function AccountSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(6); // Increased by 1 for Farm Name step
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: "",
    phoneNumber: "",
    postalCode: "",
    state: "haryana",
    district: "sonipat",
    village: "",
    farmSize: "",
    selectedCrops: [],
    farmName: ""
  });

  const updateFormData = (newData: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    // Check if user already has a profile
    const fetchUserData = async () => {
      if (!session?.user.id) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("location, crops, farm_name")
          .eq("id", session.user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        // Get user metadata from auth
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData.user) {
          const metadata = userData.user.user_metadata;
          if (metadata) {
            updateFormData({
              fullName: metadata.full_name || "",
              phoneNumber: metadata.phone_number || "",
              postalCode: metadata.postal_code || "",
              farmSize: metadata.farm_size || ""
            });
          }
        }
        
        if (data) {
          // If farm_name exists, set it
          if (data.farm_name) {
            updateFormData({ farmName: data.farm_name });
          }
          
          // If location exists, try to parse it
          if (data.location) {
            const parts = data.location.split(',').map(part => part.trim());
            if (parts.length >= 3) {
              const village = parts[0]; // First part is village/town
              
              // Second to last part would be district
              const districtFromLocation = parts[parts.length - 2].toLowerCase();
              let district = 'sonipat';
              if (districtFromLocation.includes('sonipat')) district = 'sonipat';
              else if (districtFromLocation.includes('karnal')) district = 'karnal';
              else if (districtFromLocation.includes('panipat')) district = 'panipat';
              else if (districtFromLocation.includes('hisar')) district = 'hisar';
              
              // Last part would be state
              const stateFromLocation = parts[parts.length - 1].toLowerCase();
              let state = 'haryana';
              if (stateFromLocation.includes('haryana')) state = 'haryana';
              else if (stateFromLocation.includes('punjab')) state = 'punjab';
              else if (stateFromLocation.includes('uttar pradesh') || stateFromLocation.includes('up')) state = 'up';
              else if (stateFromLocation.includes('rajasthan')) state = 'rajasthan';

              updateFormData({ village, district, state });
            } else {
              updateFormData({ village: data.location });
            }
          }
          
          // If crops exist, set them
          if (data.crops) {
            updateFormData({ selectedCrops: data.crops });
          }
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };
    
    fetchUserData();
  }, [session]);

  const goToNextStep = () => {
    // Validation per step
    if (currentStep === 1 && !formData.fullName) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && !formData.phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 3 && !formData.postalCode && !formData.village) {
      toast({
        title: "Location required",
        description: "Please enter either your postal code or village/town.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 4 && !formData.farmName) {
      toast({
        title: "Farm name required",
        description: "Please enter a name for your farm.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 5 && !formData.farmSize) {
      toast({
        title: "Farm size required",
        description: "Please enter your farm size in acres.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user.id) {
      toast({
        title: "Authentication error",
        description: "Please log in to complete your profile.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (formData.selectedCrops.length === 0) {
      toast({
        title: "Crops required",
        description: "Please select at least one crop you grow.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Construct full location from components
      const districtName = formData.district === 'sonipat' ? 'Sonipat' : 
                          formData.district === 'karnal' ? 'Karnal' : 
                          formData.district === 'panipat' ? 'Panipat' : 'Hisar';
                          
      const stateName = formData.state === 'haryana' ? 'Haryana' : 
                        formData.state === 'punjab' ? 'Punjab' : 
                        formData.state === 'up' ? 'Uttar Pradesh' : 'Rajasthan';
                        
      const location = `${formData.village.trim()}, ${districtName}, ${stateName}`;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          location,
          crops: formData.selectedCrops,
          farm_name: formData.farmName,
          updated_at: new Date().toISOString()
        })
        .eq("id", session.user.id);
      
      if (error) throw error;
      
      // Store full name and phone number in Supabase auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { 
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          postal_code: formData.postalCode,
          farm_size: formData.farmSize
        }
      });
      
      if (metadataError) throw metadataError;
      
      toast({
        title: "Profile updated",
        description: "Your farming profile has been saved.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={formData} updateData={updateFormData} />;
      case 2:
        return <ContactStep data={formData} updateData={updateFormData} />;
      case 3:
        return <LocationStep data={formData} updateData={updateFormData} />;
      case 4:
        return <FarmNameStep data={formData} updateData={updateFormData} />;
      case 5:
        return <FarmSizeStep data={formData} updateData={updateFormData} />;
      case 6:
        return <CropsStep data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="p-4 sm:p-6 md:p-8 w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? "Personal Information" : 
                currentStep === 2 ? "Contact Details" : 
                currentStep === 3 ? "Location" : 
                currentStep === 4 ? "Farm Name" :
                currentStep === 5 ? "Farm Size" : "Crops"
              }
            </CardDescription>
          </CardHeader>
          
          {renderCurrentStep()}
          
          <StepNavigation 
            currentStep={currentStep}
            totalSteps={totalSteps}
            goToPrevious={goToPreviousStep}
            goToNext={goToNextStep}
            isSubmitting={loading}
            isFinalStep={currentStep === totalSteps}
          />
        </Card>
      </div>
    </div>
  );
}
