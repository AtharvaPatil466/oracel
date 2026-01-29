"use client";
import { useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './IndraMap.css';

const INITIAL_VIEW_STATE = {
  center: [78.9629, 22.5937],
  zoom: 1.8,
  pitch: 45,
  bearing: 0
};

// Open Source tactical dark matter style
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export function IndiaMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [viewState, setViewState] = useState({
    latitude: INITIAL_VIEW_STATE.center[1],
    longitude: INITIAL_VIEW_STATE.center[0],
    zoom: INITIAL_VIEW_STATE.zoom,
    pitch: INITIAL_VIEW_STATE.pitch
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.INDRA_MAP_STATUS = "Effect Triggered";

    if (map.current) {
      window.INDRA_MAP_STATUS = "Map Already Exists";
      return;
    }

    if (!mapContainer.current) {
      window.INDRA_MAP_STATUS = "Error: No Container";
      return;
    }

    try {
      window.INDRA_MAP_STATUS = "Initializing MapLibre...";
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE,
        center: INITIAL_VIEW_STATE.center,
        zoom: INITIAL_VIEW_STATE.zoom,
        pitch: INITIAL_VIEW_STATE.pitch,
        bearing: INITIAL_VIEW_STATE.bearing,
        antialias: true,
        attributionControl: false
      });
      window.INDRA_MAP_STATUS = "Map Object Created";

      // SET PROJECTION TO GLOBE
      map.current.on('style.load', () => {
        window.INDRA_MAP_STATUS = "Style Loaded - Configuring Globe";
        map.current.setProjection({
          type: 'globe'
        });

        // Add 3D Terrain (Terrarium)
        map.current.addSource('terrain-rgb', {
          type: 'raster-dem',
          tiles: [
            'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
          ],
          encoding: 'terrarium',
          tileSize: 256
        });

        map.current.setTerrain({
          source: 'terrain-rgb',
          exaggeration: 1.5
        });

        // ENHANCE VISUALS (Cinematic Indigo Theme)
        if (map.current.getLayer('water')) {
          map.current.setPaintProperty('water', 'fill-color', '#050b1a');
        }

        // Add Glowing Land Boundaries
        map.current.addLayer({
          id: 'country-boundaries',
          type: 'line',
          source: 'carto',
          'source-layer': 'admin_0_boundary',
          paint: {
            'line-color': '#00ffff',
            'line-width': 1,
            'line-opacity': 0.6,
            'line-blur': 1
          }
        });

        // Add Sky Layer with cinematic sunset gradient
        if (!map.current.getLayer('sky')) {
          map.current.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 90.0],
              'sky-atmosphere-sun-intensity': 20,
              'sky-atmosphere-color': '#0088ff',
              'sky-atmosphere-halo-color': '#000033'
            }
          });
        }

        // Add Rainfall Data
        map.current.addSource('rainfall-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', geometry: { type: 'Point', coordinates: [72.8777, 19.0760] }, properties: { intensity: 5, rainfall: 85 } }, // Mumbai
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.1025, 28.7041] }, properties: { intensity: 3, rainfall: 45 } }, // Delhi
              { type: 'Feature', geometry: { type: 'Point', coordinates: [80.2707, 13.0827] }, properties: { intensity: 4, rainfall: 65 } }, // Chennai
              { type: 'Feature', geometry: { type: 'Point', coordinates: [88.3639, 22.5726] }, properties: { intensity: 2, rainfall: 30 } }, // Kolkata
              { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }, properties: { intensity: 6, rainfall: 95 } }  // Bangalore
            ]
          }
        });

        map.current.addLayer({
          id: 'rainfall-heatmap',
          type: 'heatmap',
          source: 'rainfall-data',
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'rainfall'], 0, 0, 100, 1],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'rgba(0, 255, 255, 0.2)',
              0.4, 'rgba(0, 255, 255, 0.5)',
              0.6, 'rgba(0, 255, 255, 0.8)',
              0.8, 'rgba(0, 255, 255, 0.95)',
              1, '#00ffff'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 4, 9, 30],
            'heatmap-opacity': 0.7
          }
        });
        window.INDRA_MAP_STATUS = "Globe & Terrain Configured";
      });

      // Update state on move
      map.current.on('move', () => {
        const center = map.current.getCenter();
        setViewState({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.current.getZoom(),
          pitch: map.current.getPitch()
        });
      });
    } catch (err) {
      window.INDRA_MAP_STATUS = "Error during initialization: " + err.message;
      console.error("MapLibre Init Error:", err);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="indra-container">
      <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100vh' }} />

      {/* UI Overlays */}
      <Header />
      <LeftPanel />
      <RightPanel />
      <StatusBar viewState={viewState} />
    </div>
  );
}

