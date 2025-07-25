import PlaceholderPage from "@/components/PlaceholderPage";
import { PlusSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Create() {
  const { t } = useTranslation();

  return (
    <PlaceholderPage
      title={`${t("create")} Content`}
      description={t("create_content_desc")}
      icon={<PlusSquare className="w-12 h-12 text-purple-500" />}
    />
  );
}
