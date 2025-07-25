import PlaceholderPage from "@/components/PlaceholderPage";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <PlaceholderPage
      title="Your Profile"
      description="Manage your profile, view your posts and activity, customize your settings, and see your follower analytics. Your personal space on SocialFusion."
      icon={<User className="w-12 h-12 text-orange-500" />}
    />
  );
}
