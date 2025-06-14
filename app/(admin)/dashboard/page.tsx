"use client";

import { useDashboardPresenter } from "@/presenter/admin/dashboard-presenter";
import { DashboardView } from "@/view/dashboard-view.tsx";

export default function DashboardPage() {
  const viewState = useDashboardPresenter();

  return <DashboardView {...viewState} />;
}
