"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // Only register in production builds / when sw exists
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // silent — SW optional during local dev without https
    });
  }, []);
  return null;
}
