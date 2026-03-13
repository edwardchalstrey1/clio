const InfoBox = ({ selectedPolity, onClose }) => {
  if (!selectedPolity) return null;

  const { DisplayName, FromYear, ToYear, Wikipedia, Area } = selectedPolity;

  return (
    <div className="info-box" style={{ borderTopColor: selectedPolity.Color }}>
      <div className="info-header">
        <h2 className="info-title">{DisplayName}</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <table className="info-table">
        <tbody>
          <tr>
            <td>Historical Duration</td>
            <td>{FromYear} <span className="opacity-30 mx-1">/</span> {ToYear}</td>
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
