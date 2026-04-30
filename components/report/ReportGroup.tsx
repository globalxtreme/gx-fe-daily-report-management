import styles from "./ReportGroup.module.scss";

interface ReportGroupProps {
  label: string;
  count?: number;
  children: React.ReactNode;
}

export default function ReportGroup({ label, count, children }: ReportGroupProps) {
  return (
    <div className={styles.group}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {count !== undefined && <span className={styles.badge}>{count}</span>}
      </div>
      <div className={styles.items}>{children}</div>
    </div>
  );
}
