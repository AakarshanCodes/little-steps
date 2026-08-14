"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically adjust map bounds based on markers
function MapBounds({ centers }: { centers: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (centers.length > 0) {
      const bounds = L.latLngBounds(centers.filter(c => c.latitude && c.longitude).map(c => [c.latitude, c.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [centers, map]);

  return null;
}

interface CentersMapProps {
  centers: any[];
}

export default function CentersMap({ centers }: CentersMapProps) {
  // Default center (San Francisco) if no centers are passed or no centers have coordinates
  const defaultCenter: [number, number] = [37.7749, -122.4194];

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={11} 
      scrollWheelZoom={true} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {centers.filter(c => c.latitude && c.longitude).map(center => (
        <Marker key={center.id} position={[center.latitude, center.longitude]} icon={icon}>
          <Popup>
            <div className="text-sm">
              <strong className="block text-base mb-1">{center.name}</strong>
              <span className="text-muted-foreground block mb-2">${center.priceHourly}/hr</span>
              <Link href={`/center/${center.id}`}>
                <Button size="sm" className="w-full h-8 text-xs">View Details</Button>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
      <MapBounds centers={centers} />
    </MapContainer>
  );
}
