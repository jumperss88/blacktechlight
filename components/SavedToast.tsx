"use client";

import { useEffect, useState } from "react";

type Props = {
  showId?: string; // любой новый id = показать тост заново
  message?: string;
  durationMs?: number;
};

export default function SavedToast({
  showId,
  message = "Сохранено",
  durationMs = 1800,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!showId) return;

    setVisible(true);

    // Через durationMs спрячем
    const t = window.setTimeout(() => setVisible(false), durationMs);

    // Уберём ?saved=... из URL, чтобы:
    // - при F5 не висело "сохранено"
    // - следующий save снова нормально триггерил тост
    const url = new URL(window.location.href);
    if (url.searchParams.has("saved")) {
      url.searchParams.delete("saved");
      window.history.replaceState({}, "", url.toString());
    }

    return () => window.clearTimeout(t);
  }, [showId, durationMs]);

  if (!visible) return null;

  return (
    <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
      ✅ {message}
    </div>
  );
}