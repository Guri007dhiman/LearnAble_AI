import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  onClick?: () => void;
}

export const ModuleCard = ({ title, description, icon: Icon, comingSoon, onClick }: ModuleCardProps) => {
  return (
    <Card 
      className={`module-card ${comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
      onClick={comingSoon ? undefined : onClick}
    >
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 p-3 bg-gradient-to-br from-primary to-primary-glow rounded-2xl">
          <Icon className="w-full h-full text-white" />
        </div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {comingSoon && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
            Coming Soon
          </span>
        )}
      </CardHeader>
      <CardContent>
        <CardDescription className="reading-text text-center">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};