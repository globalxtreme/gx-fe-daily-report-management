"use client";

import { Report, ReportsByUser, ReportsByDate, ViewMode, NewReport } from "@/types";
import { formatDateLong } from "@/lib/utils";
import ReportCard from "./ReportCard";
import ReportGroup from "./ReportGroup";
import styles from "./ReportList.module.scss";
import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import ReportUpdateModal from "./ReportUpdateModal";

interface ReportListProps {
  view: ViewMode;
  reports: NewReport[];
  reportsByUser: ReportsByUser[];
  reportsByDate: ReportsByDate[];
  meta: { currentPage: number; perPage: number; total: number } | null;
  loading: boolean;
  error: string | null;
  onCardClick: (report: NewReport) => void;
  onPageChange: (perPage: number) => void;
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
  reportsByUser,
  reportsByDate,
  meta,
  loading,
  error,
  onCardClick,
  onPageChange,
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
    (view === "by-user" && reportsByUser.length === 0) ||
    (view === "by-date" && reportsByDate.length === 0);

  if (isEmpty) return <EmptyState />;

  const totalPages = meta ? Math.ceil(meta.total / meta.perPage) : 1;
  const currentPage = meta?.currentPage ?? 1;
  const [openUpdate, setOpenUpdate] = useState(false)

  return (
    <div className={styles.wrapper}>
      <button className={styles.editReportBtn} onClick={() => setOpenUpdate(true)}>
        <CiEdit size={20}/>
        Update Report
      </button>
      <ReportUpdateModal
      open={openUpdate}
      onClose={() => setOpenUpdate(false)}
      onSubmit={(data) => {
        console.log(data);
        setOpenUpdate(false);
      }}
      />
      {/* ── All Reports ── */}
      {view === "all" && (
        <div className={styles.list}>
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} onClick={onCardClick} />
          ))}
        </div>
      )}

      {/* ── By User ── */}
      {/* {view === "by-user" &&
        reportsByUser.map((group) => (
          <ReportGroup
            key={group.user.id}
            label={group.user.name}
            count={group.reports.length}
          >
            {group.reports.map((r) => (
              <ReportCard key={r.id} report={r} onClick={onCardClick} />
            ))}
          </ReportGroup>
        ))} */}

      {/* ── By Date ── */}
      {/* {view === "by-date" &&
        reportsByDate.map((group) => (
          <ReportGroup
            key={group.date}
            label={formatDateLong(group.date)}
            count={group.reports.length}
          >
            {group.reports.map((r) => (
              <ReportCard key={r.id} report={r} hideDate onClick={onCardClick} />
            ))}
          </ReportGroup>
        ))} */}

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
