import { useEffect, useState } from "react";
import styles from "./ReportUpdateModal.module.scss";
import { useReportForm } from "@/hooks/useReportForms";
import { toast } from "sonner";
import { emojify } from "node-emoji";

interface ReportUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export interface ReportUpdateForm {
  reportDate: string;
  completedYesterday: string;
  planToday: string;
  finishEstimation: string;
  blocker: string;
  mood: string;
}

export default function ReportUpdateModal({
  open,
  onClose,
  onSubmit,
}: ReportUpdateModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const {
  form,
  loading,
  saving,
  reportExists,
  loadReport,
  updateField,
  updateReport,
} = useReportForm();

  const isFormValid =
  form.completedYesterday.trim() !== "" &&
  form.planToday.trim() !== "" &&
  form.finishEstimation.trim() !== "" &&
  form.blocker.trim() !== "" &&
  form.mood.trim() !== "";


  useEffect(() => {
    if (!open) return;

    loadReport(new Date().toISOString().split("T")[0]);
  }, [open]);

  if (!open) return null;


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
              max={today}
              value={form.reportDate}
              onChange={(e) => loadReport(e.target.value)}
            />
          </div>
          {!reportExists && (
            <div className={styles.notOpened}>
              Daily Report not opened yet.
            </div>
          )}
          {reportExists &&(
            <>
            <div className={styles.field}>
              <label>What did you do yesterday?<span className={styles.required}>*</span></label>

              <textarea
                required
                rows={4}
                value={form.completedYesterday}
                onChange={(e) =>
                  updateField("completedYesterday", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>What will you work on today?<span className={styles.required}>*</span></label>

              <textarea
                required
                rows={4}
                value={form.planToday}
                onChange={(e) =>
                  updateField("planToday", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>When do you expect to finish?<span className={styles.required}>*</span></label>
              <input
                required
                value={form.finishEstimation}
                onChange={(e) =>
                  updateField("finishEstimation", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>Any blockers or impediments?<span className={styles.required}>*</span></label>

              <textarea
                required
                rows={3}
                value={form.blocker}
                onChange={(e) =>
                  updateField("blocker", e.target.value)
                }
              />
            </div>

            <div className={styles.field}>
              <label>How are you feeling today?<span className={styles.required}>*</span></label>
              <input
                required
                value={emojify(form.mood)}
                onChange={(e) =>
                  updateField("mood", e.target.value)
                }
              />
            </div>
            </>
          )}
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
            disabled={!reportExists || saving || !isFormValid}
            onClick={async () => {
              try {
                const updated = await updateReport();
  
                if (updated) {
                  toast.success("Daily report updated successfully.");
                  onSubmit();
                }
              } catch (err) {
                toast.error("Failed to update daily report.");
              }
            }}
          >
            {saving ? "Updating..." : "Update Report"}
          </button>
        </div>
      </div>
    </div>
  );
}