import PlaceholderPage from "@/components/PlaceholderPage";
import { Heart } from "lucide-react";

export default function Notifications() {
  return (
    <PlaceholderPage
      title="Notifications"
      description="Stay updated with likes, comments, follows, mentions, and all your social activity. Never miss an important interaction with push notifications."
      icon={<Heart className="w-12 h-12 text-pink-500" />}
    />
  );
}