// Header Component
function Header() {
  return (
    <div className="indra-header">
      <div className="header-title">PROJECT INDRA</div>
      <div className="header-subtitle">MONSOON RESILIENCE COMMAND CENTER</div>
      <div className="header-status">
        <span className="status-indicator">●</span>
        <span>SYSTEM OPERATIONAL</span>
      </div>
    </div>
  );
}

// Left Panel - Strategy Input
function LeftPanel() {
  const [command, setCommand] = useState('');

  const handleExecute = () => {
    console.log('Executing command:', command);
  };

  return (
    <div className="glass-panel left">
      <div className="panel-header">
        <span className="panel-title">Mission Control</span>
        <span className="status-indicator" style={{ color: '#00ff88' }}>●</span>
      </div>

      <div className="panel-content">
        <input
          type="text"
          className="tactical-input"
          placeholder="Enter tactical command..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
        />

        <button className="tactical-button" onClick={handleExecute}>
          Execute Command
        </button>

        <div className="command-history">
          <div className="section-title">Recent Operations</div>
          <div className="history-item">Engine: MapLibre v3 (Native Globe)</div>
          <div className="history-item">Projection: Global Sphere Display</div>
          <div className="history-item">Status: 100% Free / Open Source</div>
        </div>
      </div>
    </div>
  );
}

// Right Panel - Analytics
function RightPanel() {
  return (
    <div className="glass-panel right">
      <div className="panel-header">
        <span className="panel-title">Tactical Analytics</span>
        <span className="status-indicator" style={{ color: '#00ff88' }}>●</span>
      </div>

      <div className="panel-content">
        <div className="metric">
          <span className="metric-label">Monsoon Coverage</span>
          <span className="metric-value" style={{ color: '#00ff88' }}>87%</span>
        </div>

        <div className="metric">
          <span className="metric-label">Active Alerts</span>
          <span className="metric-value" style={{ color: '#ffaa00' }}>12</span>
        </div>

        <div className="metric">
          <span className="metric-label">Reservoir Capacity</span>
          <span className="metric-value" style={{ color: '#00ff88' }}>76%</span>
        </div>

        <div className="metric">
          <span className="metric-label">Flood Risk Index</span>
          <span className="metric-value">2.3</span>
        </div>

        <div className="section-title">Regional Status</div>

        <div className="region-status">
          <span>Maharashtra</span>
          <span className="status-badge good">OPTIMAL</span>
        </div>
        <div className="region-status">
          <span>Kerala</span>
          <span className="status-badge warning">MONITOR</span>
        </div>
        <div className="region-status">
          <span>Tamil Nadu</span>
          <span className="status-badge good">OPTIMAL</span>
        </div>
      </div>
    </div>
  );
}

// Status Bar
function StatusBar({ viewState }) {
  return (
    <div className="status-bar">
      <div className="status-item">
        LAT: {viewState.latitude.toFixed(4)}°
      </div>
      <div className="status-item">
        LON: {viewState.longitude.toFixed(4)}°
      </div>
      <div className="status-item">
        ZOOM: {viewState.zoom.toFixed(1)}
      </div>
      <div className="status-item">
        PITCH: {viewState.pitch.toFixed(0)}°
      </div>
    </div>
  );
}
