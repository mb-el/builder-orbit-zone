import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Video, X, Play, FileVideo, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VideoUploadProps {
  onVideoSelect?: (file: File) => void;
  onVideoRemove?: () => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

const VideoUpload = ({
  onVideoSelect,
  onVideoRemove,
  maxSizeMB = 100,
  acceptedFormats = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  className = "",
}: VideoUploadProps) => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(
        `Please select a valid video format: ${acceptedFormats.join(", ")}`,
      );
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setSelectedVideo(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setVideoPreview(url);

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onVideoSelect?.(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    onVideoRemove?.();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (selectedVideo && videoPreview) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                src={videoPreview}
                controls
                className="w-full h-48 object-cover"
                poster=""
              >
                Your browser does not support the video tag.
              </video>

              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-8 h-8"
                onClick={handleRemoveVideo}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* File Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{selectedVideo.name}</span>
                <span className="text-muted-foreground">
                  {formatFileSize(selectedVideo.size)}
                </span>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {uploadProgress === 100 && !isUploading && (
                <div className="text-sm text-green-600 font-medium">
                  ✓ Upload complete
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={openFileDialog}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("upload_video")}</h3>
              <p className="text-muted-foreground text-sm">
                Drag and drop a video file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP4, WebM, OGV up to {maxSizeMB}MB
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Choose File
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="w-4 h-4" />
                {t("record_video")}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
