
export interface OnboardingFormData {
  fullName: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
  district: string;
  village: string;
  farmSize: string;
  selectedCrops: string[];
  farmName: string;
}

export interface StepProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
}
