import { lazy, Suspense } from "react";
import { ClientOnly } from "./ClientOnly";
import type { Spot } from "@/lib/mock-data";

const MapView = lazy(() => import("./MapView").then((m) => ({ default: m.MapView })));
const PinPickerMap = lazy(() => import("./MapView").then((m) => ({ default: m.PinPickerMap })));

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-muted text-sm text-muted-foreground">
      Loading map…
    </div>
  );
}

export function LazyMapView(props: {
  spots: Spot[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <ClientOnly fallback={<MapSkeleton />}>
      <Suspense fallback={<MapSkeleton />}>
        <MapView {...props} />
      </Suspense>
    </ClientOnly>
  );
}

export function LazyPinPicker(props: {
  value: [number, number] | null;
  onChange: (v: [number, number]) => void;
  center?: [number, number];
}) {
  return (
    <ClientOnly fallback={<MapSkeleton />}>
      <Suspense fallback={<MapSkeleton />}>
        <PinPickerMap {...props} />
      </Suspense>
    </ClientOnly>
  );
}