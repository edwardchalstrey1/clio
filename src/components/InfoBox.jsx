const InfoBox = ({ selectedPolity, onClose, polityStats }) => {
  if (!selectedPolity) return null;

  const { DisplayName, Wikipedia, Area } = selectedPolity;
  const stats = polityStats[DisplayName] || { 
    minYear: selectedPolity.FromYear, 
    maxYear: selectedPolity.ToYear 
  };

  const formatYear = (y) => {
    const absYear = Math.abs(y);
    return y < 0 ? `${absYear}BCE` : `${absYear}CE`;
  };

  return (
    <div className="info-box" style={{ borderTopColor: selectedPolity.Color }}>
      <div className="info-header">
        <h2 className="info-title">{DisplayName}</h2>
        <button className="close-btn" onClick={onClose} title="Close">✕</button>
      </div>
      
      <table className="info-table">
        <tbody>
          <tr>
            <td>Historical Duration</td>
            <td className="font-medium">
              {formatYear(stats.minYear)} <span className="text-[10px] text-slate-500 mx-1">to</span> {formatYear(stats.maxYear)}
            </td>
          </tr>
          {Area && (
            <tr>
              <td>Territorial Area</td>
              <td>{Math.round(Area).toLocaleString()} <span className="text-[10px] text-slate-500 ml-1">Km²</span></td>
            </tr>
          )}
        </tbody>
      </table>

      {Wikipedia && (
        <div className="wiki-link-container">
          <a
            href={`https://en.wikipedia.org/wiki/${Wikipedia}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e2b860] hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            CONSULT THE ARCHIVES ON WIKIPEDIA ↗
          </a>
        </div>
      )}
    </div>
  );
};

export default InfoBox;
