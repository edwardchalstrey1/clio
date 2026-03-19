const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

console.log('Reading GeoJSON data...');
const data = JSON.parse(fs.readFileSync(path.join(publicDir, 'data.geojson')));
const allFeatures = data.features;

console.log('Calculating polityStats...');
const stats = {};
allFeatures.forEach(f => {
  const p = f.properties;
  const name = p.DisplayName;
  if (!name) return;
  
  if (!stats[name]) {
    stats[name] = {
      minYear: p.FromYear,
      maxYear: p.ToYear,
      yearlyData: {}
    };
  }
  stats[name].minYear = Math.min(stats[name].minYear, p.FromYear);
  stats[name].maxYear = Math.max(stats[name].maxYear, p.ToYear);

  if (!stats[name].yearlyData[p.FromYear]) {
    stats[name].yearlyData[p.FromYear] = {
      area: 0,
      color: p.Color
    };
  }
  stats[name].yearlyData[p.FromYear].area += (p.Area || 0);
});

fs.writeFileSync(path.join(publicDir, 'polityStats.json'), JSON.stringify(stats));
console.log('Saved polityStats.json');
