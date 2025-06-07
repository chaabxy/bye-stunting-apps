import { DashboardView } from "@/view/dashboard-view.tsx";

export default function DashboardPage() {
  const stats = {
    childrenCount: 120,
    measurementsCount: 340,
    articlesCount: 15,
  };

  const quickActions = [
    {
      label: "Tambah Artikel",
      icon: "Plus",
      onClick: () => alert("Tambah Artikel diklik"),
    },
    {
      label: "Lihat Data",
      icon: "Database",
      onClick: () => alert("Lihat Data diklik"),
    },
  ];

  return (
    <DashboardView stats={stats} loading={false} quickActions={quickActions} />
  );
}
