import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Play
} from "lucide-react";
import { useState } from "react";

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
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likesCount, setLikesCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatar} />
              <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm hover:underline cursor-pointer">
                  {username}
                </span>
                {location && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{location}</span>
                  </>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Post Media */}
        {media && (
          <div className="relative bg-muted">
            {media.type === 'image' ? (
              <img 
                src={media.url} 
                alt="Post content"
                className="w-full h-auto max-h-[600px] object-cover"
                style={{ aspectRatio: media.aspectRatio || 'auto' }}
              />
            ) : (
              <div className="relative">
                <video 
                  className="w-full h-auto max-h-[600px] object-cover"
                  poster={media.url}
                  style={{ aspectRatio: media.aspectRatio || '16/9' }}
                >
                  <source src={media.url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post Actions */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 p-0"
                onClick={handleLike}
              >
                <Heart 
                  className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
                />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                <MessageCircle className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0">
                <Share className="w-6 h-6" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 p-0"
              onClick={() => setSaved(!saved)}
            >
              <Bookmark 
                className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} 
              />
            </Button>
          </div>

          {/* Post Stats */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">
              {likesCount.toLocaleString()} likes
            </div>
            
            {/* Post Content */}
            <div className="text-sm">
              <span className="font-semibold mr-2">{username}</span>
              <span>{content}</span>
            </div>
            
            {/* Comments Link */}
            <button className="text-sm text-muted-foreground hover:underline">
              View all {comments} comments
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
