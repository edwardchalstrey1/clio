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
  const [dataReady, setDataReady] = useState(false);
  const [appMode, setAppMode] = useState(null);
  
  // Game mode map states to proxy into MapViewer
  const [gameYear, setGameYear] = useState(0);
  const [gameRevealHandler, setGameRevealHandler] = useState(null);
  const [gameReady, setGameReady] = useState(false);

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

    fetch('/polityStats.json')
      .then(res => res.json())
      .then(stats => {
        clearInterval(progressInterval);
        setLoadProgress(100);
        setPolityStats(stats);
        setDataReady(true);
      })
      .catch(err => {
        console.error("Error loading GeoJSON", err);
        clearInterval(progressInterval);
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

  useEffect(() => {
    if (appMode === 'game' && !gameReady && visiblePolities.length > 0) {
      setGameReady(true);
    }
  }, [appMode, gameReady, visiblePolities]);

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

  const handleGameModeBack = () => {
    setAppMode(null);
    setGameReady(false);
  };

  const handleViewerModeBack = () => {
    setAppMode(null);
    setSelectedPolity(null);
  };

  const isModeLoading = (!appMode) || (appMode === 'game' && !gameReady) || (appMode === 'viewer' && loading);

  return (
    <div className="app-container">
      {/* Background loading / mode selection overlays */}
      {(!appMode) && (
        <LandingScreen onSelectMode={setAppMode} loadProgress={loadProgress} mode={null} />
      )}
      
      {(appMode === 'game' && !dataReady) && (
        <div className="loading-overlay" style={{ zIndex: 3000 }}>
          <div className="brand-section" style={{ marginBottom: '40px', textAlign: 'center', alignItems: 'center' }}>
            <h1 className="title" style={{ fontSize: '3rem', margin: 0 }}>CLIO<span style={{ color: '#ff7e67' }}>GUESSER</span></h1>
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

      {(appMode === 'viewer' && loading) && (
        <div className="loading-overlay" style={{ zIndex: 3000 }}>
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

      {/* MapViewer unconditionally mounted to prevent WebGL memory leaks on unmount */}
      <div style={{ display: isModeLoading ? 'none' : 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative', width: '100%' }}>
        <MapViewer
          year={appMode === 'game' ? gameYear : year}
          dataReady={dataReady}
          interactiveMode={appMode === 'game' ? 'game' : 'viewer'}
          onLoaded={handleLoaded}
          setVisiblePolities={setVisiblePolities}
          onPolitySelect={appMode === 'game' ? (pol) => gameRevealHandler && gameRevealHandler(pol) : setSelectedPolity}
          selectedPolity={appMode === 'game' ? null : selectedPolity}
        />
      </div>

      {/* Viewer UI */}
      {appMode === 'viewer' && !loading && (
        <>
          <button className="exit-btn" onClick={handleViewerModeBack} style={{ zIndex: 2000 }}>
            &#8592; Exit
          </button>
          
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

          <Controls
            year={year}
            setYear={setYear}
            isPlaying={isPlaying}
            onTogglePlay={togglePlayback}
            onStep={handleStep}
          />
        </>
      )}

      {/* Game UI */}
      {appMode === 'game' && dataReady && (
        <ClioguesserLogic 
          polityStats={polityStats} 
          onBack={handleGameModeBack}
          onStateUpdate={(y, revealHandler) => {
            setGameYear(y);
            setGameRevealHandler(() => revealHandler);
          }}
        />
      )}
    </div>
  );
}

export default App;
