// Component for displaying statistics

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Database,
  TrendingUp,
  Plus,
  Network,
  Wifi,
  Gauge,
  Activity,
  GalleryHorizontalEnd,
} from "lucide-react";

export interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
  className?: string;
}

const iconMap = {
  FileText,
  Database,
  TrendingUp,
  Plus,
  Network,
  Wifi,
  Gauge,
  Activity,
  GalleryHorizontalEnd,
};

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div
      className={`absolute inset-0 bg-input ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
    />
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{description}</p>
    </CardContent>
  </Card>
);
