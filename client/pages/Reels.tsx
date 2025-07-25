import PlaceholderPage from "@/components/PlaceholderPage";
import { Video } from "lucide-react";

export default function Reels() {
  return (
    <PlaceholderPage
      title="Reels & Short Videos"
      description="Create and discover short-form videos with powerful editing tools, effects, and filters. Share your creativity with the world through engaging video content."
      icon={<Video className="w-12 h-12 text-red-500" />}
    />
  );
}
