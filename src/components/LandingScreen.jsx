import React from 'react';
import './LandingScreen.css';

const LandingScreen = ({ onSelectMode, loadProgress }) => {
  return (
    <div className="landing-container loading-overlay">
      <div className="brand-section" style={{ marginBottom: '60px', textAlign: 'center', alignItems: 'center' }}>
        <h1 className="title" style={{ fontSize: '4rem', margin: 0 }}>CLIO</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', opacity: 0.8 }}>Choose your experience</p>
      </div>

      <div className="mode-selection">
        <button 
          className="mode-card" 
          onClick={() => onSelectMode('viewer')}
        >
          <div className="mode-card-title">CLIOPATRIA</div>
          <div className="mode-card-desc">Explore the global history databank through an interactive timeline.</div>
        </button>

        <button 
          className="mode-card game" 
          onClick={() => onSelectMode('game')}
        >
          <div className="mode-card-title">CLIOGUESSER</div>
          <div className="mode-card-desc">Test your historical knowledge in a 10-round map guessing game.</div>
        </button>
      </div>

      {loadProgress < 99 && (
        <div style={{ marginTop: '50px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="loading-bar-container">
            <div className="loading-bar-fill" style={{ width: `${loadProgress}%` }}></div>
          </div>
          <div className="loading-text" style={{ marginTop: '16px', fontSize: '0.8rem' }}>
            {`Loading Background Data: ${loadProgress}%`}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingScreen;
