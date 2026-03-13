import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapViewer = ({ year, mode, onLoaded }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loading, setLoading] = useState(true);

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

      map.current.addLayer({
        id: 'cliopatria-fills',
        type: 'fill',
        source: 'cliopatria',
        layout: {},
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
        paint: {
          'line-color': ['get', 'Color'],
          'line-width': 1
        }
      });

      // Simple hover effect
      map.current.on('mousemove', 'cliopatria-fills', (e) => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'cliopatria-fills', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // Popup on click
      map.current.on('click', 'cliopatria-fills', (e) => {
        const feature = e.features[0];
        const { DisplayName, FromYear, ToYear, Wikipedia } = feature.properties;
        
        const content = `
          <div style="font-family: inherit;">
            <div style="font-weight: 800; font-size: 1.1rem; margin-bottom: 4px;">${DisplayName}</div>
            <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 8px;">${FromYear} - ${ToYear}</div>
            ${Wikipedia ? `<a href="https://en.wikipedia.org/wiki/${Wikipedia}" target="_blank" style="color: #60a5fa; text-decoration: none; font-size: 0.8rem; font-weight: 600;">Wikipedia &rarr;</a>` : ''}
          </div>
        `;

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(content)
          .addTo(map.current);
      });

      setLoading(false);
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
    if (!map.current || !map.current.isStyleLoaded() || !map.current.getSource('cliopatria')) return;

    const yearNum = parseInt(year);
    const modeFilter = mode === 'Polities'
      ? ['any', ['==', ['get', 'MemberOf'], null], ['==', ['get', 'MemberOf'], '']]
      : ['any', ['==', ['get', 'Components'], null], ['==', ['get', 'Components'], '']];

    const filter = [
      'all',
      ['<=', ['get', 'FromYear'], yearNum],
      ['>=', ['get', 'ToYear'], yearNum],
      modeFilter
    ];

    map.current.setFilter('cliopatria-fills', filter);
    map.current.setFilter('cliopatria-borders', filter);
  }, [year, mode, loading]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapViewer;
