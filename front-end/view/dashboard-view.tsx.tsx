import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Database,
  TrendingUp,
  Plus,
  Network,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DashboardViewState } from "../presenter/admin/dashboard-presenter";
import { ProvinceStatsCard } from "@/components/province-stats-card";
// Map string icon names to actual components
const iconMap = {
  FileText,
  Database,
  TrendingUp,
  Plus,
  Network,
};

export const DashboardView: React.FC<DashboardViewState> = ({
  stats,
  edukasiPopuler,
  unreadMessages,
  lastStuntingRecords,
  loading,
  error = {
    edukasiPopuler: null,
    unreadMessages: null,
    lastStuntingRecords: null,
  },
  quickActions,
}) => {
  // Helper function to render loading skeleton
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );

  // Ensure error object exists with default values
  const safeError = error || {
    edukasiPopuler: null,
    unreadMessages: null,
    lastStuntingRecords: null,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-secondary from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold mb-2">
              Dashboard Admin ByeStunting 👋
            </h1>
            <p className="text-blue-100 max-sm:text-center text-md md:text-lg">
              Kelola platform pencegahan stunting dengan mudah
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Ringkasan Aktivitas */}
      <Card className="bg-input">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Ringkasan Aktivitas</span>
          </CardTitle>
          <CardDescription>
            Aktivitas terkini platform ByeStunting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Edukasi Terpopuler */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-semibold text-blue-600 mb-1">
                Edukasi Terpopuler
              </div>
              {loading.edukasiPopuler ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-blue-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-blue-200 rounded w-1/2 mx-auto" />
                </div>
              ) : safeError.edukasiPopuler ? (
                <div className="text-sm text-red-500">
                  Error: Gagal memuat data
                </div>
              ) : (
                <>
                  <div className="text-sm text-blue-700">
                    {edukasiPopuler?.length > 0
                      ? edukasiPopuler[0].title
                      : "Belum ada artikel"}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {edukasiPopuler?.length > 0
                      ? `${edukasiPopuler[0].view_count} views`
                      : "0 views"}
                  </div>
                </>
              )}
            </div>
            {/* Pesan Baru */}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-semibold text-orange-600 mb-1">
                Pesan Baru
              </div>
              {loading.unreadMessages ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-orange-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-orange-200 rounded w-1/2 mx-auto" />
                </div>
              ) : safeError.unreadMessages ? (
                <div className="text-sm text-red-500">
                  Error: Gagal memuat data
                </div>
              ) : (
                <>
                  <div className="text-sm text-orange-700">
                    {unreadMessages?.count || 0} pesan belum dibaca
                  </div>
                  <div className="text-xs text-orange-600 mt-1">Hari ini</div>
                </>
              )}
            </div>
            {/* Data Terbaru */}
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-lg font-semibold text-emerald-600 mb-1">
                Data Terbaru
              </div>
              {loading.lastStuntingRecords ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-emerald-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-emerald-200 rounded w-1/2 mx-auto" />
                </div>
              ) : safeError.lastStuntingRecords ? (
                <div className="text-sm text-red-500">
                  Error: Gagal memuat data
                </div>
              ) : (
                <>
                  <div className="text-sm text-emerald-700">
                    {lastStuntingRecords?.length > 0
                      ? `Pemeriksaan Anak Bernama: ${lastStuntingRecords[0].childName}`
                      : "Belum ada pemeriksaan"}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1">
                    {lastStuntingRecords?.length > 0
                      ? new Date(
                          lastStuntingRecords[0].createdAt ||
                            lastStuntingRecords[0].created_at ||
                            ""
                        ).toLocaleString()
                      : "Tidak ada data"}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Province mengambil 1 kolom */}
        <div>
          <ProvinceStatsCard />
        </div>
      </div>

      {/* Connection Error Alert */}
      {(safeError.edukasiPopuler ||
        safeError.unreadMessages ||
        safeError.lastStuntingRecords) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Terjadi masalah koneksi ke server backend. Pastikan server berjalan
            di https://be-byestunting-production.up.railway.app/
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
