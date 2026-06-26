import { useEffect, useState } from "react";
import styles from "./ReportUpdateModal.module.scss";

interface ReportUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReportUpdateForm) => void;
}

export interface ReportUpdateForm {
  reportDate: string;
  yesterday: string;
  today: string;
  expectedFinish: string;
  blockers: string;
  feeling: string;
}

const feelings = [
  { value: "great", label: "😊 Great" },
  { value: "good", label: "🙂 Good" },
  { value: "okay", label: "😐 Okay" },
  { value: "challenging", label: "😞 Challenging" },
];

export default function ReportUpdateModal({
  open,
  onClose,
  onSubmit,
}: ReportUpdateModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<ReportUpdateForm>({
    reportDate: today,
    yesterday: "",
    today: "",
    expectedFinish: today,
    blockers: "",
    feeling: "good",
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      reportDate: today,
      yesterday: "",
      today: "",
      expectedFinish: today,
      blockers: "",
      feeling: "good",
    });
  }, [open]);

  if (!open) return null;

  const update = (key: keyof ReportUpdateForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Update Daily Report</h2>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label>Report Date</label>

            <input
              type="date"
              value={form.reportDate}
              onChange={(e) =>
                update("reportDate", e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>What did you do yesterday?</label>

            <textarea
              rows={4}
              value={form.yesterday}
              onChange={(e) =>
                update("yesterday", e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>What will you work on today?</label>

            <textarea
              rows={4}
              value={form.today}
              onChange={(e) =>
                update("today", e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>When do you expect to finish?</label>

            <input
              type="date"
              value={form.expectedFinish}
              onChange={(e) =>
                update("expectedFinish", e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>Any blockers or impediments?</label>

            <textarea
              rows={3}
              value={form.blockers}
              onChange={(e) =>
                update("blockers", e.target.value)
              }
            />
          </div>

          <div className={styles.field}>
            <label>How are you feeling today?</label>

            <div className={styles.feelings}>
              {feelings.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={
                    form.feeling === item.value
                      ? styles.activeFeeling
                      : styles.feeling
                  }
                  onClick={() =>
                    update("feeling", item.value)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={styles.saveBtn}
            onClick={() => onSubmit(form)}
          >
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
}