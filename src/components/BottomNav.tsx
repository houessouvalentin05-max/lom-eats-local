import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, Plus, User } from "lucide-react";

const items = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/add", label: "Add", icon: Plus, primary: true },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          if (it.primary) {
            return (
              <li key={it.to} className="-mt-6 flex flex-1 justify-center">
                <Link
                  to={it.to}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background"
                  aria-label={it.label}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              </li>
            );
          }
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className={`flex flex-col items-center gap-0.5 py-1 text-xs transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}