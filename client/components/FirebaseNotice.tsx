import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { areFirebaseServicesAvailable } from "@/lib/firebase";

const FirebaseNotice: React.FC = () => {
  const { t } = useTranslation();

  if (areFirebaseServicesAvailable()) {
    return null; // Don't show notice if Firebase is properly configured
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Demo Mode Active</AlertTitle>
      <AlertDescription className="text-amber-700 space-y-2">
        <p>
          Firebase is not configured yet. The app is running in demo mode with
          simulated authentication.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="text-amber-700 border-amber-300 hover:bg-amber-100"
            onClick={() =>
              window.open("https://console.firebase.google.com", "_blank")
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Set up Firebase
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-amber-700 border-amber-300 hover:bg-amber-100"
            onClick={() => {
              const docUrl = window.location.origin + "/FIREBASE_SETUP.md";
              window.open(docUrl, "_blank");
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            View Setup Guide
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FirebaseNotice;
