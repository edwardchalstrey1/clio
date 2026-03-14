import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Hash } from 'lucide-react';

const Controls = ({ year, setYear, isPlaying, onTogglePlay, onStep }) => {
  const minYear = -3400;
  const maxYear = 2024;
  const range = maxYear - minYear;
  const [inputVal, setInputVal] = useState(year.toString());

  // Keep input in sync with external year changes
  useEffect(() => {
    setInputVal(year.toString());
  }, [year]);

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
  };

  const submitYear = () => {
    let newYear = parseInt(inputVal);
    if (isNaN(newYear)) {
      setInputVal(year.toString());
      return;
    }
    newYear = Math.max(minYear, Math.min(maxYear, newYear));
    setYear(newYear);
    setInputVal(newYear.toString());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitYear();
      e.target.blur();
    }
  };

  const renderTicks = () => {
    const ticks = [];
    for (let y = -3400; y <= 2000; y += 100) {
      const position = ((y - minYear) / range) * 100;
      const isLabeled = y % 500 === 0 || y === minYear || y === 2000;
      
      ticks.push(
        <div key={y} className="tick" style={{ left: `${position}%`, position: 'absolute' }}>
          <div className="tick-line" style={{ height: isLabeled ? '8px' : '4px' }} />
          {isLabeled && (
            <div className="tick-label">
              {y < 0 ? `${Math.abs(y)}B` : y === 0 ? '0' : `${y}C`}
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
        
        {/* Brand Section - Left */}
        <div className="brand-section">
          <h1 className="title">CLIOPATRIA</h1>
          <p className="subtitle">Seshat Global History Databank</p>
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

        {/* Year Jump - Far Right */}
        <div className="year-jump-container">
          <Hash size={14} className="text-slate-500" />
          <input
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            onBlur={submitYear}
            onKeyDown={handleKeyDown}
            className="year-jump-input"
            placeholder="Year"
          />
        </div>

      </div>
    </div>
  );
};

export default Controls;
