import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Map of Indian PIN code prefixes to states
const pinCodePrefixes: Record<string, { state: string, stateDisplay: string }> = {
  "11": { state: "delhi", stateDisplay: "Delhi" },
  "12": { state: "haryana", stateDisplay: "Haryana" },
  "13": { state: "punjab", stateDisplay: "Punjab" },
  "14": { state: "himachal", stateDisplay: "Himachal Pradesh" },
  "15": { state: "jammu", stateDisplay: "Jammu & Kashmir" },
  "16": { state: "punjab", stateDisplay: "Punjab" },
  "17": { state: "punjab", stateDisplay: "Punjab" },
  "18": { state: "hp", stateDisplay: "Himachal Pradesh" },
  "19": { state: "up", stateDisplay: "Uttar Pradesh" },
  "20": { state: "up", stateDisplay: "Uttar Pradesh" },
  "21": { state: "up", stateDisplay: "Uttar Pradesh" },
  "22": { state: "up", stateDisplay: "Uttar Pradesh" },
  "23": { state: "up", stateDisplay: "Uttar Pradesh" },
  "24": { state: "up", stateDisplay: "Uttar Pradesh" },
  "25": { state: "rajasthan", stateDisplay: "Rajasthan" },
  "26": { state: "rajasthan", stateDisplay: "Rajasthan" },
  "27": { state: "gujarat", stateDisplay: "Gujarat" },
  "28": { state: "gujarat", stateDisplay: "Gujarat" },
  "30": { state: "goa", stateDisplay: "Goa" },
  "31": { state: "maharashtra", stateDisplay: "Maharashtra" },
  "32": { state: "maharashtra", stateDisplay: "Maharashtra" },
  "33": { state: "gujarat", stateDisplay: "Gujarat" },
  "34": { state: "maharashtra", stateDisplay: "Maharashtra" },
  "36": { state: "mp", stateDisplay: "Madhya Pradesh" },
  "37": { state: "mp", stateDisplay: "Madhya Pradesh" },
  "38": { state: "mp", stateDisplay: "Madhya Pradesh" },
  "39": { state: "mp", stateDisplay: "Madhya Pradesh" },
  "40": { state: "chattisgarh", stateDisplay: "Chattisgarh" },
  "41": { state: "chattisgarh", stateDisplay: "Chattisgarh" },
  "42": { state: "andhra", stateDisplay: "Andhra Pradesh" },
  "43": { state: "andhra", stateDisplay: "Andhra Pradesh" },
  "44": { state: "telangana", stateDisplay: "Telangana" },
  "45": { state: "andhra", stateDisplay: "Andhra Pradesh" },
  "46": { state: "kerala", stateDisplay: "Kerala" },
  "47": { state: "kerala", stateDisplay: "Kerala" },
  "48": { state: "tamil", stateDisplay: "Tamil Nadu" },
  "49": { state: "kerela", stateDisplay: "Kerala" },
  "50": { state: "tamil", stateDisplay: "Tamil Nadu" },
  "51": { state: "tamil", stateDisplay: "Tamil Nadu" },
  "52": { state: "karnataka", stateDisplay: "Karnataka" },
  "53": { state: "karnataka", stateDisplay: "Karnataka" },
  "54": { state: "karnataka", stateDisplay: "Karnataka" },
  "55": { state: "karnataka", stateDisplay: "Karnataka" },
  "56": { state: "karnataka", stateDisplay: "Karnataka" },
  "57": { state: "andhra", stateDisplay: "Andhra Pradesh" },
  "58": { state: "karnataka", stateDisplay: "Karnataka" },
  "56": { state: "lakshadweep", stateDisplay: "Lakshadweep Islands" },
  "60": { state: "maharashtra", stateDisplay: "Maharashtra" },
  "70": { state: "wb", stateDisplay: "West Bengal" },
  "71": { state: "wb", stateDisplay: "West Bengal" },
  "72": { state: "wb", stateDisplay: "West Bengal" },
  "73": { state: "wb", stateDisplay: "West Bengal" },
  "74": { state: "orissa", stateDisplay: "Orissa" },
  "75": { state: "orissa", stateDisplay: "Orissa" },
  "76": { state: "orissa", stateDisplay: "Orissa" },
  "77": { state: "orissa", stateDisplay: "Orissa" },
  "78": { state: "assam", stateDisplay: "Assam" },
  "79": { state: "assam", stateDisplay: "Assam" },
  "78": { state: "bihar", stateDisplay: "Bihar" },
  "80": { state: "bihar", stateDisplay: "Bihar" },
  "81": { state: "bihar", stateDisplay: "Bihar" },
  "82": { state: "bihar", stateDisplay: "Bihar" },
  "83": { state: "jharkhand", stateDisplay: "Jharkhand" },
  "84": { state: "jharkhand", stateDisplay: "Jharkhand" },
  "85": { state: "bihar", stateDisplay: "Bihar" },
  "90": { state: "uttarakhand", stateDisplay: "Uttarakhand" },
  "91": { state: "uttarakhand", stateDisplay: "Uttarakhand" },
  "92": { state: "j&k", stateDisplay: "Jammu & Kashmir" },
  "93": { state: "j&k", stateDisplay: "Jammu & Kashmir" },
  "94": { state: "j&k", stateDisplay: "Jammu & Kashmir" },
  "95": { state: "arunachal", stateDisplay: "Arunachal Pradesh" },
  "96": { state: "manipur", stateDisplay: "Manipur" },
  "97": { state: "tripura", stateDisplay: "Tripura" },
  "98": { state: "nagaland", stateDisplay: "Nagaland" },
  "99": { state: "mizoram", stateDisplay: "Mizoram" },
};

