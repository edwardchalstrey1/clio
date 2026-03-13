import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapViewer = ({ year, onLoaded, setVisiblePolities, onPolitySelect }) => {
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

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-voyager': {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'carto-voyager-layer',
            type: 'raster',
            source: 'carto-voyager',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [20, 20],
      zoom: 2
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
          'fill-color': ['get', 'Color'],
          'fill-opacity': 0.5, // Static opacity
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
          'line-width': 1 // Static width
        }
      });

      // Simple hover effect
      map.current.on('mousemove', 'cliopatria-fills', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'cliopatria-fills', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // Selection on click (No map highlight state set here anymore)
      map.current.on('click', 'cliopatria-fills', (e) => {
        const feature = e.features[0];
        onPolitySelect(feature.properties);
      });

      // Query visible features
      const updateLegend = () => {
        const features = map.current.queryRenderedFeatures({ layers: ['cliopatria-fills'] });
        const visiblePolities = features.map(f => f.properties);
        setVisiblePolities(visiblePolities);
      };

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

  // Update filters when year changes
  useEffect(() => {
    if (!map.current || !isStyleReady || !map.current.getSource('cliopatria')) return;

    const filter = getFilter(year);
    map.current.setFilter('cliopatria-fills', filter);
    map.current.setFilter('cliopatria-borders', filter);
  }, [year, isStyleReady]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapViewer;
