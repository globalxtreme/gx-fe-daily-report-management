"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import {
  Report,
  ReportsByUser,
  ReportsByDate,
  ListResponse,
  ViewMode,
  ReportFilters,
  NewListResponse,
} from "@/types";

interface UseReportsReturn {
  reports: Report[];
  reportsByUser: ReportsByUser[];
  reportsByDate: ReportsByDate[];
  meta: { currentPage: number; perPage: number; total: number } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReports(view: ViewMode, filters: ReportFilters): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsByUser, setReportsByUser] = useState<ReportsByUser[]>([]);
  const [reportsByDate, setReportsByDate] = useState<ReportsByDate[]>([]);
  const [meta, setMeta] = useState<{ currentPage: number; perPage: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!filters.fromDate || !filters.toDate) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        if (view === "all") {
          const res = await api.get<NewListResponse<Report>>("/daily-reports", {
            params: {
              sort: filters.sort,
              page: filters.page,
              limit: filters.limit,
            },
          });
          if (!cancelled) {
            setReports(res.data.result);
            setReportsByUser([]);
            setReportsByDate([]);
            setMeta(res.data.pagination);
          }
        } else if (view === "by-user") {
          const res = await api.get<NewListResponse<ReportsByUser>>("/reports/by-user", {
            params: {
              fromDate: filters.fromDate,
              toDate: filters.toDate,
              sortBy: "completedAt",
              sort: filters.sort,
              page: filters.page,
              limit: filters.limit,
            },
          });
          if (!cancelled) {
            setReports([]);
            setReportsByUser(res.data.result);
            setReportsByDate([]);
            setMeta(res.data.pagination);
          }
        } else {
          const res = await api.get<NewListResponse<ReportsByDate>>("/reports/by-date", {
            params: {
              fromDate: filters.fromDate,
              toDate: filters.toDate,
              page: filters.page,
              limit: filters.limit,
            },
          });
          if (!cancelled) {
            setReports([]);
            setReportsByUser([]);
            setReportsByDate(res.data.result);
            setMeta(res.data.pagination);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load reports";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [view, filters.fromDate, filters.toDate, filters.sort, filters.page, filters.limit, tick]);

  return { reports, reportsByUser, reportsByDate, meta, loading, error, refetch };
}
