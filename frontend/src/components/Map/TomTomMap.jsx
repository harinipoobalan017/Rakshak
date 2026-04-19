import { useEffect, useRef } from 'react';

const SEVERITY_COLOR = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#ef4444',
  critical: '#8b5cf6',
};

export default function TomTomMap({ incidents = [], onMarkerClick }) {
  const mapRef     = useRef(null);
  const mapInstance = useRef(null);
  const markers    = useRef([]);

  useEffect(() => {
    // Dynamically load TomTom SDK
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css';
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js';
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      mapInstance.current?.remove();
      document.head.removeChild(cssLink);
    };
  }, []);

  function initMap() {
    if (!window.tt || !mapRef.current) return;
    mapInstance.current = window.tt.map({
      key: import.meta.env.VITE_TOMTOM_API_KEY,
      container: mapRef.current,
      center: [80.2707, 13.0827],
      zoom: 12,
    });

    // Dark style override via CSS filter
    mapRef.current.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.85) saturate(0.9)';
  }

  // Add/update markers whenever incidents change
  useEffect(() => {
    if (!mapInstance.current || !window.tt) return;

    markers.current.forEach(m => m.remove());
    markers.current = [];

    incidents.forEach(incident => {
      if (!incident.latitude || !incident.longitude) return;

      const el = document.createElement('div');
      el.style.cssText = `
        width: 26px; height: 26px; border-radius: 50%;
        background: ${SEVERITY_COLOR[incident.severity] || '#888'};
        border: 3px solid rgba(255,255,255,0.2);
        cursor: pointer;
        box-shadow: 0 0 12px ${SEVERITY_COLOR[incident.severity] || '#888'},
                    0 0 24px ${SEVERITY_COLOR[incident.severity] || '#888'}44;
        animation: markerPulse 2s ease-in-out infinite;
        transition: transform 0.2s;
      `;
      el.onmouseenter = () => { el.style.transform = 'scale(1.3)'; };
      el.onmouseleave = () => { el.style.transform = 'scale(1)'; };
      el.onclick = () => onMarkerClick?.(incident);

      const marker = new window.tt.Marker({ element: el })
        .setLngLat([parseFloat(incident.longitude), parseFloat(incident.latitude)])
        .addTo(mapInstance.current);

      markers.current.push(marker);
    });
  }, [incidents]);

  return (
    <>
      <style>{`
        @keyframes markerPulse {
          0%,100% { box-shadow: 0 0 8px currentColor; }
          50%      { box-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
        }
      `}</style>
      <div className="map-wrap" style={{ height: '460px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
}