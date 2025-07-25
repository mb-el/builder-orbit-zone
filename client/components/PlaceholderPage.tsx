import Layout from "./Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
              <Link to="/">\n                <Button variant="outline" className="gap-2">\n                  <ArrowLeft className="w-4 h-4" />\n                  Back to Home\n                </Button>\n              </Link>\n              <Button>\n                Continue Building\n              </Button>\n            </div>\n          </CardContent>\n        </Card>\n      </div>\n    </Layout>\n  );\n};\n\nexport default PlaceholderPage;