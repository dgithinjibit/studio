
"use client";

import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import type { School } from '@/lib/types';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWR1cGxleCIsImEiOiJjbHh6M3F2NnMwOXNqMmtwZ3M3NmdsZWhsIn0.PNbK6xhD47iY4Cg3M2Y74A";

interface SchoolMapProps {
  schools: School[];
}

export default function SchoolMap({ schools }: SchoolMapProps) {
  const [popupInfo, setPopupInfo] = useState<School | null>(null);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p className="text-muted-foreground">Mapbox token is not configured. Please add it to your .env file.</p>
      </div>
    );
  }

  return (
    <Map
      initialViewState={{
        longitude: 36.8219, // Centered on Nairobi
        latitude: -1.2921,
        zoom: 8
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      crossOrigin="anonymous"
    >
      {schools.map(school => (
        <Marker
          key={school.id}
          longitude={school.longitude}
          latitude={school.latitude}
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo(school);
          }}
        >
          <MapPin className="text-primary cursor-pointer" size={24} />
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
        >
          <div>
            <h3 className="font-bold">{popupInfo.name}</h3>
            <p>County ID: {popupInfo.countyId}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
