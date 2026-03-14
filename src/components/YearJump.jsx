import { useState, useEffect } from 'react';

const YearJump = ({ year, setYear, isPlaying }) => {
  const [inputVal, setInputVal] = useState(Math.abs(year).toString());
  const [era, setEra] = useState(year < 0 ? 'BCE' : 'CE');

  // Sync with external year changes
  useEffect(() => {
    setInputVal(Math.abs(year).toString());
    setEra(year < 0 ? 'BCE' : 'CE');
  }, [year]);

  const submitYear = () => {
    let numericYear = parseInt(inputVal);
    if (isNaN(numericYear)) {
      setInputVal(Math.abs(year).toString());
      return;
    }
    
    // Limits
    numericYear = Math.min(Math.abs(numericYear), era === 'BCE' ? 3400 : 2024);
    const finalYear = era === 'BCE' ? -numericYear : numericYear;
    
    setYear(finalYear);
    setInputVal(numericYear.toString());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitYear();
      e.target.blur();
    }
  };

  return (
    <div className="year-jump-box">
      <span className="year-jump-label">GO TO YEAR</span>
      <div className="year-jump-input-group">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={submitYear}
          onKeyDown={handleKeyDown}
          className="year-jump-input"
          placeholder="Year"
        />
        <div className="era-toggle">
          <button 
            className={`era-btn ${era === 'BCE' ? 'active' : ''}`}
            onClick={() => { setEra('BCE'); setTimeout(submitYear, 0); }}
          >
            BCE
          </button>
          <button 
            className={`era-btn ${era === 'CE' ? 'active' : ''}`}
            onClick={() => { setEra('CE'); setTimeout(submitYear, 0); }}
          >
            CE
          </button>
        </div>
      </div>
    </div>
  );
};

export default YearJump;
