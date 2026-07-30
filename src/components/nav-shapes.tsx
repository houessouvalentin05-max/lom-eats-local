// Hand-drawn chalk circle around the active tab icon. Shared between BottomNav and TopNav.
export function ActiveChalkCircle({ keyId }: { keyId: string }) {
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

// Slightly irregular hand-stamped blob for the center/primary CTA. Shared between BottomNav and TopNav.
export function BlobStamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        d="M33 3 C 46 4, 58 12, 60 25 C 62 37, 55 49, 44 56 C 33 62, 18 61, 10 51 C 2 41, 3 27, 9 17 C 15 8, 22 3, 33 3 Z"
        fill="#C6432A"
      />
    </svg>
  );
}