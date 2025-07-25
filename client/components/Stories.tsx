import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

const Stories = () => {
  const stories = [
    { id: 1, username: "Your Story", avatar: "/placeholder.svg", isOwn: true },
    { id: 2, username: "alice_wonder", avatar: "/placeholder.svg" },
    { id: 3, username: "bob_creator", avatar: "/placeholder.svg" },
    { id: 4, username: "emma_travels", avatar: "/placeholder.svg" },
    { id: 5, username: "mike_fitness", avatar: "/placeholder.svg" },
    { id: 6, username: "sarah_cook", avatar: "/placeholder.svg" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide p-4 bg-card rounded-lg">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
          <div className={`relative ${story.isOwn ? '' : 'p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full'}`}>
            <Avatar className={`w-16 h-16 ${story.isOwn ? 'border-2 border-dashed border-muted-foreground' : 'border-2 border-background'}`}>
              <AvatarImage src={story.avatar} />
              <AvatarFallback>{story.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {story.isOwn && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                <Plus className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <span className="text-xs text-center max-w-[70px] truncate group-hover:text-primary transition-colors">
            {story.isOwn ? "Your Story" : story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
