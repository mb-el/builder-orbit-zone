import PlaceholderPage from "@/components/PlaceholderPage";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Notifications() {
  const { t } = useTranslation();

  return (
    <PlaceholderPage
      title={t('notifications')}
      description={t('notifications_desc')}
      icon={<Heart className="w-12 h-12 text-pink-500" />}
    />
  );
}
