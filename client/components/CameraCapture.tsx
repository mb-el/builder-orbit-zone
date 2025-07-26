import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  Video,
  X,
  RotateCcw,
  Download,
  Play,
  Square,
  FlipHorizontal,
  Zap,
  ZapOff,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CameraCaptureProps {
  onCapture?: (blob: Blob, type: "photo" | "video") => void;
  onClose?: () => void;
  className?: string;
}

interface MediaDeviceInfo {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}

const CameraCapture = ({
  onCapture,
  onClose,
  className = "",
}: CameraCaptureProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<{
    blob: Blob;
    url: string;
    type: "photo" | "video";
  } | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied" | "unknown"
  >("unknown");

  // Check for available media devices and permissions
  useEffect(() => {
    checkMediaSupport();
    return () => {
      stopCamera();
    };
  }, []);

  const checkMediaSupport = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError(
          "Camera is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.",
        );
        return;
      }

      // Check HTTPS requirement
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        setError(
          "Camera access requires HTTPS. Please access this site using HTTPS.",
        );
        return;
      }

      // Check permission status
      if ("permissions" in navigator) {
        try {
          const permission = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          setPermissionStatus(permission.state);

          permission.addEventListener("change", () => {
            setPermissionStatus(permission.state);
          });
        } catch (err) {
          console.log("Permission API not fully supported");
        }
      }

      // Get available devices with permission request first
      try {
        // Request basic permission first to get device labels
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        tempStream.getTracks().forEach(track => track.stop());

        // Now enumerate devices with labels
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );

        console.log('Available video devices:', videoDevices);
        setAvailableDevices(videoDevices as MediaDeviceInfo[]);
        setHasMultipleCameras(videoDevices.length > 1);

        if (videoDevices.length === 0) {
          setError("No camera devices found on this device.");
        }
      } catch (err) {
        console.log("Could not enumerate devices or get permission:", err);
        // Try to enumerate without permission (will have empty labels)
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput",
          );
          setAvailableDevices(videoDevices as MediaDeviceInfo[]);
          setHasMultipleCameras(videoDevices.length > 1);
        } catch (enumErr) {
          console.error("Device enumeration failed:", enumErr);
        }
      }
    } catch (err) {
      console.error("Media support check failed:", err);
      setError(`Media support check failed: ${err.message}`);
    }
  };

  const getErrorMessage = (error: any) => {
    const errorName = error.name || error.message || "";
    const errorMessage = error.message || "";

    switch (errorName) {
      case "NotFoundError":
      case "DevicesNotFoundError":
        return availableDevices.length === 0
          ? "No camera devices found. Please connect a camera and refresh the page."
          : "Requested camera device not found. Please try selecting a different camera.";
      case "NotReadableError":
      case "TrackStartError":
        return "Camera is already in use by another application. Please close other camera apps and try again.";
      case "OverconstrainedError":
      case "ConstraintNotSatisfiedError":
        return "The camera doesn't support the requested settings. Trying with basic settings...";
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Camera access was denied. Please click the camera icon in your browser's address bar and allow camera access.";
      case "SecurityError":
        return "Camera access is blocked due to security restrictions. Please ensure you're using HTTPS.";
      case "TypeError":
        return "Camera is not supported in this browser. Please try Chrome, Firefox, or Safari.";
      case "AbortError":
        return "Camera access was interrupted. Please try again.";
      default:
        if (errorMessage.includes("Requested device not found")) {
          return "The selected camera is not available. Please try a different camera or refresh the page.";
        }
        return `Camera error: ${errorMessage || "An unknown error occurred. Please try refreshing the page."}`;
    }
  };

  const startCamera = useCallback(
    async (retryWithBasicConstraints = false, specificDeviceId?: string) => {
      try {
        setError(null);
        setIsLoading(true);

        // Progressive fallback constraints
        let constraints: MediaStreamConstraints;

        if (retryWithBasicConstraints) {
          // Most basic constraints as last resort
          constraints = {
            video: specificDeviceId ? { deviceId: { exact: specificDeviceId } } : true,
            audio: false, // Try without audio first
          };
        } else {
          // Try advanced constraints first
          const videoConstraints: MediaTrackConstraints = {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 },
          };

          // Add device ID if we have one
          if (specificDeviceId) {
            videoConstraints.deviceId = { ideal: specificDeviceId };
          }

          constraints = {
            video: videoConstraints,
            audio: false, // Start without audio to avoid permission issues
          };
        }

        console.log("Requesting camera with constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for video to load and play
          await new Promise((resolve, reject) => {
            if (!videoRef.current) {
              reject(new Error("Video element not available"));
              return;
            }

            const video = videoRef.current;

            const onLoadedMetadata = () => {
              video.removeEventListener("loadedmetadata", onLoadedMetadata);
              video.removeEventListener("error", onError);
              resolve(void 0);
            };

            const onError = (e: Event) => {
              video.removeEventListener("loadedmetadata", onLoadedMetadata);
              video.removeEventListener("error", onError);
              reject(new Error("Video failed to load"));
            };

            video.addEventListener("loadedmetadata", onLoadedMetadata);
            video.addEventListener("error", onError);

            video.play().catch(reject);
          });

          setIsStreaming(true);
          setPermissionStatus("granted");
        }
      } catch (err: any) {
        console.error("Camera error:", err);
        const errorMessage = getErrorMessage(err);

        // Progressive fallback strategy
        if (!retryWithBasicConstraints) {
          if (
            err.name === "OverconstrainedError" ||
            err.name === "ConstraintNotSatisfiedError" ||
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            console.log("Retrying with basic constraints...");
            setTimeout(() => startCamera(true), 1000);
            return;
          }
        } else if (availableDevices.length > 0) {
          // Try with first available device if basic constraints failed
          const firstDevice = availableDevices[0];
          console.log(`Trying with specific device: ${firstDevice.label}`);
          setTimeout(() => startCamera(true, firstDevice.deviceId), 1000);
          return;
        }

        setError(errorMessage);
        setPermissionStatus(
          err.name === "NotAllowedError" ? "denied" : "unknown",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [facingMode, availableDevices],
  );

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsRecording(false);
    setRecordingTime(0);

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip horizontally if using front camera
    if (facingMode === "user") {
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCapturedMedia({ blob, url, type: "photo" });
          onCapture?.(blob, "photo");
        }
      },
      "image/jpeg",
      0.9,
    );
  }, [facingMode, onCapture]);

  const startVideoRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      // Try different mime types for better compatibility
      const mimeTypes = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ];

      let mediaRecorder;
      let selectedMimeType = "";

      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        setError("Video recording is not supported in this browser.");
        return;
      }

      const options = {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000,
      };

      mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ blob, url, type: "video" });
        onCapture?.(blob, "video");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      mediaRecorder.onstop = () => {
        clearInterval(timer);
        const blob = new Blob(chunks, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ blob, url, type: "video" });
        onCapture?.(blob, "video");
      };
    } catch (err) {
      setError("Failed to start video recording");
      console.error("Recording error:", err);
    }
  }, [onCapture]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleFacingMode = useCallback(() => {
    if (!hasMultipleCameras) {
      setError("Only one camera detected. Cannot switch cameras.");
      return;
    }

    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    if (isStreaming) {
      stopCamera();
      setTimeout(() => {
        startCamera(false, selectedDeviceId || undefined);
      }, 500);
    }
  }, [isStreaming, hasMultipleCameras, startCamera, stopCamera, selectedDeviceId]);

  const handleDeviceChange = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (isStreaming) {
      stopCamera();
      setTimeout(() => {
        startCamera(false, deviceId);
      }, 500);
    }
  }, [isStreaming, startCamera, stopCamera]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    stopCamera();
    if (capturedMedia) {
      URL.revokeObjectURL(capturedMedia.url);
    }
    onClose?.();
  };

  const downloadCapturedMedia = () => {
    if (!capturedMedia) return;

    const link = document.createElement("a");
    link.href = capturedMedia.url;
    link.download = `capture_${Date.now()}.${capturedMedia.type === "photo" ? "jpg" : "webm"}`;
    link.click();
  };

  const retryCamera = () => {
    setError(null);
    // Reset device selection and try again
    setSelectedDeviceId(null);
    checkMediaSupport().then(() => {
      setTimeout(() => startCamera(), 500);
    });
  };

  const tryWithSpecificDevice = (deviceId: string) => {
    setError(null);
    setSelectedDeviceId(deviceId);
    startCamera(false, deviceId);
  };

  // Show captured media preview
  if (capturedMedia) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="relative bg-black">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {capturedMedia.type === "photo" ? (
              <img
                src={capturedMedia.url}
                alt="Captured"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            ) : (
              <video
                src={capturedMedia.url}
                controls
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button
                variant="secondary"
                onClick={downloadCapturedMedia}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={() => {
                  setCapturedMedia(null);
                  startCamera();
                }}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative bg-black">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Camera Controls */}
          {isStreaming && (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70 text-white disabled:opacity-50"
                onClick={toggleFacingMode}
                disabled={!hasMultipleCameras}
                title="Switch Camera"
              >
                <FlipHorizontal className="w-5 h-5" />
              </Button>

              {/* Device Selector */}
              {availableDevices.length > 1 && (
                <select
                  value={selectedDeviceId || ''}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="bg-black/50 text-white text-sm px-2 py-1 rounded border border-white/20 focus:border-white/50 outline-none"
                  title="Select Camera"
                >
                  <option value="">Auto</option>
                  {availableDevices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                REC {formatTime(recordingTime)}
              </div>
            </div>
          )}

          {/* Video Stream or Loading/Error State */}
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-[70vh] object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
            />
          ) : (
            <div className="w-full h-[70vh] flex items-center justify-center bg-gray-900">
              <div className="text-center text-white max-w-md px-6">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-50 animate-spin" />
                    <p className="text-lg mb-4">Starting camera...</p>
                  </>
                ) : error ? (
                  <>
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-50 text-yellow-500" />
                    <p className="text-lg mb-4">Camera Error</p>
                    <Alert className="mb-4 bg-red-900/20 border-red-500/50">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-white">
                        {error}
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={retryCamera}
                          className="gap-2"
                          variant="outline"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Try Again
                        </Button>
                        {permissionStatus === "denied" && (
                          <Button
                            onClick={() => window.location.reload()}
                            className="gap-2"
                          >
                            Reload Page
                          </Button>
                        )}
                      </div>

                      {/* Device Selection for Troubleshooting */}
                      {availableDevices.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-300">Try a specific camera:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {availableDevices.map((device, index) => (
                              <Button
                                key={device.deviceId}
                                onClick={() => tryWithSpecificDevice(device.deviceId)}
                                variant="ghost"
                                size="sm"
                                className="text-xs bg-white/10 hover:bg-white/20"
                              >
                                {device.label || `Camera ${index + 1}`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-4">Camera Ready</p>
                    <div className="space-y-3">
                      <Button onClick={() => startCamera()} className="gap-2" size="lg">
                        <Camera className="w-4 h-4" />
                        Start Camera
                      </Button>

                      {availableDevices.length > 1 && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-400">Available cameras:</p>
                          <div className="text-xs text-gray-500 space-y-1">
                            {availableDevices.map((device, index) => (
                              <div key={device.deviceId}>
                                {device.label || `Camera ${index + 1}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Capture Controls */}
          {isStreaming && !error && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
              {/* Photo Capture */}
              <Button
                variant="ghost"
                size="icon"
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={capturePhoto}
                disabled={isRecording}
              >
                <Camera className="w-8 h-8" />
              </Button>

              {/* Video Record */}
              <Button
                variant="ghost"
                size="icon"
                className={`w-20 h-20 rounded-full ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white/20 hover:bg-white/30"
                } text-white`}
                onClick={isRecording ? stopVideoRecording : startVideoRecording}
              >
                {isRecording ? (
                  <Square className="w-8 h-8" />
                ) : (
                  <Video className="w-8 h-8" />
                )}
              </Button>

              {/* Gallery placeholder */}
              <div className="w-16 h-16 bg-white/20 rounded-lg"></div>
            </div>
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
