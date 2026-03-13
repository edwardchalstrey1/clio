import { History, Layout, Map as MapIcon } from 'lucide-react';

const Controls = ({ year, setYear, mode, setMode }) => {
  return (
    <div className="controls-panel">
      <div className="flex items-center gap-2 mb-1">
        <MapIcon size={20} className="text-blue-400" />
        <h1 className="title">Cliopatria</h1>
      </div>
      <p className="subtitle">Global History Databank Viewer</p>

      <div className="control-group">
        <label className="control-label">
          <div className="flex items-center gap-2">
            <History size={14} />
            Time Travel
          </div>
        </label>
        <div className="year-input-container">
          <div className="year-display">{year}</div>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="year-input"
            min="-3400"
            max="2024"
          />
        </div>
        <input
          type="range"
          min="-3400"
          max="2024"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="slider"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
          <span>3400 BCE</span>
          <span>PRESENT</span>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">
          <div className="flex items-center gap-2">
            <Layout size={14} />
            Display Mode
          </div>
        </label>
        <div className="radio-group">
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

      <div className="mt-8 pt-6 border-t border-slate-800 text-[10px] text-slate-500 italic">
        GPU-accelerated vector rendering of 200,000+ years of history data.
      </div>
    </div>
  );
};

export default Controls;
