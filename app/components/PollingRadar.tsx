"use client";
import { useState, useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

/**
 * PollingRadar Component
 * 
 * Hyperlocal polling booth discovery engine powered by Google Maps Places API.
 * Features:
 * - Dynamic geolocation based on PIN code or browser location
 * - Interactive map rendering with custom markers
 * - Responsive UI for real-time booth identification
 * 
 * @param {Object} props - Component props.
 * @param {string} props.state - The user's current state for location context.
 */
export default function PollingRadar({ state }: { state: string }): JSX.Element {
  const [pinCode, setPinCode] = useState<string>("");
  const [booths, setBooths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapObj, setMapObj] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    const initMap = async (): Promise<void> => {
      try {
        setOptions({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
        });

        const { Map } = await importLibrary("maps") as google.maps.MapsLibrary;
        if (mapRef.current) {
          const m = new Map(mapRef.current, {
            center: { lat: 20.5937, lng: 78.9629 },
            zoom: 5,
            mapId: "LOKTANTRA_RADAR_MAP",
            disableDefaultUI: true,
          });
          setMapObj(m);
        }
      } catch {
        setIsLoading(false);
      }
    };
    initMap();
  }, []);

  const searchBooths = async (): Promise<void> => {
    if (!pinCode && !mapObj) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/booth?pin=${pinCode}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setBooths(data.booths);
      
      if (mapObj && data.booths.length > 0) {
        const first = data.booths[0];
        mapObj.setCenter({ lat: first.lat, lng: first.lng });
        mapObj.setZoom(13);

        const { AdvancedMarkerElement } = await importLibrary("marker") as google.maps.MarkerLibrary;
        
        markers.forEach((m) => m.map = null);
        const newMarkers = data.booths.map((b: any) => {
          return new AdvancedMarkerElement({
            map: mapObj,
            position: { lat: b.lat, lng: b.lng },
            title: b.name,
          });
        });
        setMarkers(newMarkers);
      }
    } catch {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder="Enter PIN Code"
          className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-500 transition"
        />
        <button 
          onClick={searchBooths}
          disabled={isLoading}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition disabled:opacity-50"
        >
          {isLoading ? "..." : "SEARCH"}
        </button>
      </div>

      <div ref={mapRef} className="flex-1 rounded-2xl bg-gray-100 border-2 border-gray-50 overflow-hidden" />
      
      {booths.length > 0 && (
        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto pr-2 no-scrollbar">
          {booths.map((b, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase">{b.name}</p>
                <p className="text-[8px] text-gray-400 truncate w-40">{b.address}</p>
              </div>
              <span className="text-[8px] bg-white border border-gray-200 px-2 py-1 rounded-full font-bold text-gray-600">
                {b.distance}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
