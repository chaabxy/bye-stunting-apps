"use client";

// Presenter: Mediates between Model and View

import { useEffect, useState } from "react";
import { DashboardModel, type DashboardStats } from "../../model/admin/dashboard-model";

export interface DashboardViewState {
  stats: DashboardStats;
  loading: boolean;
  quickActions: ReturnType<DashboardModel["getQuickActions"]>;
}

export function useDashboardPresenter() {
  const [viewState, setViewState] = useState<DashboardViewState>({
    stats: { articles: 0, videos: 0, healthData: 0 },
    loading: true,
    quickActions: [],
  });

  useEffect(() => {
    const model = new DashboardModel();
    const quickActions = model.getQuickActions();

    setViewState((prev) => ({ ...prev, quickActions }));

    const fetchData = async () => {
      try {
        const stats = await model.fetchStats();
        setViewState((prev) => ({ ...prev, stats, loading: false }));
      } catch (error) {
        console.error("Error in presenter:", error);
        setViewState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return viewState;
}
