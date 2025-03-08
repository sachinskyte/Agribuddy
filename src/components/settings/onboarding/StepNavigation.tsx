
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToPrevious: () => void;
  goToNext: () => void;
  isSubmitting?: boolean;
  isFinalStep: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  goToPrevious,
  goToNext,
  isSubmitting = false,
  isFinalStep = false
}: StepNavigationProps) {
  return (
    <CardFooter className="flex justify-between">
      {currentStep > 1 ? (
        <Button variant="outline" onClick={goToPrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      {!isFinalStep ? (
        <Button onClick={goToNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      ) : (
        <Button onClick={goToNext} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Complete Setup
            </>
          )}
        </Button>
      )}
    </CardFooter>
  );
}
