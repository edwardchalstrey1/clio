import { useState, useEffect, useCallback } from 'react';
import MapViewer from './components/MapViewer';
import Controls from './components/Controls';
import InfoBox from './components/InfoBox';
import Legend from './components/Legend';
import './App.css';

function App() {
  const [year, setYear] = useState(1700);
  const [mode, setMode] = useState('Polities');
  const [loading, setLoading] = useState(true);
  const [visiblePolities, setVisiblePolities] = useState([]);
  const [selectedPolity, setSelectedPolity] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback logic
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear((prev) => (prev >= 2024 ? -3400 : prev + 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleLoaded = useCallback(() => {
    // Switch to a random year once loaded
    const randomYear = Math.floor(Math.random() * (2024 - (-3400) + 1)) + (-3400);
    setYear(randomYear);
    setLoading(false);
  }, []);

  const handleStep = (delta) => {
    setIsPlaying(false);
    setYear((prev) => {
      const next = prev + delta;
      return Math.min(2024, Math.max(-3400, next));
    });
  };

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div style={{ fontWeight: 600, color: '#94a3b8' }}>Loading Historical Data...</div>
          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '8px' }}>
            Downloading and processing vector polygons (200MB)
          </div>
        </div>
      )}
      
      <MapViewer 
        year={year} 
        mode={mode} 
        onLoaded={handleLoaded} 
        setVisiblePolities={setVisiblePolities}
        onPolitySelect={setSelectedPolity}
      />

      <div className="large-year-overlay">
        {year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}
      </div>

      <InfoBox 
        selectedPolity={selectedPolity} 
        onClose={() => setSelectedPolity(null)} 
      />

      <Legend 
        polities={visiblePolities} 
        onPolityClick={setSelectedPolity}
      />
      
      {!loading && (
        <Controls 
          year={year} 
          setYear={setYear} 
          mode={mode} 
          setMode={setMode} 
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStep={handleStep}
        />
      )}
    </div>
  );
}

export default App;
