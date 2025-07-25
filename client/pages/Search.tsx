import PlaceholderPage from "@/components/PlaceholderPage";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Search() {
  const { t } = useTranslation();

  return (
    <PlaceholderPage
      title={`${t('search')} & Discover`}
      description={t('search_discover_desc')}
      icon={<SearchIcon className="w-12 h-12 text-blue-500" />}
    />
  );
}
