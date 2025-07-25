import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  RotateCcw,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  showControls?: boolean;
  isShort?: boolean; // For TikTok-style videos
}

const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = true,
  className = "",
  showControls = true,
  isShort = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isShort) {
    // TikTok-style vertical video
    return (
      <div className={`relative h-screen w-full bg-black ${className}`}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          className="w-full h-full object-cover"
          onClick={togglePlay}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20">
          {/* Play/Pause Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-16 h-16 bg-black/30 hover:bg-black/50 rounded-full"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-6">
            <div className="flex flex-col items-center text-white">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-black/20"
              >
                <Heart className="w-6 h-6" />
              </Button>
              <span className="text-xs mt-1">1.2k</span>
            </div>

            <div className="flex flex-col items-center text-white">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-black/20"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
              <span className="text-xs mt-1">89</span>
            </div>

            <div className="flex flex-col items-center text-white">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-black/20"
              >
                <Share className="w-6 h-6" />
              </Button>
              <span className="text-xs mt-1">Share</span>
            </div>

            <div className="flex flex-col items-center text-white">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full bg-black/20"
              >
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-20 text-white">
            <div className="mb-2">
              <p className="font-semibold">@username</p>
              <p className="text-sm opacity-90">
                Video description goes here...
              </p>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Volume Control */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full text-white"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Regular horizontal video player
  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControlsOverlay(true)}
      onMouseLeave={() => setShowControlsOverlay(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        className="w-full h-auto"
        onClick={togglePlay}
      />

      {showControls && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControlsOverlay ? "opacity-100" : "opacity-0"}`}
        >
          {/* Center Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-16 h-16 bg-black/30 hover:bg-black/50 rounded-full"
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>

                <div className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-white hover:bg-white/20"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
