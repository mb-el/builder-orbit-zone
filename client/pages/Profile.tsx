import PlaceholderPage from "@/components/PlaceholderPage";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();

  return (
    <PlaceholderPage
      title={`Your ${t("profile")}`}
      description={t("profile_desc")}
      icon={<User className="w-12 h-12 text-orange-500" />}
    />
  );
}
