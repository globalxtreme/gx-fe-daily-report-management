"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { ViewMode } from "@/types";
import Dropdown from "@/components/ui/Dropdown";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const NAV_ITEMS: { label: string; view: ViewMode; icon: React.ReactNode }[] = [
  {
    view: "all",
    label: "All Reports",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    view: "by-user",
    label: "By User",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    view: "by-date",
    label: "By Date",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  const dropdownItems = [
    {
      label: "My Profile",
      onClick: () => {
        window.open(process.env.NEXT_PUBLIC_EMPLOYEE_PROFILE, "_blank");
      },
    },
    {
      label: "Logout",
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <span className={styles.brandName}>Daily Report</span>
        </div>

        {user && (
          <Dropdown
            trigger={
              <div className={styles.avatar} title={user.fullName}>
                {getInitials(user.fullName)}
              </div>
            }
            items={dropdownItems}
            align="right"
          />
        )}
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Menu</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            className={`${styles.navItem} ${activeView === item.view ? styles.active : ""}`}
            onClick={() => onViewChange(item.view)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
