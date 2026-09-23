import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "kodanz:favorites";

let ids: string[] = [];
let userId: string | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function localRead(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function localWrite(next: string[]) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

async function loadForUser(uid: string) {
  // Merge anything saved on this device before signing in.
  const pending = localRead();
  if (pending.length) {
    await supabase
      .from("saved_programs")
      .upsert(
        pending.map((program_id) => ({ user_id: uid, program_id })),
        { onConflict: "user_id,program_id" },
      );
    localWrite([]);
  }
  const { data } = await supabase
    .from("saved_programs")
    .select("program_id")
    .eq("user_id", uid);
  ids = (data ?? []).map((r) => r.program_id);
  emit();
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  ids = localRead();

  supabase.auth.getSession().then(({ data }) => {
    const uid = data.session?.user.id ?? null;
    userId = uid;
    if (uid) void loadForUser(uid);
    else emit();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    const uid = session?.user.id ?? null;
    if (uid === userId) return;
    userId = uid;
    if (uid) {
      void loadForUser(uid);
    } else {
      ids = [];
      emit();
    }
  });

  window.addEventListener("storage", () => {
    if (!userId) {
      ids = localRead();
      emit();
    }
  });
}

export function useFavorites() {
  const [state, setState] = useState<string[]>(ids);

  useEffect(() => {
    init();
    const listener = () => setState([...ids]);
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  /** Returns false when the visitor needs to sign in first. */
  const toggle = useCallback((id: string): boolean => {
    if (!userId) return false;
    const saved = ids.includes(id);
    ids = saved ? ids.filter((x) => x !== id) : [...ids, id];
    emit();
    const req = saved
      ? supabase.from("saved_programs").delete().eq("user_id", userId).eq("program_id", id)
      : supabase.from("saved_programs").insert({ user_id: userId, program_id: id });
    void Promise.resolve(req).then(({ error }) => {
      if (error) {
        ids = saved ? [...ids, id] : ids.filter((x) => x !== id);
        emit();
      }
    });
    return true;
  }, []);

  const has = useCallback((id: string) => state.includes(id), [state]);

  return { ids: state, toggle, has, isSignedIn: !!userId };
}
