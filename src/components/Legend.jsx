const Legend = ({ polities, onPolityClick }) => {
  if (!polities || polities.length === 0) return null;

  // Filter unique polities by DisplayName
  const uniquePolities = Array.from(
    new Map(polities.map(p => [p.DisplayName, p])).values()
  ).sort((a, b) => a.DisplayName.localeCompare(b.DisplayName));

  return (
    <div className="legend-panel">
      <div 
        className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.2em] mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Visible Polities ({uniquePolities.length})
      </div>
      <div className="legend-items">
        {uniquePolities.map((polity, index) => (
          <div 
            key={index} 
            className="legend-item"
            onClick={() => onPolityClick(polity)}
          >
            <div 
              className="legend-color" 
              style={{ backgroundColor: polity.Color }}
            />
            <span className="truncate">{polity.DisplayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
