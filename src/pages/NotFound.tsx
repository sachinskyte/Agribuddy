
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CloudSun } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-agribuddy-light to-white">
      <div className="text-center max-w-md p-6">
        <div className="flex justify-center mb-4">
          <CloudSun className="h-16 w-16 text-agribuddy-primary" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! Looks like this field hasn't been planted yet.
        </p>
        <Button asChild size="lg">
          <a href="/" className="inline-block">
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
