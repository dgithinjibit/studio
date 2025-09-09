
"use client";

import { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import type { School } from '@/lib/types';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

const MAPTILER_TOKEN = "oOP6aDKvl1yVX2dicS80";

interface SchoolMapProps {
  schools: School[];
  selectedSchool: School | null;
  onSchoolSelect: (school: School | null) => void;
}

export default function SchoolMap({ schools, selectedSchool, onSchoolSelect }: SchoolMapProps) {
  const [popupInfo, setPopupInfo] = useState<School | null>(null);

  if (!MAPTILER_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <p className="text-muted-foreground">Map API key is not configured. Please add it to your .env file.</p>
      </div>
    );
  }

  return (
    <Map
      initialViewState={{
        longitude: 36.8219, // Centered on Nairobi
        latitude: -1.2921,
        zoom: 6
      }}
      style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
      mapStyle={`https://api.maptiler.com/maps/backdrop/style.json?key=${MAPTILER_TOKEN}`}
      mapboxAccessToken={null} // Set to null as we are not using Mapbox
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
            <div 
                className={cn(
                    "w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-lg cursor-pointer transition-all duration-300",
                    "hover:scale-125",
                    selectedSchool?.id === school.id ? "scale-150 ring-4 ring-primary/50" : ""
                )}
                onMouseEnter={() => onSchoolSelect(school)}
                onMouseLeave={() => onSchoolSelect(null)}
            >
                 <div className={cn("w-full h-full rounded-full bg-primary animate-pulse", selectedSchool?.id === school.id ? "animation-delay-0" : "animation-delay-[2s]")} />
            </div>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
          className="font-body"
        >
          <div className="text-foreground">
            <h3 className="font-bold">{popupInfo.name}</h3>
            <p className="text-xs">County ID: {popupInfo.countyId}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}
