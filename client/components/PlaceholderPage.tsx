import Layout from "./Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const PlaceholderPage = ({
  title,
  description,
  icon = <Construction className="w-12 h-12 text-muted-foreground" />
}: PlaceholderPageProps) => {
  const { t } = useTranslation();
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-6 flex justify-center">
              {icon}
            </div>
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {description}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t('back_to_home')}
                </Button>
              </Link>
              <Button>
                {t('continue_building')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PlaceholderPage;
