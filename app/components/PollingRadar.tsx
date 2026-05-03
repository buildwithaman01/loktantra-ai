"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export default function PollingRadar(props: { state: string }): JSX.Element {
  const [pinCode, setPinCode] = useState("");
  const [booths, setBooths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapObj, setMapObj] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      try {
        setOptions({
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
        });
        const { Map } = await importLibrary("maps") as any;
        if (mapRef.current) {
          const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // India center
          const m = new Map(mapRef.current, {
            center: defaultLocation,
            zoom: 4,
            mapId: "DEMO_MAP_ID",
          });
          setMapObj(m);
        }
      } catch {
        setIsLoading(false);
      }
    };
    initMap();
  }, []);

  const fetchBooths = async (): Promise<void> => {
    if (!pinCode) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/booth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinCode }),
      });
      if (res.ok) {
        const data = await res.json();
        setBooths(data.booths || []);
        
        // update map if we have booths
        if (mapObj && data.booths && data.booths.length > 0) {
          // Clear old markers
          markers.forEach(m => m.map = null);
          setMarkers([]);

          const newMarkers: any[] = [];
          const { LatLngBounds } = await importLibrary("core") as any;
          const { Marker } = await importLibrary("marker") as any;
          const bounds = new LatLngBounds();
          
          data.booths.forEach((booth: any) => {
            const position = { lat: booth.lat, lng: booth.lng };
            const marker = new Marker({
              position,
              map: mapObj,
              title: booth.name,
            });
            newMarkers.push(marker);
            bounds.extend(position);
          });
          
          setMarkers(newMarkers);
          mapObj.fitBounds(bounds);
          
          // Adjust zoom if bounds are too close
          if (mapObj.getZoom() > 15) {
            mapObj.setZoom(15);
          }
        }
      }
    } catch {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-2 relative z-10">
        <input 
          type="text" 
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder={`PIN Code for ${props.state}`}
          aria-label="Enter PIN code to find polling booths"
          className="flex-1 border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-all shadow-inner"
        />
        <button 
          onClick={fetchBooths}
          disabled={isLoading || !pinCode}
          aria-label="Search for polling stations"
          className="gradient-bg text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </div>
      
      <div 
        ref={mapRef} 
        aria-label="Nearby polling stations map" 
        role="img" 
        className="flex-1 min-h-[200px] bg-slate-100 rounded-2xl w-full border-2 border-white shadow-lg overflow-hidden"
      ></div>

      {booths.length > 0 && (
        <ul aria-label="List of polling booths" className="space-y-2 mt-2">
          {booths.map((b, i) => (
            <li key={i} className="text-sm p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="font-semibold text-gray-800">{b.name}</p>
              <p className="text-xs text-gray-500 mt-1">{b.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
