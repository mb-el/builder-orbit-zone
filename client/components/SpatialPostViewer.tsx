import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Maximize,
  Minimize,
  RotateCw,
  Move3D,
  Eye,
  Volume2,
  VolumeX,
  Share,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SpatialPost {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  media: {
    type: "image" | "video" | "360-image" | "360-video" | "3d-model";
    url: string;
    spatialData?: {
      position: [number, number, number];
      rotation: [number, number, number];
      scale: [number, number, number];
    };
  }[];
  spatialProperties: {
    floating: boolean;
    interactive: boolean;
    soundscape: boolean;
    depth: number;
  };
  interactions: {
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    bookmarked: boolean;
  };
}

interface SpatialPostViewerProps {
  posts: SpatialPost[];
  isVRMode: boolean;
  isARMode: boolean;
  onPostInteraction: (postId: string, action: string) => void;
}

const SpatialPostViewer: React.FC<SpatialPostViewerProps> = ({
  posts,
  isVRMode,
  isARMode,
  onPostInteraction,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [spatialAudio, setSpatialAudio] = useState(true);
  const [immersiveMode, setImmersiveMode] = useState(false);

  // Mock spatial posts data
  const mockSpatialPosts: SpatialPost[] = [
    {
      id: "1",
      content:
        "Amazing sunset in 360° VR! Experience the beauty of nature like never before.",
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg",
      },
      media: [
        {
          type: "360-image",
          url: "/placeholder.svg",
          spatialData: {
            position: [0, 1.5, -3],
            rotation: [0, 0, 0],
            scale: [2, 2, 2],
          },
        },
      ],
      spatialProperties: {
        floating: true,
        interactive: true,
        soundscape: true,
        depth: 0.8,
      },
      interactions: {
        likes: 124,
        comments: 23,
        shares: 8,
        liked: false,
        bookmarked: true,
      },
    },
    {
      id: "2",
      content:
        "Check out this 3D sculpture I created! Rotate and zoom to see all angles.",
      author: {
        name: "Alice Artist",
        avatar: "/placeholder.svg",
      },
      media: [
        {
          type: "3d-model",
          url: "/placeholder.svg",
          spatialData: {
            position: [2, 0.5, -2],
            rotation: [0, 45, 0],
            scale: [1, 1, 1],
          },
        },
      ],
      spatialProperties: {
        floating: false,
        interactive: true,
        soundscape: false,
        depth: 1.2,
      },
      interactions: {
        likes: 89,
        comments: 12,
        shares: 5,
        liked: true,
        bookmarked: false,
      },
    },
  ];

  const activePosts = posts.length > 0 ? posts : mockSpatialPosts;

  // Handle post selection in VR/AR space
  const handlePostSelect = (postId: string) => {
    setSelectedPost(postId);
    onPostInteraction(postId, "select");
  };

  // Handle spatial interactions
  const handleSpatialInteraction = (postId: string, action: string) => {
    onPostInteraction(postId, action);

    // Add haptic feedback for VR controllers
    if (isVRMode && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const renderSpatialPost = (post: SpatialPost, index: number) => {
    const isSelected = selectedPost === post.id;

    return (
      <Card
        key={post.id}
        className={`spatial-post ${isSelected ? "selected" : ""} ${
          isVRMode || isARMode ? "immersive" : "standard"
        }`}
        style={{
          transform:
            isVRMode || isARMode
              ? `translate3d(${index * 300}px, ${Math.sin(index) * 50}px, ${post.spatialProperties.depth * 100}px)`
              : "none",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
        }}
        onClick={() => handlePostSelect(post.id)}
      >
        <CardContent className="p-4">
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h4 className="font-medium text-sm">{post.author.name}</h4>
              <div className="flex items-center gap-2">
                {post.spatialProperties.floating && (
                  <Badge variant="secondary" className="text-xs">
                    <Move3D className="w-3 h-3 mr-1" />
                    Floating
                  </Badge>
                )}
                {post.spatialProperties.interactive && (
                  <Badge variant="outline" className="text-xs">
                    Interactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-3">
            <p className="text-sm">{post.content}</p>
          </div>

          {/* Media Preview */}
          <div className="mb-3">
            {post.media.map((media, mediaIndex) => (
              <div
                key={mediaIndex}
                className="relative bg-muted rounded-lg p-4 text-center"
              >
                <div className="text-4xl mb-2">
                  {media.type === "360-image" && "🌐"}
                  {media.type === "360-video" && "📹"}
                  {media.type === "3d-model" && "🎨"}
                  {media.type === "image" && "🖼️"}
                  {media.type === "video" && "▶️"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {media.type.replace("-", " ").toUpperCase()}
                </p>

                {/* VR/AR specific controls */}
                {(isVRMode || isARMode) && (
                  <div className="flex justify-center gap-2 mt-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <RotateCw className="w-3 h-3" />
                    </Button>
                    {media.type.includes("3d") && (
                      <Button size="sm" variant="ghost">
                        <Move3D className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interaction Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className={post.interactions.liked ? "text-red-500" : ""}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpatialInteraction(post.id, "like");
                }}
              >
                <Heart className="w-4 h-4" />
                <span className="ml-1 text-xs">{post.interactions.likes}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpatialInteraction(post.id, "comment");
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="ml-1 text-xs">
                  {post.interactions.comments}
                </span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpatialInteraction(post.id, "share");
                }}
              >
                <Share className="w-4 h-4" />
                <span className="ml-1 text-xs">{post.interactions.shares}</span>
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              className={post.interactions.bookmarked ? "text-blue-500" : ""}
              onClick={(e) => {
                e.stopPropagation();
                handleSpatialInteraction(post.id, "bookmark");
              }}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>

          {/* Spatial Audio Control */}
          {post.spatialProperties.soundscape && (
            <div className="mt-2 pt-2 border-t">
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => setSpatialAudio(!spatialAudio)}
              >
                {spatialAudio ? (
                  <Volume2 className="w-4 h-4 mr-2" />
                ) : (
                  <VolumeX className="w-4 h-4 mr-2" />
                )}
                Spatial Audio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`spatial-post-viewer ${isVRMode ? "vr-mode" : ""} ${isARMode ? "ar-mode" : ""}`}
      style={{
        perspective: isVRMode || isARMode ? "1000px" : "none",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Spatial Navigation Controls */}
      {(isVRMode || isARMode) && (
        <div className="spatial-controls fixed top-4 left-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setImmersiveMode(!immersiveMode)}
            >
              {immersiveMode ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
            <span className="text-white text-xs">
              {isVRMode ? "VR Mode" : "AR Mode"}
            </span>
          </div>
        </div>
      )}

      {/* Posts Container */}
      <div
        className={`posts-container ${
          isVRMode || isARMode
            ? "spatial-layout"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        }`}
        style={{
          transform: isVRMode || isARMode ? "translateZ(0)" : "none",
          transformStyle: "preserve-3d",
        }}
      >
        {activePosts.map(renderSpatialPost)}
      </div>

      {/* Instructions for VR/AR mode */}
      {(isVRMode || isARMode) && (
        <div className="spatial-instructions fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-center">
          <p className="text-sm">
            {isVRMode
              ? "Use your VR controllers to point and select posts. Walk around to explore in 3D!"
              : "Move your device to explore AR content in your space. Tap to interact!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SpatialPostViewer;
