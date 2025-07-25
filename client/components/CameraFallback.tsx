import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUpload from "./ImageUpload";
import VideoUpload from "./VideoUpload";
import { Camera, Upload, AlertTriangle, X, Image, Video } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CameraFallbackProps {
  onCapture?: (blob: Blob, type: "photo" | "video") => void;
  onClose?: () => void;
  className?: string;
  errorMessage?: string;
}

const CameraFallback = ({
  onCapture,
  onClose,
  className = "",
  errorMessage = "Camera not available",
}: CameraFallbackProps) => {
  const { t } = useTranslation();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const handleFileSelect = (files: File[], type: "photo" | "video") => {
    if (files.length > 0) {
      const file = files[0];
      const blob = new Blob([file], { type: file.type });
      onCapture?.(blob, type);
    }
  };

  if (showImageUpload) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("upload_photo")}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowImageUpload(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ImageUpload
            multiple={false}
            onImageSelect={(files) => {
              handleFileSelect(files, "photo");
              setShowImageUpload(false);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  if (showVideoUpload) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("upload_video")}</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVideoUpload(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <VideoUpload
            onVideoSelect={(file) => {
              handleFileSelect([file], "video");
              setShowVideoUpload(false);
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Error Alert */}
          <Alert className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-700 dark:text-orange-300">
              {errorMessage}
            </AlertDescription>
          </Alert>

          {/* Camera Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Camera Not Available</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your device camera is not accessible. You can still upload photos
              and videos from your device storage.
            </p>
          </div>

          {/* Alternative Options */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Alternative Options:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => setShowImageUpload(true)}
              >
                <Image className="w-8 h-8" />
                <span>{t("upload_photo")}</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => setShowVideoUpload(true)}
              >
                <Video className="w-8 h-8" />
                <span>{t("upload_video")}</span>
              </Button>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
            <p className="font-medium">Troubleshooting tips:</p>
            <ul className="text-left space-y-1">
              <li>• Make sure your browser allows camera access</li>
              <li>• Check if another app is using the camera</li>
              <li>• Try refreshing the page</li>
              <li>• Use a different browser (Chrome, Firefox, Safari)</li>
              <li>• Ensure you're using HTTPS (required for camera access)</li>
            </ul>
          </div>

          {/* Retry Button */}
          <Button onClick={() => window.location.reload()} className="gap-2">
            <Camera className="w-4 h-4" />
            Reload & Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFallback;
