import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Flame, Car, Heart, Waves, Zap, MapPin, Navigation, Eye, Locate } from 'lucide-react';
import { renderToString } from 'react-dom/server';

const SEVERITY_COLOR = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#ef4444',
  critical: '#8b5cf6',
};

// Component to dynamically center map
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.5 });
    // Fix for map not rendering fully in flex containers
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

// Custom Icon Generator
const createCustomIcon = (incident) => {
  const color = SEVERITY_COLOR[incident.severity] || '#8b5cf6';
  const typeIcon = incident.type === 'fire' ? '🔥' : 
                   incident.type === 'accident' ? '🚗' : 
                   incident.type === 'medical' ? '❤️' : 
                   incident.type === 'flood' ? '🌊' : '⚡';

  const html = `
    <div style="
      position: relative; 
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="
        position: absolute; inset: 0; border-radius: 50%;
        background: radial-gradient(circle at center, ${color}cc, transparent);
        border: 2px solid ${color};
        box-shadow: 0 0 15px ${color}80;
        animation: mapMarkerPulse 2s infinite ease-in-out;
      "></div>
      <span style="position: relative; z-index: 2; font-size: 18px;">${typeIcon}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const userIcon = L.divIcon({
  html: `
    <div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; inset:0; background:#3b82f6; border-radius:50%; border:3px solid white; box-shadow:0 0 10px #3b82f6;"></div>
      <div style="position:absolute; inset:-10px; border:2px solid #3b82f6; border-radius:50%; animation: livePulseRing 2s infinite;"></div>
    </div>
  `,
  className: 'user-leaflet-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export default function LiveMap({ incidents = [], onMarkerClick }) {
  const [userLocation, setUserLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    // Get initial location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(13);
      },
      () => {
        // Fallback to average of incidents or Bangalore
        if (incidents.length > 0) {
          setMapCenter([incidents[0].latitude, incidents[0].longitude]);
          setMapZoom(12);
        } else {
          setMapCenter([12.9716, 77.5946]); // Bangalore
          setMapZoom(12);
        }
      }
    );
  }, []);

  let watchId = null;
  const toggleTracking = () => {
    if (tracking) {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setTracking(false);
    } else {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
      setTracking(true);
    }
  };

  const centerUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(14);
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', overflow: 'hidden' }}>
      <style>{`
        .custom-leaflet-marker { background: transparent; border: none; }
        .user-leaflet-marker { background: transparent; border: none; }
        @keyframes mapMarkerPulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,0,0,0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(0,0,0,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
        }
        @keyframes livePulseRing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes radarScan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .leaflet-popup-content-wrapper { background: rgba(17,24,39,0.95); color: white; backdrop-filter: blur(10px); border: 1px solid #1f2d45; border-radius: 12px; }
        .leaflet-popup-tip { background: rgba(17,24,39,0.95); border: 1px solid #1f2d45; }
      `}</style>

      {/* Control Buttons Overlay */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={toggleTracking} style={{
          width: 44, height: 44, borderRadius: '12px', cursor: 'pointer',
          background: tracking ? 'rgba(59,130,246,0.3)' : 'rgba(17,24,39,0.8)',
          border: `1px solid ${tracking ? '#3b82f6' : '#1f2d45'}`,
          color: tracking ? '#60a5fa' : '#94a3b8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', transition: 'all 0.3s'
        }}>
          <Eye size={20} />
        </button>
        <button onClick={centerUser} style={{
          width: 44, height: 44, borderRadius: '12px', cursor: 'pointer',
          background: 'rgba(17,24,39,0.8)', border: '1px solid #1f2d45', color: '#94a3b8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', transition: 'all 0.3s'
        }}>
          <Locate size={20} />
        </button>
      </div>

      {/* Cyberpunk Scanning Radar Overlay (Novel Feature) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 400, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, transparent 30%, rgba(8,11,20,0.8) 100%)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: '200%', height: '200%',
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(59,130,246,0.1) 80%, rgba(59,130,246,0.4) 100%)',
          transformOrigin: '0 0',
          animation: 'radarScan 4s linear infinite',
          borderLeft: '2px solid rgba(59,130,246,0.5)',
        }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }} />
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        zoomControl={false}
        style={{ height: '100%', width: '100%', background: '#080b14' }}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {/* CartoDB Dark Matter Tiles (Free, No API Key, Premium Look) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />

        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon} />
            <Circle center={userLocation} radius={500} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }} />
          </>
        )}

        {incidents.map((incident) => {
          if (!incident.latitude || !incident.longitude) return null;
          return (
            <Marker 
              key={incident.id} 
              position={[incident.latitude, incident.longitude]} 
              icon={createCustomIcon(incident)}
              eventHandlers={{ click: () => onMarkerClick?.(incident) }}
            >
              <Popup className="custom-popup">
                <div style={{ width: '220px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                    <div style={{ fontWeight:700, textTransform:'capitalize', fontSize:'15px' }}>{incident.type}</div>
                    <span className={`badge badge-${incident.severity}`} style={{ fontSize:'10px' }}>{incident.severity}</span>
                  </div>
                  <p style={{ fontSize:'12px', color:'#94a3b8', margin:'0 0 10px 0', lineHeight:1.4 }}>
                    {incident.description?.slice(0, 80)}{incident.description?.length > 80 ? '...' : ''}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color:'#64748b' }}>
                    <MapPin size={12} /> {incident.address || `${incident.latitude}, ${incident.longitude}`}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
