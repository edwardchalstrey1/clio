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
  const [polityStats, setPolityStats] = useState({});

  // Fetch and index data on mount
  useEffect(() => {
    fetch('/data.geojson')
      .then(res => res.json())
      .then(data => {
        const stats = {};
        data.features.forEach(f => {
          const p = f.properties;
          const name = p.DisplayName;
          if (!stats[name]) {
            stats[name] = {
              minYear: p.FromYear,
              maxYear: p.ToYear,
              yearlyData: {}
            };
          }
          stats[name].minYear = Math.min(stats[name].minYear, p.FromYear);
          stats[name].maxYear = Math.max(stats[name].maxYear, p.ToYear);
          stats[name].yearlyData[p.FromYear] = {
            area: p.TerritorialArea,
            color: p.Color
          };
        });
        setPolityStats(stats);
      });
  }, []);

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

  // Sync selected polity with current year
  useEffect(() => {
    if (selectedPolity) {
      const stats = polityStats[selectedPolity.DisplayName];
      if (stats) {
        // Deselect if outside total historical range
        if (year < stats.minYear || year > stats.maxYear) {
          setSelectedPolity(null);
        } else {
          // Update area if we have a specific entry for this year
          // Note: The data might not have an entry for every single year of a duration
          // but we search for the closest slice starting at or before 'year'
          const years = Object.keys(stats.yearlyData).map(Number).sort((a, b) => b - a);
          const currentSliceStart = years.find(y => y <= year);
          
          if (currentSliceStart !== undefined) {
             const sliceData = stats.yearlyData[currentSliceStart];
             if (selectedPolity.TerritorialArea !== sliceData.area) {
                setSelectedPolity(prev => ({
                   ...prev,
                   TerritorialArea: sliceData.area
                }));
             }
          }
        }
      }
    }
  }, [year, polityStats]);

  const handleLoaded = useCallback(() => {
    // We only set loading to false if we actually have visible polities
    // This will be re-called by MapViewer as it updates the legend
  }, []);

  // Separate effect to handle the transition from loading to loaded
  useEffect(() => {
    if (loading && visiblePolities.length > 0) {
      const randomYear = Math.floor(Math.random() * (1950 - 1600 + 1)) + 1600;
      setYear(randomYear);
      setLoading(false);
    }
  }, [loading, visiblePolities]);

  const handleStep = (delta) => {
    setIsPlaying(false);
    setYear((prev) => {
      const next = prev + delta;
      return Math.min(2024, Math.max(-3400, next));
    });
  };

  const togglePlayback = () => {
    if (!isPlaying) {
      setSelectedPolity(null); // Deselect on play
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Chronicling History...</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '12px', fontStyle: 'italic', letterSpacing: '0.1em' }}>
            Retracing the borders of lost empires
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
        polityStats={polityStats}
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
          onTogglePlay={togglePlayback}
          onStep={handleStep}
        />
      )}
    </div>
  );
}

export default App;
