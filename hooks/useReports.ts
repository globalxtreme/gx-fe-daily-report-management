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
} from "@/types";

interface UseReportsReturn {
  reports: Report[];
  reportsByUser: ReportsByUser[];
  reportsByDate: ReportsByDate[];
  meta: { page: number; limit: number; total: number } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReports(view: ViewMode, filters: ReportFilters): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsByUser, setReportsByUser] = useState<ReportsByUser[]>([]);
  const [reportsByDate, setReportsByDate] = useState<ReportsByDate[]>([]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number } | null>(null);
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
          const res = await api.get<ListResponse<Report>>("/reports", {
            params: {
              sort: filters.sort,
              page: filters.page,
              limit: filters.limit,
            },
          });
          if (!cancelled) {
            setReports(res.data.data);
            setReportsByUser([]);
            setReportsByDate([]);
            setMeta(res.data.meta);
          }
        } else if (view === "by-user") {
          const res = await api.get<ListResponse<ReportsByUser>>("/reports/by-user", {
            params: {
              fromDate: filters.fromDate,
              toDate: filters.toDate,
              sortBy: "createdAt",
              sort: filters.sort,
              page: filters.page,
              limit: filters.limit,
            },
          });
          if (!cancelled) {
            setReports([]);
            setReportsByUser(res.data.data);
            setReportsByDate([]);
            setMeta(res.data.meta);
          }
        } else {
          const res = await api.get<ListResponse<ReportsByDate>>("/reports/by-date", {
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
            setReportsByDate(res.data.data);
            setMeta(res.data.meta);
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
