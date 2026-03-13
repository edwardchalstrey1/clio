import { useState, useEffect, useCallback } from 'react';
import MapViewer from './components/MapViewer';
import Controls from './components/Controls';
import InfoBox from './components/InfoBox';
import Legend from './components/Legend';
import './App.css';

function App() {
  const [year, setYear] = useState(1700);
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
          <div className="loading-text">Chronicling History...</div>
          <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '12px', fontStyle: 'italic' }}>
            Retrieving historical coordinates
          </div>
        </div>
      )}
      
      <MapViewer 
        year={year} 
        onLoaded={handleLoaded} 
        setVisiblePolities={setVisiblePolities}
        onPolitySelect={setSelectedPolity}
        selectedPolity={selectedPolity}
      />

      <div className="large-year-overlay">
        <span className="year-value">{Math.abs(year)}</span>
        <span className="year-suffix">{year < 0 ? 'BCE' : 'CE'}</span>
      </div>

      <InfoBox 
        selectedPolity={selectedPolity} 
        onClose={() => setSelectedPolity(null)} 
      />

      <Legend 
        polities={visiblePolities} 
        onPolityClick={setSelectedPolity}
        selectedPolity={selectedPolity}
      />
      
      {!loading && (
        <Controls 
          year={year} 
          setYear={setYear} 
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStep={handleStep}
        />
      )}
    </div>
  );
}

export default App;
