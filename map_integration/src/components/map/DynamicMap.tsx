import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

/**
 * DynamicMap.tsx
 * Hiển thị bản đồ động với:
 *  - Polygon vùng rủi ro lấy từ public/data/zones.geojson
 *  - Marker cảnh báo lấy từ public/data/markers.geojson
 * 
 * Ghi chú:
 *  - Đây là ví dụ tối giản để chạy được ngay mà không cần backend.
 *  - Có thể mở rộng thêm clustering (supercluster hoặc leaflet.markercluster).
 */
export default function DynamicMap() {
  const [zones, setZones] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<any | null>(null);

  useEffect(() => {
    fetch("/data/zones.geojson").then(r => r.json()).then(setZones).catch(console.error);
    fetch("/data/markers.geojson").then(r => r.json()).then(setAlerts).catch(console.error);
  }, []);

  return (
    <MapContainer center={[10.78, 106.70]} zoom={11} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {zones && (
        <GeoJSON
          data={zones}
          style={(feature: any) => ({
            color: feature?.properties?.color ?? "#2563eb",
            weight: 2,
            fillOpacity: 0.25
          })}
          onEachFeature={(feature: any, layer: any) => {
            const p = feature.properties || {};
            const html = `<b>${p.name ?? "Impact Zone"}</b><br/>
                          Risk: ${p.riskLevel ?? "-"}<br/>
                          Hazard: ${p.hazard ?? "-"}`;
            layer.bindPopup(html);
          }}
        />
      )}
      {alerts?.features?.map((f: any) => (
        <Marker
          key={f.properties?.id ?? `${f.geometry.coordinates[1]}-${f.geometry.coordinates[0]}`}
          position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}
        >
          <Popup>
            <b>{f.properties?.title ?? "Alert"}</b><br />
            Severity: {f.properties?.severity ?? "-"}<br />
            Type: {f.properties?.type ?? "-"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}