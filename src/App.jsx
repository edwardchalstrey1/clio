import { useState } from 'react';
import MapViewer from './components/MapViewer';
import Controls from './components/Controls';
import './App.css';

function App() {
  const [year, setYear] = useState(1700);
  const [mode, setMode] = useState('Polities');
  const [loading, setLoading] = useState(true);

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div style={{ fontWeight: 600, color: '#94a3b8' }}>Loading Historical Data...</div>
          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '8px' }}>
            Downloading and processing vector polygons (200MB)
          </div>
        </div>
      )}
      
      <MapViewer 
        year={year} 
        mode={mode} 
        onLoaded={() => setLoading(false)} 
      />
      
      {!loading && (
        <Controls 
          year={year} 
          setYear={setYear} 
          mode={mode} 
          setMode={setMode} 
        />
      )}
    </div>
  );
}

export default App;
