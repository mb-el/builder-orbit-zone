import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image, 
  Video, 
  Smile, 
  MapPin, 
  Users 
} from "lucide-react";
import { useState } from "react";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind, John?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-[50px] border-none resize-none shadow-none focus-visible:ring-0 p-0 text-base placeholder:text-muted-foreground"
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-4">
                {/* Media Upload Options */}
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                    <Image className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950">
                    <Smile className="w-5 h-5 mr-2" />
                    Feeling
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location
                  </Button>
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
                    <Users className="w-5 h-5 mr-2" />
                    Tag Friends
                  </Button>
                </div>
                
                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Public</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      disabled={!content.trim()}
                      className="px-6"
                    >
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

export default CreatePost;
