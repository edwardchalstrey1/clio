import React, { useState } from 'react';
import './GameHUD.css';

const GameHUD = ({ 
  round, 
  totalRounds, 
  score, 
  gameState, // 'playing', 'round_end', 'game_over'
  onGuess, 
  onNext, 
  onRestart,
  lastResult
}) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess === '') return;
    onGuess(parseInt(guess));
    setGuess('');
  };

  if (gameState === 'game_over') {
    return (
      <div className="game-hud-overlay center-screen">
        <div className="game-over-box">
          <h2 className="title">Game Over</h2>
          <div className="final-score">Final Score: {score}</div>
          <p className="subtitle">Remember, closer to 0 is better.</p>
          <button className="gold-btn wide" onClick={onRestart}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-hud-container controls-panel">
      <div className="bottom-bar-layout game-layout">
        
        <div className="brand-section">
          <div className="round-indicator title">Round {round} / {totalRounds}</div>
          <div className="score-indicator subtitle">Total Score: {score}</div>
        </div>

        {gameState === 'playing' ? (
          <form className="guess-section" onSubmit={handleSubmit}>
            <label className="year-jump-label">GUESS THE YEAR:</label>
            <div className="guess-input-group">
              <input 
                type="number" 
                className="year-jump-input guess-input" 
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Year (e.g. 1500 or -300)"
                required
              />
              <button type="submit" className="gold-btn guess-btn">SUBMIT</button>
            </div>
            <div className="hint-info subtitle">Click a polity for a hint (+50 penalty)</div>
          </form>
        ) : (
          <div className="result-section">
            <div className="result-stats">
              <span className="result-item">True Year: <strong className="gold-text">{lastResult.trueYear}</strong></span>
              <span className="result-item">Your Guess: <strong>{lastResult.guess}</strong></span>
              <span className="result-item">Off by: <strong>{lastResult.error}</strong> yrs</span>
              {lastResult.penalties > 0 && <span className="result-item penalty">Penalties: +{lastResult.penalties}</span>}
            </div>
            <button className="gold-btn guess-btn pulse" autoFocus onClick={onNext}>NEXT ROUND</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHUD;
