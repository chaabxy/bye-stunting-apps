import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

type StatsCardsProps = {
  stats: {
    total: number;
    normal: number;
    berisiko: number;
    stunting: number;
  };
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-md font-medium text-blue-700">
              Total Data
            </CardTitle>
            <div className="text-2xl font-bold text-blue-900">
              {stats.total}
            </div>
          </div>
          <div className="p-3 bg-blue-500 rounded-full">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-md font-medium text-green-700">
              Status Normal
            </CardTitle>
            <div className="text-2xl font-bold text-green-900">
              {stats.normal}
            </div>
          </div>
          <div className="p-3 bg-green-500 rounded-full">
            <div className="h-4 w-4 bg-white rounded-full"></div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-md font-medium text-yellow-700">
              Berisiko
            </CardTitle>
            <div className="text-2xl font-bold text-yellow-900">
              {stats.berisiko}
            </div>
          </div>
          <div className="p-3 bg-yellow-500 rounded-full">
            <div className="h-4 w-4 bg-white rounded-full" />
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-md font-medium text-red-700">
              Stunting
            </CardTitle>
            <div className="text-2xl font-bold text-red-900">
              {stats.stunting}
            </div>
          </div>
          <div className="p-3 bg-red-500 rounded-full">
            <div className="h-4 w-4 bg-white rounded-full" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
