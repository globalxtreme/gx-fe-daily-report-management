"use client";

import { useEffect } from "react";

export default function LoginRedirectPage() {
  useEffect(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/redirect`;
  }, []);

  return null;
}
