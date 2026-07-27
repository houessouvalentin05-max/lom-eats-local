import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, MapPin } from "lucide-react";
import { CATEGORIES, type Category, type PriceRange } from "@/lib/mock-data";
import { AppHeader } from "@/components/AppHeader";
import { LazyPinPicker } from "@/components/LazyMap";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Add a spot · LocalEats" },
      { name: "description", content: "Share a food spot in Lomé with the community." },
    ],
  }),
  component: AddSpot,
});

function AddSpot() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("street");
  const [price, setPrice] = useState<PriceRange>("$");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState<[number, number] | null>(null);
  const [photos, setPhotos] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const valid = name && description && address && pin;

  return (
    <div>
      <AppHeader title="Add a spot" subtitle="Share a place you love with the community" back="/" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          setSubmitted(true);
          setTimeout(() => navigate({ to: "/" }), 1200);
        }}
        className="space-y-5 p-4"
      >
        <Field label="Name of the spot" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chez Maman Ayaba"
            className="input"
          />
        </Field>

        <Field label="Category" required>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-medium transition ${
                  category === c.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                }`}
              >
                <CategoryIcon id={c.id} className="h-6 w-6" />
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Price range" required>
          <div className="flex gap-2">
            {(["$", "$$", "$$$"] as PriceRange[]).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPrice(p)}
                className={`flex-1 rounded-xl border py-2 text-sm font-semibold ${
                  price === p ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Description" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What's their specialty? Ambiance? Best time to go?"
            className="input resize-none"
          />
        </Field>

        <Field label="Opening hours">
          <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="12h – 23h · Fermé le lundi" className="input" />
        </Field>

        <Field label="Photos">
          <button
            type="button"
            onClick={() => setPhotos((p) => p + 1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card py-6 text-sm text-muted-foreground"
          >
            <Camera className="h-5 w-5" />
            {photos > 0 ? `${photos} photo${photos > 1 ? "s" : ""} added — tap to add more` : "Tap to add photos"}
          </button>
        </Field>

        <Field
          label="Where is it?"
          required
          hint="Formal addresses don't exist here — describe it by neighborhood and landmark."
        >
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adidogomé, en face de la station Total"
            className="input"
          />
        </Field>

        <Field
          label="Drop the pin on the map"
          required
          hint="Tap the map to place a pin, then drag it to the exact spot."
        >
          <div className="overflow-hidden rounded-xl ring-1 ring-border">
            <div className="h-64 w-full">
              <LazyPinPicker value={pin} onChange={setPin} />
            </div>
            <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {pin ? `Pin at ${pin[0].toFixed(4)}, ${pin[1].toFixed(4)}` : "Tap the map to drop a pin"}
            </div>
          </div>
        </Field>

        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-xl py-3 font-semibold shadow-md transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "#C6432A", color: "#EFE6D2" }}
        >
          {submitted ? "✓ Spot added — merci!" : "Publish spot"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}