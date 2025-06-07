import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface CampaignCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function CampaignCard({
  title,
  description,
  icon: Icon,
}: CampaignCardProps) {
  return (
    <div className="mx-auto">
      <Card className="bg-white transition-shadow w-[250px]">
        <CardContent className="p-5 shadow-[-4px_4px_0px_0px_rgba(170,209,242,1)] rounded-lg min-h-[258px] flex flex-col justify-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Icon className="h-10 w-10 text-[#317BC4]" />
            </div>
            <h3 className="font-bold text-base text-black leading-normal">
              {title}
            </h3>
          </div>
          <p className="text-gray-600 text-xs">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
