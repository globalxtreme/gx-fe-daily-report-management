"use client";

import api from "@/lib/api";
import { SlackAccount, UpdateSlackAccountForm } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export function useEmployees() {
  const [accounts, setAccounts] = useState<SlackAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<UpdateSlackAccountForm>({
    slackId: "",
  });

  const getSlackAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/employees/slacks/unlinkeds");

      setAccounts(res.data.result);

      return res.data.result;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load Slack accounts";

      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateSlackAccount = async () => {
    if (!form.slackId) return null;

    try {
      setSaving(true);
      setError(null);

      const res = await api.put("/employees/slacks", {
        slackId: form.slackId,
      });

      toast.success("Slack account linked successfully")

      return res.data.result;
    } catch (err: any) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update Slack account";

      setError(message);
      toast.error(message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    setForm,
    accounts,
    loading,
    saving,
    error,
    getSlackAccount,
    updateSlackAccount,
  };
}