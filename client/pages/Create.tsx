import PlaceholderPage from "@/components/PlaceholderPage";
import { PlusSquare } from "lucide-react";

export default function Create() {
  return (
    <PlaceholderPage
      title="Create Content"
      description="Share your moments with posts, stories, reels, and live streams. Use powerful editing tools, filters, and effects to bring your content to life."
      icon={<PlusSquare className="w-12 h-12 text-purple-500" />}
    />
  );
}
