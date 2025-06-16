"use client";

// Presenter: Mediates between Model and View

import { useEffect, useState } from "react";
import {
  DashboardModel,
  type DashboardStats,
  type EdukasiPopuler,
  type UnreadMessagesSummary,
  type StuntingRecord,
} from "../../model/admin/dashboard-model";

export interface DashboardViewState {
  stats: DashboardStats;
  edukasiPopuler: EdukasiPopuler[];
  unreadMessages: UnreadMessagesSummary;
  lastStuntingRecords: StuntingRecord[];
  loading: {
    stats: boolean;
    edukasiPopuler: boolean;
    unreadMessages: boolean;
    lastStuntingRecords: boolean;
  };
  error: {
    edukasiPopuler: string | null;
    unreadMessages: string | null;
    lastStuntingRecords: string | null;
  };
  quickActions: ReturnType<DashboardModel["getQuickActions"]>;
}

export function useDashboardPresenter() {
  const [viewState, setViewState] = useState<DashboardViewState>({
    stats: { articles: 0, videos: 0, healthData: 0 },
    edukasiPopuler: [],
    unreadMessages: { count: 0, messages: [] },
    lastStuntingRecords: [],
    loading: {
      stats: true,
      edukasiPopuler: true,
      unreadMessages: true,
      lastStuntingRecords: true,
    },
    error: {
      edukasiPopuler: null,
      unreadMessages: null,
      lastStuntingRecords: null,
    },
    quickActions: [],
  });

  useEffect(() => {
    const model = new DashboardModel();
    const quickActions = model.getQuickActions();

    setViewState((prev) => ({ ...prev, quickActions }));

    // Fetch stats separately
    const fetchStats = async () => {
      try {
        console.log("🔄 Fetching dashboard stats...");
        const stats = await model.fetchStats();
        console.log("✅ Dashboard stats fetched successfully");
        setViewState((prev) => ({
          ...prev,
          stats,
          loading: { ...prev.loading, stats: false },
        }));
      } catch (error) {
        console.error("❌ Error fetching dashboard stats:", error);
        setViewState((prev) => ({
          ...prev,
          loading: { ...prev.loading, stats: false },
        }));
      }
    };

    // Fetch popular education separately
    const fetchEdukasiPopuler = async () => {
      try {
        console.log("🔄 Fetching popular education...");
        const edukasiPopuler = await model.fetchEdukasiPopuler();
        console.log(
          "✅ Popular education fetched successfully:",
          edukasiPopuler
        );

        setViewState((prev) => ({
          ...prev,
          edukasiPopuler,
          loading: { ...prev.loading, edukasiPopuler: false },
          error: { ...prev.error, edukasiPopuler: null },
        }));
      } catch (error) {
        console.error("❌ Error fetching popular education:", error);
        setViewState((prev) => ({
          ...prev,
          loading: { ...prev.loading, edukasiPopuler: false },
          error: {
            ...prev.error,
            edukasiPopuler:
              error instanceof Error
                ? error.message
                : "Failed to fetch popular education",
          },
        }));
      }
    };

    // Fetch unread messages separately
    const fetchUnreadMessages = async () => {
      try {
        console.log("🔄 Fetching unread messages...");
        const unreadMessages = await model.fetchUnreadMessages();
        console.log("✅ Unread messages fetched successfully");
        setViewState((prev) => ({
          ...prev,
          unreadMessages,
          loading: { ...prev.loading, unreadMessages: false },
          error: { ...prev.error, unreadMessages: null },
        }));
      } catch (error) {
        console.error("❌ Error fetching unread messages:", error);
        setViewState((prev) => ({
          ...prev,
          loading: { ...prev.loading, unreadMessages: false },
          error: {
            ...prev.error,
            unreadMessages:
              error instanceof Error
                ? error.message
                : "Failed to fetch unread messages",
          },
        }));
      }
    };

    // Fetch last stunting records separately
    const fetchLastStuntingRecords = async () => {
      try {
        console.log("🔄 Fetching last stunting records...");
        const lastStuntingRecords = await model.fetchLastStuntingRecords();
        console.log("✅ Last stunting records fetched successfully");
        setViewState((prev) => ({
          ...prev,
          lastStuntingRecords,
          loading: { ...prev.loading, lastStuntingRecords: false },
          error: { ...prev.error, lastStuntingRecords: null },
        }));
      } catch (error) {
        console.error("❌ Error fetching last stunting records:", error);
        setViewState((prev) => ({
          ...prev,
          loading: { ...prev.loading, lastStuntingRecords: false },
          error: {
            ...prev.error,
            lastStuntingRecords:
              error instanceof Error
                ? error.message
                : "Failed to fetch stunting records",
          },
        }));
      }
    };

    // Execute all fetch operations in parallel
    fetchStats();
    fetchEdukasiPopuler();
    fetchUnreadMessages();
    fetchLastStuntingRecords();
  }, []);

  return viewState;
}
