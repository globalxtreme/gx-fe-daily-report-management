"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./Dropdown.module.scss";

export interface DropdownItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export default function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className={styles.wrapper}>
      <div
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((o) => !o);
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {trigger}
      </div>
      {open && (
        <ul className={`${styles.menu} ${styles[align]}`} role="menu">
          {items.map((item, i) => (
            <li key={i} role="menuitem">
              <button
                className={`${styles.item} ${item.danger ? styles.danger : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  item.onClick();
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
