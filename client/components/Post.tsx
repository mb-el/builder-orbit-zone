import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import VideoPlayer from "./VideoPlayer";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Flag,
  UserMinus,
  Copy,
  ExternalLink,
  Download,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PostProps {
  id: number;
  username: string;
  avatar: string;
  location?: string;
  timeAgo: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    aspectRatio?: string;
  };
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

const Post = ({ 
  username, 
  avatar, 
  location, 
  timeAgo, 
  content, 
  media, 
  likes, 
  comments, 
  isLiked = false, 
  isSaved = false 
}: PostProps) => {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likesCount, setLikesCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    
    // Show toast feedback with animation
    toast({
      description: liked ? "Removed from likes ❤️" : "Added to likes! ❤️",
      duration: 1500,
    });
  };

  const handleComment = () => {
    setShowComments(!showComments);
    toast({
      description: "Comments section opened 💬",
      duration: 1500,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Post by ${username}`,
      text: content,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          description: "Link copied to clipboard! 🔗",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log('Sharing failed:', error);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast({
      description: saved ? "Removed from saved posts 📌" : "Post saved! 📌",
      duration: 1500,
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      description: isFollowing ? `Unfollowed ${username}` : `Following ${username}! 👥`,
      duration: 2000,
    });
  };

  const handleReport = () => {
    toast({
      description: "Post reported. Thank you for helping keep our community safe! 🛡️",
      duration: 3000,
    });
  };

  const handleHidePost = () => {
    toast({
      description: "Post hidden. You won't see posts like this in your feed. 👁️",
      duration: 3000,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        description: "Post link copied to clipboard! 🔗",
        duration: 2000,
      });
    } catch (error) {
      toast({
        description: "Failed to copy link",
        duration: 2000,
      });
    }
  };

  const handleDownload = () => {
    if (media?.url) {
      const link = document.createElement('a');
      link.href = media.url;
      link.download = `${username}-post-${Date.now()}.${media.type === 'image' ? 'jpg' : 'mp4'}`;
      link.click();
      
      toast({
        description: "Download started! 📥",
        duration: 2000,
      });
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={avatar} />
              <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm hover:underline cursor-pointer transition-all hover:text-primary">
                  {username}
                </span>
                {location && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                      {location}
                    </span>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-accent">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleFollow} className="cursor-pointer">
                {isFollowing ? (
                  <UserMinus className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                <span>{isFollowing ? `Unfollow ${username}` : `Follow ${username}`}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2" />
                <span>Go to post</span>
              </DropdownMenuItem>
              {media && (
                <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download {media.type}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleHidePost} className="cursor-pointer">
                <EyeOff className="w-4 h-4 mr-2" />
                <span>Hide post</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReport} className="text-red-600 cursor-pointer">
                <Flag className="w-4 h-4 mr-2" />
                <span>Report post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Media */}
        {media && (
          <div className="relative bg-muted group">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt="Post content"
                className="w-full h-auto max-h-[600px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                style={{ aspectRatio: media.aspectRatio || 'auto' }}
                onDoubleClick={handleLike}
              />
            ) : (
              <VideoPlayer
                src={media.url}
                poster={media.url}
                className="w-full"
                showControls={true}
                autoPlay={false}
                muted={true}
              />
            )}
            
            {/* Double-tap like animation overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* This would show a heart animation on double-tap */}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-8 h-8 p-0 transition-all hover:scale-110 ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
                onClick={handleLike}
              >
                <Heart 
                  className={`w-6 h-6 transition-all ${
                    liked ? 'fill-red-500 text-red-500 animate-pulse' : 'text-foreground'
                  }`} 
                />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 p-0 transition-all hover:scale-110 hover:text-blue-500"
                onClick={handleComment}
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 p-0 transition-all hover:scale-110 hover:text-green-500"
                onClick={handleShare}
              >
                <Share className="w-6 h-6" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`w-8 h-8 p-0 transition-all hover:scale-110 ${saved ? 'text-blue-500' : 'hover:text-blue-500'}`}
              onClick={handleSave}
            >
              <Bookmark 
                className={`w-6 h-6 transition-all ${
                  saved ? 'fill-current text-blue-500' : 'text-foreground'
                }`} 
              />
            </Button>
          </div>

          {/* Post Stats */}
          <div className="space-y-2">
            <div className="text-sm font-semibold hover:text-primary cursor-pointer transition-colors">
              {likesCount.toLocaleString()} {t('likes')}
            </div>
            
            {/* Post Content */}
            <div className="text-sm">
              <span className="font-semibold mr-2 hover:underline cursor-pointer transition-all hover:text-primary">
                {username}
              </span>
              <span>{content}</span>
            </div>
            
            {/* Comments Link */}
            <button 
              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
              onClick={handleComment}
            >
              {t('view_all_comments', { count: comments })}
            </button>
            
            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Comments</div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowComments(false)}
                    className="text-xs"
                  >
                    Hide
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Sample comments */}
                  <div className="flex items-start gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium hover:underline cursor-pointer">alice_wonder</span>
                        <span className="text-xs text-muted-foreground">2h</span>
                      </div>
                      <p className="text-sm">Amazing content! Love this! 🔥</p>
                      <div className="flex items-center gap-3 mt-1">
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          {t('like')}
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>BC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium hover:underline cursor-pointer">bob_creator</span>
                        <span className="text-xs text-muted-foreground">1h</span>
                      </div>
                      <p className="text-sm">Thanks for sharing this! Really helpful.</p>
                      <div className="flex items-center gap-3 mt-1">
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          {t('like')}
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add Comment */}
                <div className="flex gap-3 mt-4 pt-3 border-t border-border/50">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background transition-all"
                    />
                    <Button size="sm" className="transition-all hover:scale-105">
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
