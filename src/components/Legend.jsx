import { useEffect, useRef } from 'react';

const Legend = ({ polities, onPolityClick, selectedPolity }) => {
  const legendRef = useRef(null);
  
  // Deduplicate by DisplayName
  const uniquePolities = Array.from(new Map(polities.map(p => [p.DisplayName, p])).values())
    .sort((a, b) => a.DisplayName.localeCompare(b.DisplayName));

  // Auto-scroll to selected polity
  useEffect(() => {
    if (selectedPolity && legendRef.current) {
      const activeEl = legendRef.current.querySelector('.legend-item.active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedPolity]);

  return (
    <div className="legend-panel">
      <div 
        className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.2em] mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Visible Polities ({uniquePolities.length})
      </div>
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
          <div className="text-[10px] text-slate-500 italic px-3">
            No polities in view
          </div>
        )}
      </div>
    </div>
  );
};

export default Legend;