// List of Indian states for the dropdown
const indianStates = [
  { value: "andhra", label: "Andhra Pradesh" },
  { value: "arunachal", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chattisgarh", label: "Chattisgarh" },
  { value: "delhi", label: "Delhi" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal", label: "Himachal Pradesh" },
  { value: "j&k", label: "Jammu & Kashmir" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "mp", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "orissa", label: "Orissa" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "up", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "wb", label: "West Bengal" },
];

// Major districts mapped to states for the dropdown
const districtsMap: Record<string, Array<{ value: string, label: string }>> = {
  "haryana": [
    { value: "sonipat", label: "Sonipat" },
    { value: "karnal", label: "Karnal" },
    { value: "panipat", label: "Panipat" },
    { value: "hisar", label: "Hisar" },
    { value: "gurugram", label: "Gurugram" },
    { value: "faridabad", label: "Faridabad" },
    { value: "ambala", label: "Ambala" },
  ],
  "punjab": [
    { value: "amritsar", label: "Amritsar" },
    { value: "ludhiana", label: "Ludhiana" },
    { value: "jalandhar", label: "Jalandhar" },
    { value: "patiala", label: "Patiala" },
    { value: "bathinda", label: "Bathinda" },
  ],
  "rajasthan": [
    { value: "jaipur", label: "Jaipur" },
    { value: "jodhpur", label: "Jodhpur" },
    { value: "udaipur", label: "Udaipur" },
    { value: "kota", label: "Kota" },
    { value: "bikaner", label: "Bikaner" },
    { value: "ajmer", label: "Ajmer" },
  ],
  "up": [
    { value: "lucknow", label: "Lucknow" },
    { value: "kanpur", label: "Kanpur" },
    { value: "agra", label: "Agra" },
    { value: "varanasi", label: "Varanasi" },
    { value: "meerut", label: "Meerut" },
    { value: "ghaziabad", label: "Ghaziabad" },
    { value: "noida", label: "Noida" },
  ],
  "default": [
    { value: "district1", label: "District 1" },
    { value: "district2", label: "District 2" },
    { value: "district3", label: "District 3" },
  ]
};

export function FarmSettings({ onSave }: { onSave: () => void }) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [farmName, setFarmName] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("haryana");
  const [district, setDistrict] = useState("sonipat");
  const [address, setAddress] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState(districtsMap.haryana);
  
  // Update districts when state changes
  const handleStateChange = (stateValue: string) => {
    setState(stateValue);
    
    // Set available districts for the selected state
    const stateDistricts = districtsMap[stateValue] || districtsMap.default;
    setAvailableDistricts(stateDistricts);
    
    // Default to first district if current one isn't available
    if (!stateDistricts.some(d => d.value === district)) {
      setDistrict(stateDistricts[0].value);
    }
  };
  
  useEffect(() => {
    const fetchFarmData = async () => {
      if (!session?.user.id) return;
      
      try {
        setLoading(true);
        // Get user metadata from auth
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData.user) {
          const metadata = userData.user.user_metadata;
          if (metadata) {
            setFarmSize(metadata.farm_size || "25");
            setPostalCode(metadata.postal_code || "");
          }
        }
        
        // Get profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("location, crops, farm_name")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          if (data.farm_name) {
            setFarmName(data.farm_name);
          }
          
          if (data.location) {
            setAddress(data.location);
            
            // Try to extract district and state from location (if formatted as "Village, District, State")
            const parts = data.location.split(',').map(part => part.trim());
            if (parts.length >= 3) {
              // Last part would be state
              const stateFromLocation = parts[parts.length - 1].toLowerCase();
              let stateCode = 'haryana';
              
              // Find state by display name
              for (const [prefix, info] of Object.entries(pinCodePrefixes)) {
                if (stateFromLocation.toLowerCase().includes(info.stateDisplay.toLowerCase())) {
                  stateCode = info.state;
                  break;
                }
              }
              setState(stateCode);
              
              // Second to last part would be district
              const districtFromLocation = parts[parts.length - 2].toLowerCase();
              
              // Update available districts
              const stateDistricts = districtsMap[stateCode] || districtsMap.default;
              setAvailableDistricts(stateDistricts);
              
              // Find matching district or default to first
              let districtFound = false;
              for (const stateDistrict of stateDistricts) {
                if (districtFromLocation.includes(stateDistrict.label.toLowerCase())) {
                  setDistrict(stateDistrict.value);
                  districtFound = true;
                  break;
                }
              }
              
              if (!districtFound && stateDistricts.length > 0) {
                setDistrict(stateDistricts[0].value);
              }
            }
          }
          
          if (data.crops) {
            setCrops(data.crops);
          }
        }
      } catch (error) {
        console.error("Error fetching farm data:", error);
        toast({
          title: "Error",
          description: "Failed to load farm data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFarmData();
  }, [session, toast]);
  
  const handleCropToggle = (cropId: string) => {
    setCrops(prev => 
      prev.includes(cropId)
        ? prev.filter(id => id !== cropId)
        : [...prev, cropId]
    );
  };
  
  const lookupLocationByPostalCode = async () => {
    if (!postalCode || postalCode.length < 6) {
      toast({
        title: "Invalid postal code",
        description: "Please enter a valid 6-digit PIN code.",
        variant: "destructive",
      });
      return;
    }

    setLocationLoading(true);
    
    try {
      // Extract first 2 digits to identify state
      const firstTwoDigits = postalCode.substring(0, 2);
      
      // Find matching state
      const stateInfo = pinCodePrefixes[firstTwoDigits];
      
      if (!stateInfo) {
        throw new Error("Invalid PIN code or region not recognized");
      }
      
      // Get districts for this state
      const stateDistricts = districtsMap[stateInfo.state] || districtsMap.default;
      
      setTimeout(() => {
        // Update state
        setState(stateInfo.state);
        setAvailableDistricts(stateDistricts);
        
        // Set first district as default
        if (stateDistricts.length > 0) {
          setDistrict(stateDistricts[0].value);
        }
        
        // Keep the existing village part if it exists, otherwise generate one
        const currentParts = address.split(',');
        if (currentParts.length >= 3) {
          setAddress(`${currentParts[0]}, ${stateDistricts[0].label}, ${stateInfo.stateDisplay}`);
        } else {
          setAddress(`Village detected from PIN ${postalCode}, ${stateDistricts[0].label}, ${stateInfo.stateDisplay}`);
        }
        
        setLocationLoading(false);
        
        toast({
          title: "Location detected",
          description: `We've identified your location in ${stateInfo.stateDisplay}.`,
        });
      }, 800);
    } catch (error) {
      console.error("Error detecting location:", error);
      toast({
        title: "Location detection failed",
        description: "Please enter your location details manually.",
        variant: "destructive",
      });
      setLocationLoading(false);
    }
  };
  
  // Get state display name
  const getStateDisplayName = (stateCode: string) => {
    const state = indianStates.find(s => s.value === stateCode);
    return state ? state.label : stateCode;
  };
  
  // Get district display name
  const getDistrictDisplayName = (districtCode: string) => {
    const district = availableDistricts.find(d => d.value === districtCode);
    return district ? district.label : districtCode;
  };
  
  const handleSaveSettings = async () => {
    if (!session?.user.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your farm details.",
        variant: "destructive",
      });
      return;
    }
    
    if (!farmName) {
      toast({
        title: "Farm name required",
        description: "Please enter a name for your farm.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Construct full address from components if not directly edited
      let fullAddress = address;
      if (!fullAddress.includes(district) || !fullAddress.includes(state)) {
        const districtDisplayName = getDistrictDisplayName(district);
        const stateDisplayName = getStateDisplayName(state);
        
        fullAddress = address.trim() ? `${address.trim()}, ${districtDisplayName}, ${stateDisplayName}` : `${districtDisplayName}, ${stateDisplayName}`;
      }
      
      // Update profile in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          location: fullAddress,
          crops: crops,
          farm_name: farmName,
          updated_at: new Date().toISOString()
        })
        .eq("id", session.user.id);
      
      if (error) throw error;
      
      // Update metadata for farm size and postal code
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { 
          farm_size: farmSize,
          postal_code: postalCode
        }
      });
      
      if (metadataError) throw metadataError;
      
      toast({
        title: "Farm details saved",
        description: "Your farm information has been updated successfully.",
      });
      
      onSave();
    } catch (error: any) {
      console.error("Error saving farm settings:", error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save farm details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Farm Details</CardTitle>
        <CardDescription>
          Information about your farming operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Farm Name</Label>
            <Input 
              id="farm-name" 
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Enter your farm name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm-size">Total Land Area (in acres)</Label>
            <Input 
              id="farm-size" 
              type="number" 
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postal-code">Postal Code / PIN Code</Label>
          <div className="flex space-x-2">
            <Input 
              id="postal-code" 
              placeholder="Enter your 6-digit PIN code" 
              value={postalCode}
              maxLength={6}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={lookupLocationByPostalCode}
              disabled={locationLoading}
            >
              {locationLoading ? "Detecting..." : "Detect Location"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farm-state">State</Label>
            <Select 
              value={state}
              onValueChange={handleStateChange}
            >
              <SelectTrigger id="farm-state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {indianStates.map(state => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm-district">District</Label>
            <Select 
              value={district}
              onValueChange={setDistrict}
            >
              <SelectTrigger id="farm-district">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {availableDistricts.map(district => (
                  <SelectItem key={district.value} value={district.value}>
                    {district.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="farm-address">Complete Address</Label>
          <Textarea 
            id="farm-address" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Village/Town, Landmark (Optional)"
          />
          <p className="text-xs text-muted-foreground">
            Example: Village Khanpur, Near Temple (District and State will be added automatically)
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Primary Crops</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="wheat" 
                checked={crops.includes("wheat")}
                onCheckedChange={() => handleCropToggle("wheat")}
              />
              <Label htmlFor="wheat">Wheat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="rice" 
                checked={crops.includes("rice")}
                onCheckedChange={() => handleCropToggle("rice")}
              />
              <Label htmlFor="rice">Rice</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="cotton" 
                checked={crops.includes("cotton")}
                onCheckedChange={() => handleCropToggle("cotton")}
              />
              <Label htmlFor="cotton">Cotton</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="sugarcane" 
                checked={crops.includes("sugarcane")}
                onCheckedChange={() => handleCropToggle("sugarcane")}
              />
              <Label htmlFor="sugarcane">Sugarcane</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="maize" 
                checked={crops.includes("maize")}
                onCheckedChange={() => handleCropToggle("maize")}
              />
              <Label htmlFor="maize">Maize</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="pulses" 
                checked={crops.includes("pulses")}
                onCheckedChange={() => handleCropToggle("pulses")}
              />
              <Label htmlFor="pulses">Pulses</Label>
            </div>
          </div>
          
          {/* Show custom crops */}
          {crops.filter(crop => !["wheat", "rice", "cotton", "sugarcane", "maize", "pulses"].includes(crop)).length > 0 && (
            <div className="pt-4">
              <Label>Other Crops:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {crops
                  .filter(crop => !["wheat", "rice", "cotton", "sugarcane", "maize", "pulses"].includes(crop))
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
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? "Saving..." : "Save Farm Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
