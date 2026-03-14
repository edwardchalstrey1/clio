import { useState, useEffect } from 'react';
import MapViewer from './MapViewer';
import GameHUD from './GameHUD';
import './GameHUD.css';

function getRandomYear(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PENALTY_PER_HINT = 50;

export default function ClioguesserLogic({ geoData, onBack }) {
  const [rounds, setRounds] = useState([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [revealedPolities, setRevealedPolities] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'round_end' | 'game_over'
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const generated = [
      ...Array.from({ length: 4 }, () => getRandomYear(1850, 2024)),
      ...Array.from({ length: 3 }, () => getRandomYear(1500, 1849)),
      ...Array.from({ length: 3 }, () => getRandomYear(-1000, 1499)),
    ];
    // Shuffle rounds array securely
    const shuffled = generated.sort(() => Math.random() - 0.5);
    setRounds(shuffled);
    setCurrentRoundIdx(0);
    setScore(0);
    setRevealedPolities([]);
    setGameState('playing');
    setLastResult(null);
  };

  const currentYear = rounds[currentRoundIdx] || 0;

  const handleReveal = (polityProps) => {
    if (gameState !== 'playing') return;
    const name = polityProps.DisplayName;
    if (name && !revealedPolities.includes(name)) {
      setRevealedPolities(prev => [...prev, name]);
    }
  };

  const handleGuessSubmit = (guessYear) => {
    const error = Math.abs(currentYear - guessYear);
    const penalties = revealedPolities.length * PENALTY_PER_HINT;
    const roundScore = error + penalties;
    
    setScore(prev => prev + roundScore);
    setLastResult({ 
      trueYear: currentYear, 
      guess: guessYear, 
      error, 
      penalties, 
      total: roundScore 
    });
    setGameState('round_end');
  };

  const nextRound = () => {
    if (currentRoundIdx >= 9) {
      setGameState('game_over');
    } else {
      setCurrentRoundIdx(prev => prev + 1);
      setRevealedPolities([]);
      setGameState('playing');
    }
  };

  if (rounds.length === 0) return null;

  return (
    <div className="app-container">
      
      <button className="exit-btn" onClick={onBack}>
        &#8592; Exit Game
      </button>

      <MapViewer 
        year={currentYear} 
        data={geoData} 
        interactiveMode="game"
        onPolitySelect={handleReveal}
        // During round_end, we might want to let them see everything? No, keep it simple.
      />

      {/* Floating Hints Panel */}
      {revealedPolities.length > 0 && (
        <div className="hints-panel">
          <div className="hints-title">Revealed Polities (-{PENALTY_PER_HINT} pts each)</div>
          <ul className="hints-list">
            {revealedPolities.map((name, i) => <li key={i}>{name}</li>)}
          </ul>
        </div>
      )}

      {/* When round ends, show the result in the HUD */}
      <GameHUD 
        round={currentRoundIdx + 1}
        totalRounds={10}
        score={score}
        gameState={gameState}
        onGuess={handleGuessSubmit}
        onNext={nextRound}
        onRestart={initGame}
        lastResult={lastResult}
      />
    </div>
  );
}
