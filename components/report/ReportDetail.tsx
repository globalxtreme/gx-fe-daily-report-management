"use client";

import { Report } from "@/types";
import { formatDateTime, getInitials, isEmptyBlocker } from "@/lib/utils";
import Dialog from "@/components/ui/Dialog";
import styles from "./ReportDetail.module.scss";

interface ReportDetailProps {
  report: Report;
  onClose: () => void;
}

interface FieldProps {
  question: string;
  answer: string;
  muted?: boolean;
}

function Field({ question, answer, muted }: FieldProps) {
  return (
    <div className={styles.field}>
      <p className={styles.question}>{question}</p>
      <p className={`${styles.answer} ${muted ? styles.muted : ""}`}>{answer}</p>
    </div>
  );
}

export default function ReportDetail({ report, onClose }: ReportDetailProps) {
  const blockerEmpty = isEmptyBlocker(report.blockers);

  return (
    <Dialog open onClose={onClose} size="lg">
      {/* Header info */}
      <div className={styles.meta}>
        <div className={styles.avatar}>{getInitials(report.user.name)}</div>
        <div>
          <p className={styles.userName}>{report.user.name}</p>
          <p className={styles.dateTime}>{formatDateTime(report.createdAt)}</p>
        </div>
        <span className={styles.mood}>{report.mood}</span>
      </div>

      <div className={styles.divider} />

      {/* Q&A fields */}
      <div className={styles.fields}>
        <Field
          question="What did you complete yesterday?"
          answer={report.completedYesterday}
        />
        <Field
          question="What will you do today?"
          answer={report.planToday}
        />
        <Field
          question="When will you be finished with that?"
          answer={report.finishEstimation}
        />
        <Field
          question="Anything blocking your progress?"
          answer={blockerEmpty ? "No blockers" : report.blockers}
          muted={blockerEmpty}
        />
        <Field
          question="How do you feel today?"
          answer={report.mood}
        />
      </div>
    </Dialog>
  );
}
