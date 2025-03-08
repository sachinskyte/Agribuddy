
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapIcon, MapPin } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { StepProps } from "./types";
import { useState } from "react";
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
  // Add more states and districts as needed
  "default": [
    { value: "district1", label: "District 1" },
    { value: "district2", label: "District 2" },
    { value: "district3", label: "District 3" },
  ]
};

export function LocationStep({ data, updateData }: StepProps) {
  const { toast } = useToast();
  const [locationLoading, setLocationLoading] = useState(false);
  const [districts, setDistricts] = useState<Array<{ value: string, label: string }>>(
    districtsMap[data.state] || districtsMap.default
  );

  // Update districts when state changes
  const handleStateChange = (stateValue: string) => {
    updateData({ state: stateValue });
    
    // Set available districts for the selected state
    const stateDistricts = districtsMap[stateValue] || districtsMap.default;
    setDistricts(stateDistricts);
    
    // Default to first district if current one isn't available
    if (!stateDistricts.some(d => d.value === data.district)) {
      updateData({ district: stateDistricts[0].value });
    }
  };

  const lookupLocationByPostalCode = async () => {
    if (!data.postalCode || data.postalCode.length < 6) {
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
      const firstTwoDigits = data.postalCode.substring(0, 2);
      
      // Find matching state
      const stateInfo = pinCodePrefixes[firstTwoDigits];
      
      if (!stateInfo) {
        throw new Error("Invalid PIN code or region not recognized");
      }
      
      // Default district selection based on state
      const availableDistricts = districtsMap[stateInfo.state] || districtsMap.default;
      
      setTimeout(() => {
        // Update state and district
        updateData({
          state: stateInfo.state,
          district: availableDistricts[0].value,
          village: `Village detected from PIN ${data.postalCode}`
        });
        
        // Update the districts dropdown
        setDistricts(availableDistricts);
        
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

  // Get state display name for showing in the address preview
  const getStateDisplayName = (stateCode: string) => {
    const state = indianStates.find(s => s.value === stateCode);
    return state ? state.label : stateCode;
  };

  // Get district display name for showing in the address preview
  const getDistrictDisplayName = (districtCode: string) => {
    const district = districts.find(d => d.value === districtCode);
    return district ? district.label : districtCode;
  };

  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="postal-code" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Postal Code / PIN Code
          </Label>
          <div className="flex space-x-2">
            <Input 
              id="postal-code" 
              placeholder="Enter your 6-digit PIN code" 
              value={data.postalCode}
              onChange={(e) => updateData({ postalCode: e.target.value })}
              maxLength={6}
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={lookupLocationByPostalCode}
              disabled={locationLoading}
            >
              {locationLoading ? "Detecting..." : "Detect"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            We'll automatically detect your location from your PIN code
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="village">Village/Town</Label>
          <Input 
            id="village" 
            placeholder="Enter your village or town" 
            value={data.village}
            onChange={(e) => updateData({ village: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select 
              value={data.state}
              onValueChange={handleStateChange}
            >
              <SelectTrigger id="state">
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
            <Label htmlFor="district">District</Label>
            <Select 
              value={data.district}
              onValueChange={(value) => updateData({ district: value })}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {districts.map(district => (
                  <SelectItem key={district.value} value={district.value}>
                    {district.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center pt-2">
          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Your full address will be: {data.village ? `${data.village}, ` : ""}
            {getDistrictDisplayName(data.district)}, {getStateDisplayName(data.state)}
          </p>
        </div>
      </div>
    </CardContent>
  );
}
