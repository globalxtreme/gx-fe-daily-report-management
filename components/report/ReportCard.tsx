"use client";

import { NewReport, Report } from "@/types";
import {formatDateSlash, formatDateTime, formatDateTimeSlash, formatTime, getInitials, truncateSlack} from "@/lib/utils";
import styles from "./ReportCard.module.scss";

interface ReportCardProps {
  report: NewReport;
  hideDate?: boolean; // true on "by-date" view (date shown in group header)
  onClick: (report: NewReport) => void;
}

export default function ReportCard({ report, hideDate = false, onClick }: ReportCardProps) {
  return (
    <button className={styles.card} onClick={() => onClick(report)}>
      <div className={styles.left}>
        {/* Avatar */}
        <div className={styles.avatar}>{getInitials(report.employee.fullName)}</div>

        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{report.employee.fullName}</span>
            <span className={styles.mood}>{report.mood}</span>
          </div>
          <div className={styles.preview} dangerouslySetInnerHTML={{__html: truncateSlack(report.completedYesterday, 80)}} />
        </div>
      </div>
      <div className={styles.middle}>
        <p className={styles.date}>Report for : {formatDateSlash(report.reportDate)}</p>
      </div>
      <div className={styles.right}>
        <p className={styles.date}>Complated at : {hideDate ? formatTime(report.completedAt) : formatDateTimeSlash(report.completedAt)}</p>
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
