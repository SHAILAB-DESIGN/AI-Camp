"use client";

import { ReactNode, useEffect, useState } from "react";

export default function RegistrationAuthGuard({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let activeRequest = true;
    const currentUrl = new URL(window.location.href);
    const preview = currentUrl.searchParams.get("preview");
    if (process.env.NODE_ENV !== "production" && (preview === "logged-in" || preview === "registered")) {
      window.sessionStorage.setItem("ai-research-camp-preview-auth", "true");
    }
    const isDevelopmentPreview = process.env.NODE_ENV !== "production" && (
      preview === "logged-in" ||
      preview === "registered" ||
      window.sessionStorage.getItem("ai-research-camp-preview-auth") === "true"
    );
    if (isDevelopmentPreview) {
      Promise.resolve().then(() => activeRequest && setAuthorized(true));
      return () => { activeRequest = false; };
    }

    fetch("/api/auth-status", { credentials: "same-origin", cache: "no-store" })
      .then((response) => response.json())
      .then((result: { authenticated?: boolean }) => {
        if (!activeRequest) return;
        if (result.authenticated) {
          setAuthorized(true);
        } else {
          window.location.replace("/signin-with-chatgpt?return_to=%2Fregister");
        }
      })
      .catch(() => {
        if (activeRequest) window.location.replace("/signin-with-chatgpt?return_to=%2Fregister");
      });
    return () => { activeRequest = false; };
  }, []);

  if (!authorized) {
    return <div className="container registration-auth-loading" role="status">正在验证登录状态…</div>;
  }

  return children;
}
