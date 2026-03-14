import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';

const Legend = ({ polities, onPolityClick, selectedPolity }) => {
  const legendRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(window.innerWidth < 768);
  
  // Deduplicate by DisplayName
  const uniquePolities = Array.from(new Map(polities.map(p => [p.DisplayName, p])).values())
    .sort((a, b) => a.DisplayName.localeCompare(b.DisplayName));

  // Auto-scroll to selected polity
  useEffect(() => {
    if (selectedPolity && legendRef.current && !isMinimized) {
      const activeEl = legendRef.current.querySelector('.legend-item.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedPolity, isMinimized]);

  return (
    <div className={`legend-panel ${isMinimized ? 'minimized' : ''}`}>
      <div 
        className="legend-header"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Users size={14} className="text-gold flex-shrink-0" />
          <span className="uppercase tracking-[0.05em] font-display text-[10px] font-bold truncate">
            {isMinimized ? `Polities (${uniquePolities.length})` : `Visible Polities (${uniquePolities.length})`}
          </span>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
          {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {!isMinimized && (
        <div className="legend-items" ref={legendRef}>
          {uniquePolities.map((polity, idx) => (
            <div
              key={`${polity.DisplayName}-${idx}`}
              className={`legend-item ${selectedPolity?.DisplayName === polity.DisplayName ? 'active' : ''}`}
              onClick={() => onPolityClick(polity)}
            >
              <div
                className="legend-color"
                style={{ backgroundColor: polity.Color }}
              />
              <div className="flex-grow truncate">{polity.DisplayName}</div>
            </div>
          ))}
          {uniquePolities.length === 0 && (
            <div className="text-[10px] text-slate-500 italic px-3 py-4 text-center">
              Scanning the horizon...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Legend;
