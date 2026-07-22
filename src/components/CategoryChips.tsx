import { CATEGORIES, type Category } from "@/lib/mock-data";

export function CategoryChips({
  value,
  onChange,
}: {
  value: Category | "all";
  onChange: (v: Category | "all") => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip active={value === "all"} onClick={() => onChange("all")}>
        All
      </Chip>
      {CATEGORIES.map((c) => (
        <Chip key={c.id} active={value === c.id} onClick={() => onChange(c.id)}>
          <span>{c.emoji}</span> {c.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}