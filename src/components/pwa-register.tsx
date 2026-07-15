"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Avoid registering a SW during local development — it can cache stale
    // HTML and break ClerkProvider hydration.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) void reg.unregister();
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            if (key.startsWith("thrive-daily")) void caches.delete(key);
          }
        });
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // silent — SW optional
    });
  }, []);
  return null;
}
