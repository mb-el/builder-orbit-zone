import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Image } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Stories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);

  const stories = [
    { 
      id: 1, 
      username: "Your Story", 
      avatar: "/placeholder.svg", 
      isOwn: true,
      hasStory: false,
      lastUpdated: null
    },
    { 
      id: 2, 
      username: "alice_wonder", 
      avatar: "/placeholder.svg",
      hasStory: true,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isViewed: false
    },
    { 
      id: 3, 
      username: "bob_creator", 
      avatar: "/placeholder.svg",
      hasStory: true,
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isViewed: true
    },
    { 
      id: 4, 
      username: "emma_travels", 
      avatar: "/placeholder.svg",
      hasStory: true,
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isViewed: false
    },
    { 
      id: 5, 
      username: "mike_fitness", 
      avatar: "/placeholder.svg",
      hasStory: true,
      lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isViewed: true
    },
    { 
      id: 6, 
      username: "sarah_cook", 
      avatar: "/placeholder.svg",
      hasStory: true,
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isViewed: false
    },
  ];

  const handleStoryClick = (story: any) => {
    if (story.isOwn && !story.hasStory) {
      // Open create story options
      navigate('/camera');
    } else if (story.hasStory) {
      // Open story viewer
      setSelectedStory(story);
      setShowStoryViewer(true);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide p-4 bg-card rounded-lg">
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group"
            onClick={() => handleStoryClick(story)}
          >
            <div className={`relative transition-transform group-hover:scale-105 ${
              story.isOwn && !story.hasStory
                ? 'hover:opacity-80' 
                : story.hasStory && !story.isViewed
                ? 'p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full'
                : story.hasStory && story.isViewed
                ? 'p-0.5 bg-gradient-to-tr from-gray-400 to-gray-500 rounded-full'
                : ''
            }`}>
              <Avatar className={`w-16 h-16 ${
                story.isOwn && !story.hasStory
                  ? 'border-2 border-dashed border-muted-foreground hover:border-primary'
                  : 'border-2 border-background'
              }`}>
                <AvatarImage src={story.avatar} />
                <AvatarFallback>{story.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              {story.isOwn && !story.hasStory && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background group-hover:bg-primary/80 transition-colors">
                  <Plus className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {story.hasStory && story.lastUpdated && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-full px-1.5 py-0.5">
                  <span className="text-xs text-muted-foreground">
                    {getTimeAgo(story.lastUpdated)}
                  </span>
                </div>
              )}
            </div>
            
            <span className="text-xs text-center max-w-[70px] truncate group-hover:text-primary transition-colors">
              {story.isOwn ? t('your_story') : story.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {showStoryViewer && selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto bg-black">
            {/* Story Header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedStory.avatar} />
                  <AvatarFallback>{selectedStory.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">{selectedStory.username}</p>
                  <p className="text-white/70 text-xs">{getTimeAgo(selectedStory.lastUpdated)}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStoryViewer(false)}
                className="text-white hover:bg-white/20"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </Button>
            </div>

            {/* Story Progress Bar */}
            <div className="absolute top-12 left-4 right-4 z-10">
              <div className="w-full h-0.5 bg-white/30 rounded-full">
                <div className="h-full bg-white rounded-full w-full"></div>
              </div>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-12 h-12" />
                </div>
                <p className="text-lg font-bold">Story Content</p>
                <p className="text-sm opacity-80">This is a sample story from {selectedStory.username}</p>
              </div>
            </div>

            {/* Story Actions */}
            <div className="absolute bottom-8 left-4 right-4 z-10 flex gap-4">
              <input
                type="text"
                placeholder="Reply to story..."
                className="flex-1 bg-white/20 text-white placeholder-white/70 px-4 py-2 rounded-full outline-none"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
