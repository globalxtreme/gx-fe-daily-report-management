import type { Metadata } from "next";
import "@/styles/globals.scss";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Daily Report",
  description: "GX Internal Daily Report Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
