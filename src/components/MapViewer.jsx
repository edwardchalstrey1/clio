import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapViewer = ({ year, mode, onLoaded, setVisiblePolities, onPolitySelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isStyleReady, setIsStyleReady] = useState(false);

  // Helper to generate filter
  const getFilter = (y, m) => {
    const yearNum = parseInt(y);
    const modeFilter = m === 'Polities'
      ? ['any', ['==', ['get', 'MemberOf'], null], ['==', ['get', 'MemberOf'], '']]
      : ['any', ['==', ['get', 'Components'], null], ['==', ['get', 'Components'], '']];

    return [
      'all',
      ['<=', ['get', 'FromYear'], yearNum],
      ['>=', ['get', 'ToYear'], yearNum],
      modeFilter
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

      const initialFilter = getFilter(year, mode);

      map.current.addLayer({
        id: 'cliopatria-fills',
        type: 'fill',
        source: 'cliopatria',
        layout: {},
        filter: initialFilter, // Apply filter immediately!
        paint: {
          'fill-color': ['get', 'Color'],
          'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 0.8, 0.5],
          'fill-outline-color': ['get', 'Color']
        }
      });

      map.current.addLayer({
        id: 'cliopatria-borders',
        type: 'line',
        source: 'cliopatria',
        layout: {},
        filter: initialFilter, // Apply filter immediately!
        paint: {
          'line-color': ['get', 'Color'],
          'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, 1]
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
        map.current.setFeatureState(
          { source: 'cliopatria', id: feature.id },
          { selected: true }
        );
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

  // Update filters when year or mode changes
  useEffect(() => {
    if (!map.current || !isStyleReady || !map.current.getSource('cliopatria')) return;

    const filter = getFilter(year, mode);
    map.current.setFilter('cliopatria-fills', filter);
    map.current.setFilter('cliopatria-borders', filter);
  }, [year, mode, isStyleReady]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapViewer;
