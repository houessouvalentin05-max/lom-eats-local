import { CATEGORIES, type Category } from "@/lib/mock-data";
import { CategoryIcon } from "./CategoryIcon";

type Variant = "chalk" | "glass";

// Small hand-drawn chalk underline stroke used as the active-tab signal.
function ChalkUnderline({ tone }: { tone: "light" | "dark" }) {
  return (
    <svg
      className="chalk-stroke pointer-events-none absolute -bottom-1 left-1/2 h-2 w-[85%] -translate-x-1/2"
      viewBox="0 0 100 10"
      fill="none"
      stroke={tone === "light" ? "#EFE6D2" : "#1E1B16"}
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6 C 20 2, 45 9, 60 4 C 78 0, 88 7, 96 4" />
    </svg>
  );
}

export function CategoryChips({
  value,
  onChange,
  variant = "chalk",
}: {
  value: Category | "all";
  onChange: (v: Category | "all") => void;
  variant?: Variant;
}) {
  const isGlass = variant === "glass";
  return (
    <div
      className={`chalk-grain flex items-center gap-1 overflow-x-auto rounded-full border px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        isGlass ? "" : "border-transparent"
      }`}
      style={
        isGlass
          ? {
              backgroundColor: "rgba(30, 27, 22, 0.72)",
              borderColor: "rgba(239, 230, 210, 0.12)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 10px 30px -12px rgba(0,0,0,0.45)",
            }
          : undefined
      }
    >
      <Chip active={value === "all"} onClick={() => onChange("all")} glass={isGlass}>
        All
      </Chip>
      {CATEGORIES.map((c) => (
        <Chip key={c.id} active={value === c.id} onClick={() => onChange(c.id)} glass={isGlass}>
          <CategoryIcon id={c.id} className="h-3.5 w-3.5" />
          {c.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  glass,
  children,
}: {
  active: boolean;
  onClick: () => void;
  glass: boolean;
  children: React.ReactNode;
}) {
  const color = glass ? "#EFE6D2" : "#1E1B16";
  return (
    <button
      onClick={onClick}
      className="relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition"
      style={{ color, opacity: active ? 1 : 0.72 }}
    >
      {children}
      {active && <ChalkUnderline tone={glass ? "light" : "dark"} />}
    </button>
  );
}
