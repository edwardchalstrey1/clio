import { useState, useEffect, useCallback } from 'react';
import MapViewer from './components/MapViewer';
import Controls from './components/Controls';
import InfoBox from './components/InfoBox';
import Legend from './components/Legend';
import YearJump from './components/YearJump';
import LandingScreen from './components/LandingScreen';
import ClioguesserLogic from './components/ClioguesserLogic';
import './App.css';

function App() {
  const [year, setYear] = useState(1700);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [visiblePolities, setVisiblePolities] = useState([]);
  const [selectedPolity, setSelectedPolity] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [polityStats, setPolityStats] = useState({});
  const [geoData, setGeoData] = useState(null);
  const [appMode, setAppMode] = useState(null);

  // Fetch and index data on mount with simulated progress
  useEffect(() => {
    // Simulated smooth loading bar
    const startTime = Date.now();
    const duration = 2000; // 2 seconds estimated
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.round((elapsed / duration) * 100), 98); // Clip at 98 until data loaded
      setLoadProgress(progress);
    }, 50);

    // Fetch partitioned data
    const parts = ['/data_part1.json', '/data_part2.json', '/data_part3.json'];
    let completedParts = 0;

    Promise.all(parts.map(url => 
      fetch(url).then(res => {
        completedParts++;
        // Update progress based on completed parts (33% each)
        // We still keep the simulated bar but jumping to specific milestones
        const partProgress = Math.round((completedParts / parts.length) * 100);
        setLoadProgress(prev => Math.max(prev, partProgress - 2)); 
        return res.json();
      })
    )).then(dataParts => {
      // Merge features
      const mergedData = {
        type: "FeatureCollection",
        name: "cliopatria_polities_merged",
        crs: dataParts[0].crs,
        features: dataParts.flatMap(p => p.features)
      };

      const stats = {};
      mergedData.features.forEach(f => {
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

        if (!stats[name].yearlyData[p.FromYear]) {
          stats[name].yearlyData[p.FromYear] = {
            area: 0,
            color: p.Color
          };
        }
        stats[name].yearlyData[p.FromYear].area += (p.Area || 0);
      });

      setPolityStats(stats);
      setGeoData(mergedData);

      // Complete the loading bar
      clearInterval(progressInterval);
      setLoadProgress(99);
    }).catch(err => {
      console.error('Error loading map data:', err);
    });

    return () => clearInterval(progressInterval);
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

  if (!appMode) {
    return <LandingScreen onSelectMode={setAppMode} loadProgress={loadProgress} />;
  }

  if (appMode === 'game') {
    return (
      <div className="app-container">
        {!geoData && (
          <div className="loading-overlay">
            <div className="brand-section" style={{ marginBottom: '40px', textAlign: 'center', alignItems: 'center' }}>
              <h1 className="title" style={{ fontSize: '3rem', margin: 0 }}>CLIO<span style={{ color: '#a3dafec7' }}>GUESSER</span></h1>
              <p className="subtitle" style={{ fontSize: '1.2rem', opacity: 0.8 }}>Test your historical knowledge</p>
            </div>

            <div className="loading-bar-container">
              <div className="loading-bar-fill" style={{ width: `${loadProgress}%` }}></div>
            </div>

            <div className="loading-text" style={{ marginTop: '16px', fontSize: '0.8rem' }}>
              {`Loading Historical Data: ${loadProgress}%`}
            </div>
          </div>
        )}
        {geoData && <ClioguesserLogic geoData={geoData} polityStats={polityStats} onBack={() => setAppMode(null)} />}
      </div>
    );
  }

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-overlay">
          <div className="brand-section" style={{ marginBottom: '40px', textAlign: 'center', alignItems: 'center' }}>
            <h1 className="title" style={{ fontSize: '3rem', margin: 0 }}>CLIO<span style={{ color: '#a3dafec7' }}>PATRIA</span></h1>
            <p className="subtitle" style={{ fontSize: '1.2rem', opacity: 0.8 }}>A Map of World History</p>
          </div>

          <div className="loading-bar-container">
            <div className="loading-bar-fill" style={{ width: `${loadProgress}%` }}></div>
          </div>

          <div className="loading-text" style={{ marginTop: '16px', fontSize: '0.8rem' }}>
            {`Loading Historical Data: ${loadProgress}%`}
          </div>
        </div>
      )}

      <MapViewer
        year={year}
        data={geoData}
        onLoaded={handleLoaded}
        setVisiblePolities={setVisiblePolities}
        onPolitySelect={setSelectedPolity}
        selectedPolity={selectedPolity}
      />

      <div className="large-year-overlay">
        <div className="year-display">
          <span className="year-value">{Math.abs(year)}</span>
          <span className="year-suffix">{year < 0 ? 'BCE' : 'CE'}</span>
        </div>
        <YearJump year={year} setYear={setYear} isPlaying={isPlaying} />
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
