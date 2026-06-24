"use client";
import { useEffect, useRef } from "react";
import { Report } from "@/lib/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  on_progress: "#6366f1",
  resolved: "#10b981",
};

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

interface MapViewProps {
  reports: Report[];
  onSelect: (r: Report) => void;
  selected: Report | null;
}

export default function MapView({ reports, onSelect, selected }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerId = "leaflet-map";
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(containerId, {
      center: [-6.2, 106.816],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    reports.forEach((r) => {
      if (!r.coordinates || r.coordinates.length < 2) return;
      const [lat, lng] = r.coordinates;
      const color = STATUS_COLORS[r.status] || "#94a3b8";
      const marker = L.marker([lat, lng], {
        icon: createIcon(color),
      });

      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <strong style="font-size: 14px; color: #1e293b;">${r.title}</strong><br/>
          <span style="font-size: 12px; color: #64748b;">${r.category || ""}</span><br/>
          <span style="
            display: inline-block; margin-top: 4px;
            padding: 2px 8px; border-radius: 999px; font-size: 11px;
            background: ${color}22; color: ${color}; border: 1px solid ${color}44;
          ">${r.status}</span>
        </div>
      `);

      marker.on("click", () => onSelect(r));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [reports, onSelect]);

  // Pan to selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected?.coordinates || selected.coordinates.length < 2) return;
    const [lat, lng] = selected.coordinates;
    map.flyTo([lat, lng], 16, { duration: 1 });
  }, [selected]);

  return <div id={containerId} style={{ width: "100%", height: "100%" }} />;
}
