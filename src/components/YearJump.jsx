import { useState, useEffect } from 'react';

const YearJump = ({ year, setYear, isPlaying }) => {
  const [inputVal, setInputVal] = useState(Math.abs(year).toString());
  const [era, setEra] = useState(year < 0 ? 'BCE' : 'CE');

  // Sync with external year changes
  useEffect(() => {
    setInputVal(Math.abs(year).toString());
    setEra(year < 0 ? 'BCE' : 'CE');
  }, [year]);

  const handleInputChange = (val) => {
    setInputVal(val);
    const numericYear = parseInt(val);
    if (!isNaN(numericYear)) {
      const limitedYear = Math.min(Math.abs(numericYear), era === 'BCE' ? 3400 : 2024);
      setYear(era === 'BCE' ? -limitedYear : limitedYear);
    }
  };

  const handleEraChange = (newEra) => {
    setEra(newEra);
    const numericYear = parseInt(inputVal);
    if (!isNaN(numericYear)) {
      const limitedYear = Math.min(Math.abs(numericYear), newEra === 'BCE' ? 3400 : 2024);
      setYear(newEra === 'BCE' ? -limitedYear : limitedYear);
    }
  };

  return (
    <div className="year-jump-box">
      <span className="year-jump-label">GO TO YEAR</span>
      <div className="year-jump-input-group">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => handleInputChange(e.target.value)}
          className="year-jump-input"
          placeholder="Year"
        />
        <div className="era-toggle">
          <button 
            className={`era-btn ${era === 'BCE' ? 'active' : ''}`}
            onClick={() => handleEraChange('BCE')}
          >
            BCE
          </button>
          <button 
            className={`era-btn ${era === 'CE' ? 'active' : ''}`}
            onClick={() => handleEraChange('CE')}
          >
            CE
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearJump;
