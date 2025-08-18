"use client";
import { useEffect, useRef, useState } from "react";

export default function PreviewPane() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const apply = (html: string | null) => {
    const el = iframeRef.current;
    if (!el) return;
    if (html && html.trim()) {
      el.srcdoc = html;
    } else {
      el.removeAttribute("srcdoc");
      el.src = "/theme/index.html"; // fallback
    }
  };

  useEffect(() => {
    const html = typeof window !== "undefined" ? localStorage.getItem("preview:html") : "";
    apply(html);
    setLoadedOnce(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "preview:html") apply(e.newValue);
    };
    const onCustom = () => apply(localStorage.getItem("preview:html"));

    window.addEventListener("storage", onStorage);
    window.addEventListener("preview:update", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("preview:update", onCustom as EventListener);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      style={{ position:"fixed", inset:0, width:"100%", height:"100%", border:0, background:"#fff", zIndex:0 }}
      src={!loadedOnce ? "/theme/index.html" : undefined}
    />
  );
}
