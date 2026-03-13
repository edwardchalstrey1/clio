import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const Controls = ({ year, setYear, isPlaying, onTogglePlay, onStep }) => {
  const minYear = -3400;
  const maxYear = 2024;
  const range = maxYear - minYear;

  const renderTicks = () => {
    const ticks = [];
    // Every 100 years
    for (let y = minYear; y <= maxYear; y += 100) {
      const position = ((y - minYear) / range) * 100;
      const isLabeled = y % 500 === 0 || y === minYear || y === 2000;
      
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
      <div className="bottom-bar-layout">
        
        {/* Brand/Title */}
        <div className="brand-section">
          <h1 className="title">Cliopatria</h1>
          <p className="subtitle">Seshat Global History Databank</p>
        </div>

        {/* Timeline & Playback */}
        <div className="timeline-section">
          <div className="playback-section">
            <button className="icon-btn" onClick={() => onStep(-1)}>
              <SkipBack size={16} />
            </button>
            <button className="icon-btn" onClick={onTogglePlay}>
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            <button className="icon-btn" onClick={() => onStep(1)}>
              <SkipForward size={16} />
            </button>
            
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

      </div>
    </div>
  );
};

export default Controls;
