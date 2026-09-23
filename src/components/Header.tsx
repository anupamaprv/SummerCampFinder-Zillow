import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Tent, LogOut, User as UserIcon } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Header() {
  const { ids } = useFavorites();
  const { user, displayName } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-accent-foreground"
                style={{ background: "var(--gradient-coral)", boxShadow: "var(--shadow-glow)" }}>
            <Tent className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold tracking-tight">
            Koda<span className="text-accent">nz</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/search"
            search={{ zip: "", age: 10, interests: [], sort: "relevance", maxCost: 1000, maxDistance: 50, types: [], schedules: [] }}
            className="hidden md:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            activeProps={{ className: "text-foreground" }}
          >
            Browse
          </Link>
          <button
            onClick={() => navigate({ to: "/favorites" })}
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
            {ids.length > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-accent-foreground">
                {ids.length}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-sm font-semibold">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span className="max-w-[9rem] truncate">{displayName}</span>
              </span>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-bold text-accent-foreground"
              style={{ background: "var(--gradient-coral)" }}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
