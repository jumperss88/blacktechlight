"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SavedToast() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const saved = sp.get("saved");

  useEffect(() => {
    if (!saved) return;

    const t = setTimeout(() => {
      const next = new URLSearchParams(sp.toString());
      next.delete("saved");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }, 1200);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved]);

  if (!saved) return null;

  return (
    <div className="mb-4 rounded-2xl border border-green-600/20 bg-green-50 px-4 py-3 text-sm text-green-900">
      ✅ Сохранено
    </div>
  );
}
