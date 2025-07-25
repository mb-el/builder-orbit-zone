import Layout from "@/components/Layout";
import CameraCapture from "@/components/CameraCapture";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Camera() {
  const { t } = useTranslation();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{
    blob: Blob;
    type: "photo" | "video";
    url: string;
  } | null>(null);

  const handleCapture = (blob: Blob, type: "photo" | "video") => {
    const url = URL.createObjectURL(blob);
    setCapturedMedia({ blob, type, url });
    setShowCamera(false);

    console.log("Captured:", type, blob);
    // Here you could upload to server, save to gallery, etc.
  };

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

              <Button
                onClick={() => setShowCamera(true)}
                className="gap-2"
                size="lg"
              >
                <CameraIcon className="w-5 h-5" />
                Open Camera
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
