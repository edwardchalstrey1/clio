import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Github } from 'lucide-react';
import YearJump from './YearJump';

const Controls = ({ year, setYear, isPlaying, onTogglePlay, onStep, onBack }) => {
  const minYear = -3400;
  const maxYear = 2024;
  const range = maxYear - minYear;

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderTicks = () => {
    const ticks = [];
    const isMobile = screenWidth < 768;
    const skipFactor = isMobile ? 1000 : 500;

    for (let y = -3400; y <= 2000; y += 100) {
      if (isMobile && y === -3400) continue; // Skip start tick on mobile as requested

      const position = ((y - minYear) / range) * 100;
      // Show label if it matches skipFactor, or if it's start/end
      const isLabeled = y % skipFactor === 0 || y === minYear || y === 2000;

      ticks.push(
        <div key={y} className="tick" style={{ left: `${position}%`, position: 'absolute' }}>
          <div className="tick-line" style={{ height: isLabeled ? '8px' : '4px' }} />
          {isLabeled && (
            <div className="tick-label">
              {y < 0 ? `${Math.abs(y)}BCE` : y === 0 ? '0' : `${y}CE`}
            </div>
          )}
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="controls-panel">
      {screenWidth < 768 && (
        <div className="mobile-year-hud">
          <div className="year-display">
            <span className="year-value">{Math.abs(year)}</span>
            <span className="year-suffix">{year < 0 ? 'BCE' : 'CE'}</span>
          </div>
          <YearJump year={year} setYear={setYear} isPlaying={isPlaying} />
        </div>
      )}
      <div className="bottom-bar-layout">

        {/* Brand Section - Left */}
        <div className="brand-section">
          <h1 className="title">CLIO<span style={{ color: '#a3dafec7' }}>PATRIA</span></h1>
          <p className="subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: screenWidth < 768 ? 'center' : 'flex-start' }}>
            <a
              href="https://github.com/Seshat-Global-History-Databank/cliopatria"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}
            >
              <Github size={12} />
            </a>
            <span>A Map of World History</span>
          </p>
          {onBack && (
            <button 
              onClick={onBack} 
              style={{ background: 'transparent', border: '1px solid var(--color-gold-muted)', color: 'var(--color-gold)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', marginTop: '8px', width: 'fit-content' }}
            >
              &#8592; Change Mode
            </button>
          )}
        </div>

        {/* Playback Controls - Center */}
        <div className="playback-controls">
          <button className="icon-btn-circle" onClick={() => onStep(-1)} title="Step Back">
            <SkipBack size={14} />
          </button>
          <button className="icon-btn-circle play-pause main-play" onClick={onTogglePlay} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button className="icon-btn-circle" onClick={() => onStep(1)} title="Step Forward">
            <SkipForward size={14} />
          </button>
        </div>

        {/* Timeline - Center Right */}
        <div className="timeline-wrapper">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="slider"
          />
          <div className="timeline-ticks">
            {renderTicks()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Controls;
