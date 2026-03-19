const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

console.log('Reading GeoJSON parts...');
const data1 = JSON.parse(fs.readFileSync(path.join(publicDir, 'data_part1.json')));
const data2 = JSON.parse(fs.readFileSync(path.join(publicDir, 'data_part2.json')));
const data3 = JSON.parse(fs.readFileSync(path.join(publicDir, 'data_part3.json')));

const allFeatures = [...data1.features, ...data2.features, ...data3.features];
const combined = { type: 'FeatureCollection', features: allFeatures };

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

fs.writeFileSync(path.join(publicDir, 'combined.geojson'), JSON.stringify(combined));
console.log('Saved combined.geojson');
