"use client";

import { useEffect, useState } from "react";
import styles from "./SlackAccountModal.module.scss";
import { useEmployees } from "@/hooks/useEmployees";

interface SlackAccountModalProps {
  open: boolean;
  onClose: () => void;
  slackId?: string;
  slackEmail?: string;
  onSuccess?: () => void;
}

export default function SlackAccountModal({
  open,
  onClose,
  slackId,
  slackEmail,
  onSuccess,
}: SlackAccountModalProps) {
  const {
    accounts,
    loading,
    saving,
    form,
    setForm,
    getSlackAccount,
    updateSlackAccount,
  } = useEmployees();

  const [selectMode, setSelectMode] = useState(false);

  const [currentSlackId, setCurrentSlackId] = useState(slackId ?? "");
  const [currentSlackEmail, setCurrentSlackEmail] = useState(
    slackEmail ?? ""
  );

  useEffect(() => {
    if (!open) return;

    setCurrentSlackId(slackId ?? "");
    setCurrentSlackEmail(slackEmail ?? "");
    setSelectMode(false);

    setForm({
      slackId: slackId ?? "",
    });
  }, [open, slackId, slackEmail, setForm]);

  if (!open) return null;

  const linked = currentSlackId !== "";

  const handleOpenSelector = async () => {
    await getSlackAccount();
    setSelectMode(true);
  };

  const handleSave = async () => {
    const updated = await updateSlackAccount();

    if (!updated) return;

    const selected = accounts.find(
      (x) => x.id === form.slackId
    );

    if (selected) {
      setCurrentSlackId(selected.id);
      setCurrentSlackEmail(selected.email);
    }

    setSelectMode(false);

    onSuccess?.();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Slack Account</h2>

          <button
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {!selectMode ? (
            <>
              <div className={styles.infoCard}>
                <div className={styles.infoRow}>
                  <span>Status</span>

                  <strong
                    className={
                      linked
                        ? styles.linked
                        : styles.notLinked
                    }
                  >
                    {linked ? "Linked" : "Not Linked"}
                  </strong>
                </div>

                <div className={styles.infoRow}>
                  <span>Slack ID</span>
                  <span>{currentSlackId || "-"}</span>
                </div>

                <div className={styles.infoRow}>
                  <span>Email</span>
                  <span>{currentSlackEmail || "-"}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className={styles.subtitle}>
                Select Slack Account
              </h3>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className={styles.accountList}>
                  {accounts.map((account) => (
                    <button
                      key={account.id}
                      type="button"
                      className={`${styles.accountItem} ${
                        form.slackId === account.id
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        setForm({
                          slackId: account.id,
                        })
                      }
                    >
                      <img
                        src={account.image}
                        alt={account.name}
                        className={styles.avatar}
                      />

                      <div className={styles.accountInfo}>
                        <strong>{account.name}</strong>

                        <span>{account.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.footer}>
          {!selectMode ? (
            <button
              className={styles.primaryBtn}
              onClick={handleOpenSelector}
            >
              {linked ? "Change Account" : "Link to Slack"}
            </button>
          ) : (
            <>
              <button
                className={styles.secondaryBtn}
                onClick={() => setSelectMode(false)}
              >
                Cancel
              </button>

              <button
                className={styles.primaryBtn}
                disabled={!form?.slackId || saving}
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}