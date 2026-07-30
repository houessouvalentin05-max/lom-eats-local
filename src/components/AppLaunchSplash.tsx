import { useEffect, useState } from "react";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="LocalEats">
      <path
        d="M32 4C15.9 4 8 16.6 8 30.3c0 16 12.8 27.7 24 29.7 11.2-2 24-13.7 24-29.7C56 16.6 48.1 4 32 4Z"
        fill="#C6432A"
      />
      <path
        d="M22 18v13.5M27 18v13.5M32 18v13.5M27 31.5V46M39 18v28"
        fill="none"
        stroke="#EFE6D2"
        strokeLinecap="round"
        strokeWidth="3.5"
      />
      <path d="M22 31.5h10" fill="none" stroke="#EFE6D2" strokeLinecap="round" strokeWidth="3.5" />
    </svg>
  );
}

export function AppLaunchSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="app-launch-splash"
      onClick={() => setVisible(false)}
      aria-label="Enter LocalEats"
    >
      <span className="app-launch-orbit app-launch-orbit-one" />
      <span className="app-launch-orbit app-launch-orbit-two" />
      <span className="app-launch-content">
        <span className="app-launch-mark">
          <BrandMark />
        </span>
        <span className="font-display text-3xl font-extrabold tracking-tight text-chalk">
          Local<span className="text-corn">Eats</span>
        </span>
        <span className="font-chalk text-lg text-chalk/80">Lomé on a plate</span>
        <span className="app-launch-hint">Tap to explore</span>
      </span>
    </button>
  );
}
