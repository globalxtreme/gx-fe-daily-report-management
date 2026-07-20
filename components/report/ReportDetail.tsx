"use client";

import {Report} from "@/types";
import {formatDateSlash, formatDateTimeSlash, getInitials, isEmptyBlocker} from "@/lib/utils";
import Dialog from "@/components/ui/Dialog";
import styles from "./ReportDetail.module.scss";
import SlackMarkdown from "slack-markdown";
import DOMPurify from "dompurify";
import { emojify } from "node-emoji";

interface ReportDetailProps {
    report: Report;
    onClose: () => void;
}

interface FieldProps {
    question: string;
    answer: string;
    muted?: boolean;
}

function Field({question, answer, muted}: FieldProps) {
    const parseAnswer = SlackMarkdown.toHTML(answer);
    const cleanHtml = DOMPurify.sanitize(parseAnswer);

    return (
        <div className={styles.field}>
            <p className={styles.question}>{question}</p>
            <div className={`${styles.answer} ${muted ? styles.muted : ""}`}
                 dangerouslySetInnerHTML={{__html: cleanHtml}}/>
        </div>
    );
}

export default function ReportDetail({report, onClose}: ReportDetailProps) {
    const blockerEmpty = isEmptyBlocker(report.blocker);

    return (
        <Dialog open onClose={onClose} size="lg">
            {/* Header info */}
            <div className={styles.meta}>
                <div className={styles.avatar}>{getInitials(report.employee.fullName)}</div>
                <div>
                    <p className={styles.userName}>{report.employee.fullName}</p>
                    <p className={styles.dateTime}>Report for : {formatDateSlash(report.reportDate)}</p>
                    <p className={styles.dateTime}>{report.completedAt === "01/01/0001 00:00" ? "Not completed yet" : `Completed at: ${formatDateTimeSlash(report.completedAt)}`}</p>
                </div>
                <span className={styles.mood}>{emojify(report.mood)}</span>
            </div>

            <div className={styles.divider}/>

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
                    answer={blockerEmpty ? "No blockers" : report.blocker}
                    muted={blockerEmpty}
                />
                <Field
                    question="How do you feel today?"
                    answer={emojify(report.mood)}
                />
            </div>
        </Dialog>
    );
}
