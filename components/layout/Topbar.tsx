"use client";

import { ViewMode, ReportFilters, SortOrder } from "@/types";
import Select from "@/components/ui/Select";
import styles from "./Topbar.module.scss";

interface TopbarProps {
  view: ViewMode;
  filters: ReportFilters;
  onFilterChange: (patch: Partial<ReportFilters>) => void;
  onExport: () => void;
}

const VIEW_TITLES: Record<ViewMode, string> = {
  all: "All Reports",
  "by-user": "By User",
  "by-date": "By Date",
};

const SORT_OPTIONS = [
  { label: "Newest first", value: "desc" },
  { label: "Oldest first", value: "asc" },
];

export default function Topbar({ view, filters, onFilterChange, onExport }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{VIEW_TITLES[view]}</h1>

      <div className={styles.controls}>
        {/* Date Range */}
        <div className={styles.dateRange}>
          <div className={styles.dateField}>
            <label className={styles.label} htmlFor="fromDate">From</label>
            <input
              id="fromDate"
              type="date"
              className={styles.dateInput}
              value={filters.fromDate}
              max={filters.toDate}
              onChange={(e) => onFilterChange({ fromDate: e.target.value })}
            />
          </div>
          <span className={styles.dateSep}>—</span>
          <div className={styles.dateField}>
            <label className={styles.label} htmlFor="toDate">To</label>
            <input
              id="toDate"
              type="date"
              className={styles.dateInput}
              value={filters.toDate}
              min={filters.fromDate}
              onChange={(e) => onFilterChange({ toDate: e.target.value })}
            />
          </div>
        </div>

        {/* Sort — hidden for "by-date" because BE fixes it to ASC */}
        {view !== "by-date" && (
          <Select
            options={SORT_OPTIONS}
            value={filters.sort}
            onChange={(val) => onFilterChange({ sort: val as SortOrder })}
          />
        )}

        {/* Export */}
        <button className={styles.exportBtn} onClick={onExport}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export .docx
        </button>
      </div>
    </header>
  );
}
