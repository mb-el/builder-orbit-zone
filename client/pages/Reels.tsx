import PlaceholderPage from "@/components/PlaceholderPage";
import { Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Reels() {
  const { t } = useTranslation();

  return (
    <PlaceholderPage
      title={`${t('reels')} & Short Videos`}
      description={t('reels_videos_desc')}
      icon={<Video className="w-12 h-12 text-red-500" />}
    />
  );
}
