import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, Plus, User, type LucideIcon } from "lucide-react";
import { ActiveChalkCircle } from "@/components/nav-shapes";

type NavItem = {
  to: "/" | "/map" | "/profile";
  label: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/profile", label: "Profile", icon: User },
];

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 top-0 z-40 hidden justify-center px-4 pt-4 lg:flex">
      <div
        className="chalk-grain flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border px-5 py-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        style={{
          backgroundColor: "rgba(30, 27, 22, 0.72)",
          borderColor: "rgba(239, 230, 210, 0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight"
          style={{ color: "#EFE6D2" }}
        >
          LocalEats
        </Link>

        <div className="flex items-center gap-1">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition"
                style={{ color: "#EFE6D2" }}
              >
                <span className="relative grid h-8 w-8 place-items-center">
                  {active && <ActiveChalkCircle keyId={it.to} />}
                  <Icon
                    className="relative h-4 w-4"
                    strokeWidth={1.5}
                    opacity={active ? 1 : 0.75}
                  />
                </span>
                <span style={{ opacity: active ? 1 : 0.75 }}>{it.label}</span>
              </Link>
            );
          })}
        </div>

        <Link
          to="/add"
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition hover:brightness-110"
          style={{ backgroundColor: "#C6432A", color: "#EFE6D2" }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add a spot
        </Link>
      </div>
    </nav>
  );
}