"use client";

import { Report } from "@/types";
import {formatDateTime, formatTime, getInitials, truncateSlack} from "@/lib/utils";
import styles from "./ReportCard.module.scss";

interface ReportCardProps {
  report: Report;
  hideDate?: boolean; // true on "by-date" view (date shown in group header)
  onClick: (report: Report) => void;
}

export default function ReportCard({ report, hideDate = false, onClick }: ReportCardProps) {
  return (
    <button className={styles.card} onClick={() => onClick(report)}>
      <div className={styles.left}>
        {/* Avatar */}
        <div className={styles.avatar}>{getInitials(report.user.name)}</div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{report.user.name}</span>
            <span className={styles.mood}>{report.mood}</span>
          </div>
          <div className={styles.preview} dangerouslySetInnerHTML={{__html: truncateSlack(report.completedYesterday, 80)}} />
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.date}>
          {hideDate ? formatTime(report.completedAt) : formatDateTime(report.completedAt)}
        </span>
        <svg
          className={styles.chevron}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
}
