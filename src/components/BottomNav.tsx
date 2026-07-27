import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, Plus, User, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  to: "/" | "/map" | "/add" | "/profile";
  label: string;
  icon: LucideIcon;
  primary?: boolean;
};

const items: NavItem[] = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/add", label: "Add", icon: Plus, primary: true },
  { to: "/profile", label: "Profile", icon: User },
];

// Hand-drawn chalk circle around the active tab icon.
function ActiveChalkCircle({ keyId }: { keyId: string }) {
  return (
    <svg
      key={keyId}
      className="chalk-stroke pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 40 40"
      fill="none"
      stroke="#EFE6D2"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20.5 5.5 C 30 6, 35.5 12, 34.5 21 C 33 30.5, 26 34.5, 18 34 C 9 33.4, 5.5 27, 6 19 C 6.6 11.5, 12 5.5, 20.5 5.5 Z" />
    </svg>
  );
}

// Slightly irregular hand-stamped blob for the center CTA.
function BlobStamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M33 3 C 46 4, 58 12, 60 25 C 62 37, 55 49, 44 56 C 33 62, 18 61, 10 51 C 2 41, 3 27, 9 17 C 15 8, 22 3, 33 3 Z"
        fill="#C6432A"
      />
    </svg>
  );
}

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (y < 40) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hidden = useHideOnScroll();
  return (
    <nav
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] transition-transform duration-300 ${
        hidden ? "translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <div
        className="chalk-grain pointer-events-auto relative flex items-end gap-1 rounded-full border px-2 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        style={{
          backgroundColor: "rgba(30, 27, 22, 0.72)",
          borderColor: "rgba(239, 230, 210, 0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          if (it.primary) {
            return (
              <Link
                key={it.to}
                to={it.to}
                aria-label={it.label}
                className="relative -mt-6 mx-1 grid h-14 w-14 place-items-center"
              >
                <BlobStamp className="absolute inset-0 h-full w-full drop-shadow-[0_6px_10px_rgba(198,67,42,0.35)]" />
                <Icon className="relative h-6 w-6" strokeWidth={1.8} color="#EFE6D2" />
              </Link>
            );
          }
          return (
            <Link
              key={it.to}
              to={it.to}
              aria-label={it.label}
              className="relative flex min-w-[54px] flex-col items-center gap-0.5 px-2 py-1.5"
            >
              <span className="relative grid h-10 w-10 place-items-center">
                {active && <ActiveChalkCircle keyId={it.to} />}
                <Icon
                  className="relative h-5 w-5"
                  strokeWidth={1.5}
                  color="#EFE6D2"
                  opacity={active ? 1 : 0.75}
                />
              </span>
              {active && (
                <span
                  className="font-chalk text-[13px] leading-none"
                  style={{ color: "#EFE6D2" }}
                >
                  {it.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}