"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // The BE sets auth_token as a cookie before redirecting here.
    // If a token arrives as a query param (some OAuth flows), persist it.
    const params = new URLSearchParams(window.location.search);
    const tokenFromQuery = params.get("token");
    if (tokenFromQuery) {
      Cookies.set("auth_token", tokenFromQuery, { expires: 7, sameSite: "Lax" });
    }

    router.replace("/dashboard");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: 14,
        color: "var(--color-text-secondary)",
      }}
    >
      Signing you in…
    </div>
  );
}
