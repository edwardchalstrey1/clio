const InfoBox = ({ selectedPolity, onClose }) => {
  if (!selectedPolity) return null;

  const { DisplayName, FromYear, ToYear, Wikipedia, Area, Type } = selectedPolity;

  return (
    <div className="info-box">
      <div className="flex justify-between items-start mb-2">
        <div className="info-title">{DisplayName}</div>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="info-row">
        <span className="info-label">Duration</span>
        <span>{FromYear} to {ToYear}</span>
      </div>
      
      {Area && (
        <div className="info-row">
          <span className="info-label">Area (est.)</span>
          <span>{Math.round(Area).toLocaleString()} Km²</span>
        </div>
      )}
      
      <div className="info-row">
        <span className="info-label">Type</span>
        <span>{Type}</span>
      </div>

      {Wikipedia && (
        <div className="mt-4">
          <a
            href={`https://en.wikipedia.org/wiki/${Wikipedia}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-xs font-semibold flex items-center gap-1"
          >
            Wikipedia Page ↗
          </a>
        </div>
      )}
    </div>
  );
};

export default InfoBox;
