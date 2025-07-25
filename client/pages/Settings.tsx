import PlaceholderPage from "@/components/PlaceholderPage";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <PlaceholderPage
      title="Settings & Preferences"
      description="Manage your account settings, privacy preferences, notifications, and app configurations. Customize your SocialFusion experience to suit your needs."
      icon={<SettingsIcon className="w-12 h-12 text-gray-500" />}
    />
  );
}
