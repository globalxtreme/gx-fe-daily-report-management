"use client";

import { useState } from "react";
import api from "@/lib/api";

export interface ReportForm {
    id: number;
    reportDate: string;
    completedYesterday: string;
    planToday: string;
    finishEstimation: string;
    blocker: string;
    mood: string;
}

const createEmptyForm = (date: string): ReportForm => ({
    id: 0,
    reportDate: date,
    completedYesterday: "",
    planToday: "",
    finishEstimation: "",
    blocker: "",
    mood: "",
});

export function useReportForm() {
    const [reportExists, setReportExists] = useState(true);
    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState<ReportForm>(
        createEmptyForm(today)
    );

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const updateField = (
        key: keyof ReportForm,
        value: string
    ) => {
        setForm((prev) => ({
        ...prev,
        [key]: value,
        }));
    };

    const reset = (date = today) => {
        setForm(createEmptyForm(date));
    };

  const loadReport = async (date: string) => {
    setLoading(true);

    try {
      const res = await api.get(`/daily-reports/by-dates/${date}`);

      const report = res.data?.result;

        if (!report) {
            setReportExists(false);
            reset(date);
            return;
        }

        setReportExists(true);

        setForm({
            id: report.id,
            reportDate: date,
            completedYesterday: report.completedYesterday ?? "",
            planToday: report.planToday ?? "",
            finishEstimation: report.finishEstimation ?? "",
            blocker: report.blocker ?? "",
            mood: report.mood ?? "",
        });
    } catch (err: any) {
        if (err.response?.status === 404) {
            setReportExists(false);
            reset(date);
        } else {
            console.error(err);
            setReportExists(true); // or leave unchanged
        }
    } finally {
        setLoading(false);
    }
    };

    const updateReport = async () => {
        setSaving(true);

        try{
            const res = await api.put(`/daily-reports/${form.id}`, {
                completedYesterday : form.completedYesterday,
                planToday: form.planToday,
                finishEstimation: form.finishEstimation,
                blocker: form.blocker,
                mood: form.mood,
            });
            return res.data.result;
        } catch(err) {
            console.error(err);
            return null;
        } finally {
            setSaving(false);
        }

    }

  return {
    form,
    loading,
    saving,
    reportExists,
    loadReport,
    updateReport,
    updateField,
    reset,
  };
}