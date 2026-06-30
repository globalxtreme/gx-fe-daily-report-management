"use client";

import { Report, ReportsByEmployee, ReportsByDate, ViewMode } from "@/types";
import ReportCard from "./ReportCard";
import ReportGroup from "./ReportGroup";
import styles from "./ReportList.module.scss";
import { formatDateSlash } from "@/lib/utils";

interface ReportListProps {
  view: ViewMode;
  reports: Report[];
  reportsByEmployee: ReportsByEmployee[];
  reportsByDate: ReportsByDate[];
  meta: { currentPage: number; perPage: number; total: number } | null;
  loading: boolean;
  error: string | null;
  onCardClick: (report: Report) => void;
  onPageChange: (perPage: number) => void;
  refetch: () => void;
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-muted)" }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <p className={styles.emptyText}>No reports found</p>
      <p className={styles.emptySubtext}>Try adjusting the date range or filters.</p>
    </div>
  );
}

function SkeletonCards({ count = 5 }: { count?: number }) {
  return (
    <div className={styles.skeletonList}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}

export default function ReportList({
  view,
  reports,
  reportsByEmployee,
  reportsByDate,
  meta,
  loading,
  error,
  onCardClick,
  onPageChange,
  refetch,
}: ReportListProps) {
  if (loading) return <SkeletonCards />;

  if (error) {
    return (
      <div className={styles.error}>
        <p className={styles.errorTitle}>Failed to load reports</p>
        <p className={styles.errorMsg}>{error}</p>
      </div>
    );
  }

  const isEmpty =
    (view === "all" && reports.length === 0) ||
    (view === "by-employee" && reportsByEmployee.length === 0) ||
    (view === "by-date" && reportsByDate.length === 0);

  if (isEmpty) return <EmptyState />;

  const totalPages = meta ? Math.ceil(meta.total / meta.perPage) : 1;
  const currentPage = meta?.currentPage ?? 1;

  return (
    <div className={styles.wrapper}>
      {/* ── All Reports ── */}
      {view === "all" && (
        <div className={styles.list}>
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} onClick={onCardClick} />
          ))}
        </div>
      )}

      {/* ── By User ── */}
      {view === "by-employee" &&
        reportsByEmployee.map((group) => (
          <ReportGroup
            key={group.employeeId}
            label={group.employee.fullName}
            count={group.count}
          >
            {group.dailyReports.map((r) => (
              <ReportCard key={r.id} report={r} onClick={onCardClick} />
            ))}
          </ReportGroup>
        ))}

      {/* ── By Date ── */}
      {view === "by-date" &&
        reportsByDate.map((group) => (
          <ReportGroup
            key={group.date}
            label={formatDateSlash(group.date)}
            count={group.count}
          >
            {group.dailyReports.map((r) => (
              <ReportCard key={r.id} report={r} hideDate onClick={onCardClick} />
            ))}
          </ReportGroup>
        ))}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
