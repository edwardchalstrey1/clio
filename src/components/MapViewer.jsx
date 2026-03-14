import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapViewer = ({ year, onLoaded, setVisiblePolities, onPolitySelect, selectedPolity }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isStyleReady, setIsStyleReady] = useState(false);

  // Helper to generate filter (Always Polities mode now)
  const getFilter = (y) => {
    const yearNum = parseInt(y);
    return [
      'all',
      ['<=', ['get', 'FromYear'], yearNum],
      ['>=', ['get', 'ToYear'], yearNum],
      ['any', ['==', ['get', 'MemberOf'], null], ['==', ['get', 'MemberOf'], '']]
    ];
  };

  // Selection on click
  const updateLegend = useCallback(() => {
    if (!map.current) return;
    const features = map.current.queryRenderedFeatures({ layers: ['cliopatria-fills'] });
    const visiblePolities = features.map(f => f.properties);
    setVisiblePolities(visiblePolities);
  }, [setVisiblePolities]);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-positron': {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'carto-positron-layer',
            type: 'raster',
            source: 'carto-positron',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [20, 20],
      zoom: 1.5,
      dragRotate: false,
      touchPitch: false,
      pitchWithRotate: false,
      boxZoom: false,
      keyboard: false
    });

    map.current.on('load', () => {
      map.current.addSource('cliopatria', {
        type: 'geojson',
        data: '/data.geojson',
        generateId: true
      });

      const initialFilter = getFilter(year);

      // Base layers
      map.current.addLayer({
        id: 'cliopatria-fills',
        type: 'fill',
        source: 'cliopatria',
        layout: {},
        filter: initialFilter,
        paint: {
          'fill-color': ['get', 'Color'],
          'fill-opacity': 0.5,
          'fill-outline-color': ['get', 'Color']
        }
      });

      map.current.addLayer({
        id: 'cliopatria-borders',
        type: 'line',
        source: 'cliopatria',
        layout: {},
        filter: initialFilter,
        paint: {
          'line-color': ['get', 'Color'],
          'line-width': 1
        }
      });

      // Selection layers (always on top)
      map.current.addLayer({
        id: 'cliopatria-selection-fill',
        type: 'fill',
        source: 'cliopatria',
        layout: {},
        filter: ['==', ['get', 'DisplayName'], ''],
        paint: {
          'fill-color': '#e2b860',
          'fill-opacity': 0.9
        }
      });

      map.current.addLayer({
        id: 'cliopatria-selection-border',
        type: 'line',
        source: 'cliopatria',
        layout: {},
        filter: ['==', ['get', 'DisplayName'], ''],
        paint: {
          'line-color': '#0f172a',
          'line-width': 4
        }
      });

      // Simple hover effect
      map.current.on('mousemove', 'cliopatria-fills', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'cliopatria-fills', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // Selection on click
      map.current.on('click', 'cliopatria-fills', (e) => {
        const feature = e.features[0];
        onPolitySelect(feature.properties);
      });

      map.current.on('idle', updateLegend);
      map.current.on('moveend', updateLegend);

      setIsStyleReady(true);
      onLoaded();
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update filters and paint when year or selection changes
  useEffect(() => {
    if (!map.current || !isStyleReady || !map.current.getSource('cliopatria')) return;

    // Update filter
    const filter = getFilter(year);
    map.current.setFilter('cliopatria-fills', filter);
    map.current.setFilter('cliopatria-borders', filter);

    // Update selection layers
    const selectedName = selectedPolity?.DisplayName || '';
    const selectionFilter = ['==', ['get', 'DisplayName'], selectedName];
    map.current.setFilter('cliopatria-selection-fill', selectionFilter);
    map.current.setFilter('cliopatria-selection-border', selectionFilter);

    // Force legend update during playback
    updateLegend();
  }, [year, isStyleReady, selectedPolity, updateLegend]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapViewer;
