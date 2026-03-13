import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const Controls = ({ year, setYear, mode, setMode, isPlaying, onTogglePlay, onStep }) => {
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
            
            <input
              type="range"
              min="-3400"
              max="2024"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="slider"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#64748b] font-serif uppercase tracking-[0.2em]">
            <span>3400 BCE</span>
            <span>2024 CE</span>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="toggle-section">
          <div
            className={`radio-option ${mode === 'Polities' ? 'active' : ''}`}
            onClick={() => setMode('Polities')}
          >
            Polities
          </div>
          <div
            className={`radio-option ${mode === 'Components' ? 'active' : ''}`}
            onClick={() => setMode('Components')}
          >
            Components
          </div>
        </div>

      </div>
    </div>
  );
};

export default Controls;
