import { useState, useEffect, useCallback } from 'react';
import MapViewer from './components/MapViewer';
import Controls from './components/Controls';
import InfoBox from './components/InfoBox';
import Legend from './components/Legend';
import './App.css';

function App() {
  const [year, setYear] = useState(1700);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visiblePolities, setVisiblePolities] = useState([]);
  const [selectedPolity, setSelectedPolity] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [polityStats, setPolityStats] = useState({});

  // Fetch and index data on mount with progress tracking
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/data.geojson');
    
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setLoadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
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
            area: p.Area,
            color: p.Color
          };
        });
        setPolityStats(stats);
      }
    };
    xhr.send();
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
             if (selectedPolity.Area !== sliceData.area) {
                setSelectedPolity(prev => ({
                   ...prev,
                   Area: sliceData.area
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
          <div className="brand-section" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 className="title" style={{ fontSize: '3rem', margin: 0 }}>Cliopatria</h1>
            <p className="subtitle" style={{ fontSize: '1.2rem', opacity: 0.8 }}>Seshat Global History Databank</p>
          </div>
          
          <div className="loading-bar-container">
            <div className="loading-bar-fill" style={{ width: `${loadProgress}%` }}></div>
          </div>
          
          <div className="loading-text" style={{ marginTop: '16px', fontSize: '0.8rem' }}>
            {loadProgress < 100 ? `Downloading Historical Data: ${loadProgress}%` : 'Mapping Chronological Borders...'}
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
