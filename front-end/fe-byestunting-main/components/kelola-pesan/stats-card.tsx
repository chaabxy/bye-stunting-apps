// View component for statistics cards
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  iconBgColor: string;
  textColor: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  gradientFrom,
  gradientTo,
  borderColor,
  iconBgColor,
  textColor,
}: StatsCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} border-${borderColor} shadow-lg hover:shadow-xl transition-all duration-200`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-md font-medium text-${textColor}`}>{title}</p>
            <p className={`mt-3 text-2xl font-bold text-${textColor}`}>
              {value}
            </p>
          </div>
          <div className={`p-3 bg-${iconBgColor} rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
