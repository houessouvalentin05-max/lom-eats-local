import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "@tanstack/react-router";
import { categoryOf, LOME_CENTER, type Spot } from "@/lib/mock-data";

function iconFor(letter: string, color = "#1E1B16") {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};color:#EFE6D2;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.4);border:2px solid #EFE6D2"><span style="transform:rotate(45deg);font-family:'Caveat',cursive;font-weight:700;font-size:18px;line-height:1">${letter}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

export function MapView({
  spots,
  height = "100%",
  center = LOME_CENTER,
  zoom = 12,
}: {
  spots: Spot[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {spots.map((s) => {
        const cat = categoryOf(s.category);
        return (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={iconFor(cat.label.charAt(0))}>
            <Popup>
              <div className="min-w-[160px]">
                <img src={s.photo} alt="" className="mb-2 h-20 w-full rounded object-cover" />
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs opacity-70">
                  {cat.label} · {s.price_range} · ★ {s.rating.toFixed(1)}
                </div>
                <div className="text-xs opacity-70">{s.neighborhood}</div>
                <Link to="/spot/$id" params={{ id: s.id }} className="mt-1 inline-block text-xs font-semibold" style={{ color: "#12807D" }}>
                  View spot →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export function PinPickerMap({
  value,
  onChange,
  center = LOME_CENTER,
}: {
  value: [number, number] | null;
  onChange: (v: [number, number]) => void;
  center?: [number, number];
}) {
  function Clicker() {
    useMapEvents({
      click(e) {
        onChange([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }
  return (
    <MapContainer center={value ?? center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Clicker />
      {value && (
        <Marker
          position={value}
          draggable
          icon={iconFor("•", "#C6432A")}
          eventHandlers={{
            dragend: (e) => {
              const m = e.target as L.Marker;
              const p = m.getLatLng();
              onChange([p.lat, p.lng]);
            },
          }}
        />
      )}
    </MapContainer>
  );
}

export default MapView;