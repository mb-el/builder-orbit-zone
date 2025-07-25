import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Glasses,
  Eye,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useVRAR from "@/hooks/useVRMR";
import { toast } from "@/hooks/use-toast";

interface VRARInterfaceProps {
  children?: React.ReactNode;
  className?: string;
}

const VRARInterface: React.FC<VRARInterfaceProps> = ({
  children,
  className = "",
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [spatialView, setSpatialView] = useState(false);

  const {
    isSupported,
    isVRSupported,
    isARSupported,
    availableDevices,
    currentSession,
    toggleVR,
    toggleAR,
    endSession,
    error,
  } = useVRAR();

  // Initialize 3D context for VR/AR rendering
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    // Set up basic WebGL context
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Initialize basic 3D scene for social content
    const setupVRScene = () => {
      // This would contain the 3D scene setup for VR/AR
      // In a real implementation, you'd use Three.js or similar
      console.log("VR/AR scene initialized");
    };

    setupVRScene();
  }, [currentSession.active]);

  // Handle VR session start
  const handleStartVR = async () => {
    try {
      const success = await toggleVR();
      if (success) {
        setImmersiveMode(true);
        toast({
          title: "VR Mode Activated",
          description: "Welcome to immersive social media experience!",
        });
      }
    } catch (err) {
      toast({
        title: "VR Error",
        description:
          "Failed to start VR session. Check your headset connection.",
        variant: "destructive",
      });
    }
  };

  // Handle AR session start
  const handleStartAR = async () => {
    try {
      const success = await toggleAR();
      if (success) {
        setImmersiveMode(true);
        setSpatialView(true);
        toast({
          title: "AR Mode Activated",
          description:
            "Social content is now overlaid in your real environment!",
        });
      }
    } catch (err) {
      toast({
        title: "AR Error",
        description: "Failed to start AR session. Camera permission required.",
        variant: "destructive",
      });
    }
  };

  // Handle session end
  const handleEndSession = async () => {
    try {
      await endSession();
      setImmersiveMode(false);
      setSpatialView(false);
      toast({
        title: "Session Ended",
        description: "Returned to standard view mode.",
      });
    } catch (err) {
      console.warn("Error ending session:", err);
    }
  };

  if (!isSupported) {
    return (
      <Alert className="mb-4">
        <Monitor className="h-4 w-4" />
        <AlertDescription>
          VR/AR not supported in this browser. Use Chrome, Firefox, or Edge with
          WebXR support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`vrar-interface ${className}`}>
      {/* VR/AR Control Panel */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Glasses className="w-5 h-5" />
            Immersive Experience
            {currentSession.active && (
              <Badge variant="secondary" className="ml-2">
                {currentSession.mode === "immersive-vr"
                  ? "VR Active"
                  : "AR Active"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Devices</h4>
              {availableDevices.length > 0 ? (
                availableDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center gap-2 p-2 border rounded"
                  >
                    {device.type === "vr" ? (
                      <Glasses className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span className="text-sm">{device.name}</span>
                    {device.connected ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No VR/AR devices detected
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Capabilities</h4>
              <div className="flex flex-wrap gap-1">
                {isVRSupported && <Badge variant="outline">VR Ready</Badge>}
                {isARSupported && <Badge variant="outline">AR Ready</Badge>}
                <Badge variant="outline">6DOF Tracking</Badge>
                <Badge variant="outline">Hand Tracking</Badge>
                <Badge variant="outline">Spatial Audio</Badge>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            {!currentSession.active ? (
              <>
                <Button
                  onClick={handleStartVR}
                  disabled={!isVRSupported}
                  className="flex items-center gap-2"
                >
                  <Glasses className="w-4 h-4" />
                  Enter VR
                </Button>
                <Button
                  onClick={handleStartAR}
                  disabled={!isARSupported}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Enter AR
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEndSession}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Exit {currentSession.mode === "immersive-vr" ? "VR" : "AR"}
              </Button>
            )}

            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Session Info */}
          {currentSession.active && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Mode:</span>
                  <span className="ml-2">{currentSession.mode}</span>
                </div>
                <div>
                  <span className="font-medium">Input Sources:</span>
                  <span className="ml-2">
                    {currentSession.inputSources.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 3D Canvas for VR/AR rendering */}
      <canvas
        ref={canvasRef}
        className={`vrar-canvas ${currentSession.active ? "active" : "hidden"}`}
        width={1920}
        height={1080}
        style={{
          position: currentSession.active ? "fixed" : "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: currentSession.active ? 9999 : "auto",
          background: "transparent",
        }}
      />

      {/* Immersive UI Overlay */}
      {currentSession.active && (
        <div className="vrar-overlay fixed inset-0 z-[10000] pointer-events-none">
          {/* VR/AR specific UI elements */}
          <div className="absolute top-4 right-4 pointer-events-auto">
            <Button
              onClick={handleEndSession}
              variant="secondary"
              size="sm"
              className="bg-black/70 text-white hover:bg-black/80"
            >
              Exit {currentSession.mode === "immersive-vr" ? "VR" : "AR"}
            </Button>
          </div>

          {/* Spatial content indicators */}
          {spatialView && (
            <div className="absolute bottom-4 left-4 pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-2 rounded">
                <Eye className="w-4 h-4" />
                <span className="text-sm">AR Mode Active</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Regular content container */}
      <div
        className={`content-container ${currentSession.active ? "vrar-active" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default VRARInterface;
