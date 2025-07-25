import PlaceholderPage from "@/components/PlaceholderPage";
import { MessageCircle } from "lucide-react";

export default function Messages() {
  return (
    <PlaceholderPage
      title="Messages & Chat"
      description="Real-time messaging with support for text, voice notes, photos, videos, and audio/video calls. Connect with friends and family instantly."
      icon={<MessageCircle className="w-12 h-12 text-green-500" />}
    />
  );
}
