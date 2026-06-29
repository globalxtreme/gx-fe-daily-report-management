"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useReports } from "@/hooks/useReports";
import { ViewMode, SortOrder, ReportFilters, Report, AuthUser } from "@/types";
import { todayString, daysAgoString } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import ReportList from "@/components/report/ReportList";
import ReportDetail from "@/components/report/ReportDetail";
import styles from "./page.module.scss";
import { CiEdit } from "react-icons/ci";
import ReportUpdateModal from "@/components/report/ReportUpdateModal";

export default function DashboardPage() {
  const router = useRouter();
  const [openUpdate, setOpenUpdate] = useState(false);
  const { user, setUser } = useAuthStore();
  const [view, setView] = useState<ViewMode>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    fromDate: daysAgoString(7),
    toDate: todayString(),
    sort: "desc",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.replace(`${process.env.NEXT_PUBLIC_API_URL}/auth/redirect`);
      return;
    }
    if (!user) {
      api
        .get<AuthUser>("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          Cookies.remove("auth_token");
          router.replace(`${process.env.NEXT_PUBLIC_API_URL}/auth/redirect`);
        });
    }
  }, [user, setUser, router]);

  const { reports, reportsByEmployee, reportsByDate, meta, loading, error, refetch } = useReports(
    view,
    filters
  );

  function handleViewChange(v: ViewMode) {
    setView(v);
    setFilters((f) => ({ ...f, page: 1 }));
  }

  function handleFilterChange(patch: Partial<ReportFilters>) {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
  }

  function handlePageChange(page: number) {
    setFilters((f) => ({ ...f, page }));
  }

  async function handleExport() {
    const groupBy = view === "all" ? "none" : view === "by-user" ? "user" : "date";
    try {
      const res = await api.get("/reports/export", {
        params: {
          groupBy,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          sort: filters.sort,
        },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `daily-report-${todayString()}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengekspor laporan.");
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar activeView={view} onViewChange={handleViewChange} />
      <div className={styles.main}>
        <Topbar
          view={view}
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />
        <div className={styles.content}>
          <button
            className={styles.editReportBtn}
            onClick={() => setOpenUpdate(true)}
          >
            <CiEdit size={20} />
            Update Report
          </button>
          <ReportList
            view={view}
            reports={reports}
            reportsByEmployee={reportsByEmployee}
            reportsByDate={reportsByDate}
            meta={meta}
            loading={loading}
            error={error}
            onCardClick={setSelectedReport}
            onPageChange={handlePageChange}
            refetch={refetch}
          />
        </div>
      </div>
      <ReportUpdateModal
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          onSubmit={() => {
            refetch();
          }}
        />
      {selectedReport && (
        <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}
