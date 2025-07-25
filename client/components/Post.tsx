import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VideoPlayer from "./VideoPlayer";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Play
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
              <VideoPlayer
                src={media.url}
                poster={media.url}
                className="w-full"
                showControls={true}
                autoPlay={false}
                muted={true}
              />
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
              {likesCount.toLocaleString()} {t('likes')}
            </div>
            
            {/* Post Content */}
            <div className="text-sm">
              <span className="font-semibold mr-2">{username}</span>
              <span>{content}</span>
            </div>
            
            {/* Comments Link */}
            <button className="text-sm text-muted-foreground hover:underline">
              {t('view_all_comments', { count: comments })}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Post;
