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
          'esri-gray': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          }
        },
        layers: [
          {
            id: 'esri-gray-layer',
            type: 'raster',
            source: 'esri-gray',
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

      map.current.addLayer({
        id: 'cliopatria-fills',
        type: 'fill',
        source: 'cliopatria',
        layout: {},
        filter: initialFilter,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
            '#e2b860',
            ['get', 'Color']
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
            0.9,
            0.5
          ],
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
          'line-color': [
            'case',
            ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
            '#0f172a', // Theme Ink/Dark Blue
            ['get', 'Color']
          ],
          'line-width': [
            'case',
            ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
            4,
            1
          ]
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

    // Update selection highlight
    map.current.setPaintProperty('cliopatria-fills', 'fill-color', [
      'case',
      ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
      '#e2b860',
      ['get', 'Color']
    ]);
    map.current.setPaintProperty('cliopatria-fills', 'fill-opacity', [
      'case',
      ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
      0.9,
      0.5
    ]);
    map.current.setPaintProperty('cliopatria-borders', 'line-color', [
      'case',
      ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
      '#0f172a',
      ['get', 'Color']
    ]);
    map.current.setPaintProperty('cliopatria-borders', 'line-width', [
      'case',
      ['==', ['get', 'DisplayName'], selectedPolity?.DisplayName || ''],
      4,
      1
    ]);

    // Force legend update during playback
    updateLegend();
  }, [year, isStyleReady, selectedPolity, updateLegend]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapViewer;
