import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ZapOff
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CameraCaptureProps {
  onCapture?: (blob: Blob, type: 'photo' | 'video') => void;
  onClose?: () => void;
  className?: string;
}

const CameraCapture = ({ 
  onCapture,
  onClose,
  className = ""
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
    type: 'photo' | 'video';
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Flip horizontally if using front camera
    if (facingMode === 'user') {
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    } else {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ blob, url, type: 'photo' });
        onCapture?.(blob, 'photo');
      }
    }, 'image/jpeg', 0.9);
  }, [facingMode, onCapture]);

  const startVideoRecording = useCallback(() => {
    if (!streamRef.current) return;

    try {
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      };

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ blob, url, type: 'video' });
        onCapture?.(blob, 'video');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      mediaRecorder.onstop = () => {
        clearInterval(timer);
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setCapturedMedia({ blob, url, type: 'video' });
        onCapture?.(blob, 'video');
      };

    } catch (err) {
      setError('Failed to start video recording');
      console.error('Recording error:', err);
    }
  }, [onCapture]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    if (isStreaming) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [isStreaming, startCamera, stopCamera]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    
    const link = document.createElement('a');
    link.href = capturedMedia.url;
    link.download = `capture_${Date.now()}.${capturedMedia.type === 'photo' ? 'jpg' : 'webm'}`;
    link.click();
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

            {capturedMedia.type === 'photo' ? (
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
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={toggleFacingMode}
            >
              <FlipHorizontal className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`bg-black/50 hover:bg-black/70 ${flashEnabled ? 'text-yellow-400' : 'text-white'}`}
              onClick={() => setFlashEnabled(!flashEnabled)}
            >
              {flashEnabled ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
            </Button>
          </div>

          {/* Recording Timer */}
          {isRecording && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                REC {formatTime(recordingTime)}
              </div>
            </div>
          )}

          {/* Video Stream */}
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-[70vh] object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          ) : (
            <div className="w-full h-[70vh] flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-4">Camera not started</p>
                <Button onClick={startCamera} className="gap-2">
                  <Camera className="w-4 h-4" />
                  Start Camera
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white p-8">
                <p className="text-lg mb-4">{error}</p>
                <Button onClick={startCamera} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Capture Controls */}
          {isStreaming && (
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
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
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
