import Layout from "@/components/Layout";
import CameraCapture from "@/components/CameraCapture";
import CameraFallback from "@/components/CameraFallback";
import CameraDiagnostic from "@/components/CameraDiagnostic";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Settings, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Camera() {
  const { t } = useTranslation();
  const [showCamera, setShowCamera] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedMedia, setCapturedMedia] = useState<{
    blob: Blob;
    type: "photo" | "video";
    url: string;
  } | null>(null);
  const [cameraSupported, setCameraSupported] = useState<boolean | null>(null);

  // Check camera support on mount
  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraSupported(false);
          return;
        }

        // Check if any video input devices are available
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameraSupported(videoDevices.length > 0);
      } catch (error) {
        console.error('Error checking camera support:', error);
        setCameraSupported(false);
      }
    };

    checkCameraSupport();
  }, []);

  const handleCapture = (blob: Blob, type: "photo" | "video") => {
    const url = URL.createObjectURL(blob);
    setCapturedMedia({ blob, type, url });
    setShowCamera(false);
    setShowFallback(false);
    setCameraError(null);

    console.log("Captured:", type, blob);
    // Here you could upload to server, save to gallery, etc.
  };

  const handleCameraError = (error: string) => {
    setCameraError(error);
    console.error('Camera error:', error);
  };

  const startCamera = () => {
    setCameraError(null);
    setShowFallback(false);
    setShowCamera(true);
  };

  const showCameraFallback = () => {
    setShowCamera(false);
    setShowFallback(true);
  };

  if (showDiagnostic) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <CameraDiagnostic onClose={() => setShowDiagnostic(false)} />
        </div>
      </Layout>
    );
  }

  if (showCamera) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <CameraCapture
            onCapture={handleCapture}
            onClose={() => setShowCamera(false)}
          />
        </div>
      </Layout>
    );
  }

  if (showFallback) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-4">
          <CameraFallback
            onCapture={handleCapture}
            onClose={() => setShowFallback(false)}
            errorMessage={cameraError || "Camera not available"}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">{t("camera")}</h1>

          {capturedMedia ? (
            <div className="space-y-4">
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="text-lg font-semibold mb-3">Latest Capture</h3>
                <div className="max-w-md mx-auto">
                  {capturedMedia.type === "photo" ? (
                    <img
                      src={capturedMedia.url}
                      alt="Captured"
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <video
                      src={capturedMedia.url}
                      controls
                      className="w-full h-auto rounded-lg"
                    />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {capturedMedia.type === "photo" ? "Photo" : "Video"} captured
                  successfully
                </p>
              </div>

              <Button
                onClick={() => {
                  URL.revokeObjectURL(capturedMedia.url);
                  setCapturedMedia(null);
                  setShowCamera(true);
                }}
                className="gap-2"
              >
                <CameraIcon className="w-4 h-4" />
                Take Another
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CameraIcon className="w-16 h-16 text-primary" />
              </div>

              <p className="text-muted-foreground max-w-md mx-auto">
                Capture photos and videos with your device camera. The enhanced
                camera interface supports both front and back cameras with photo
                and video recording capabilities.
              </p>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={startCamera}
                  className="gap-2"
                  size="lg"
                  disabled={cameraSupported === false}
                >
                  <CameraIcon className="w-5 h-5" />
                  Open Camera
                </Button>

                {cameraSupported === false && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Camera not detected</span>
                    </div>
                    <Button
                      onClick={showCameraFallback}
                      variant="outline"
                      className="gap-2"
                    >
                      Upload Files Instead
                    </Button>
                  </div>
                )}

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => setShowDiagnostic(true)}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground"
                  >
                    <Settings className="w-4 h-4" />
                    Camera Diagnostic
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
