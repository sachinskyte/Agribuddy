
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSetupWizard } from "@/components/settings/onboarding/AccountSetupWizard";
import { useAuth } from "@/context/AuthContext";

const Onboarding = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth");
    }
  }, [session, loading, navigate]);

  // If still loading or no session, show nothing yet
  if (loading || !session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <AccountSetupWizard />;
};

export default Onboarding;
