import { useEffect, useState, useCallback } from "react";

const KEY = "camphero:favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("camphero:fav"));
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const handler = () => setIds(read());
    window.addEventListener("camphero:fav", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("camphero:fav", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(next);
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, has };
}