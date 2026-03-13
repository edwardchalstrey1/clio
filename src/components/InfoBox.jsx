const InfoBox = ({ selectedPolity, onClose }) => {
  if (!selectedPolity) return null;

  const { DisplayName, FromYear, ToYear, Wikipedia, Area, Type } = selectedPolity;

  return (
    <div className="info-box">
      <div className="flex justify-between items-start mb-4">
        <div className="info-title">{DisplayName}</div>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors"
          title="Close"
        >
          ✕
        </button>
      </div>
      
      <div className="info-content">
        <div className="flex flex-col mb-2">
          <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold mb-1">Duration</span>
          <span className="text-sm font-medium">{FromYear} <span className="text-xs text-slate-500">to</span> {ToYear}</span>
        </div>
        
        {Area && (
          <div className="flex flex-col mb-2">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold mb-1">Territorial Area</span>
            <span className="text-sm font-medium">{Math.round(Area).toLocaleString()} <span className="text-xs text-slate-500">Km²</span></span>
          </div>
        )}
        
        <div className="flex flex-col mb-4">
          <span className="text-[10px] text-[#64748b] uppercase tracking-wider font-bold mb-1">Administrative Type</span>
          <span className="text-sm font-medium">{Type}</span>
        </div>

        {Wikipedia && (
          <div className="pt-4 border-t border-white/5">
            <a
              href={`https://en.wikipedia.org/wiki/${Wikipedia}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e2b860] hover:text-white hover:underline text-xs font-bold tracking-tight inline-flex items-center gap-2 transition-all"
            >
              Consult Archive on Wikipedia ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoBox;
