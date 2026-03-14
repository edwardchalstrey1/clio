const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/data.geojson');
const outputDir = path.join(__dirname, '../public');

console.log('Reading data.geojson...');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const totalFeatures = data.features.length;
const partSize = Math.ceil(totalFeatures / 3);

for (let i = 0; i < 3; i++) {
  const start = i * partSize;
  const end = Math.min((i + 1) * partSize, totalFeatures);
  const chunk = {
    ...data,
    features: data.features.slice(start, end)
  };
  
  const outputPath = path.join(outputDir, `data_part${i + 1}.json`);
  console.log(`Writing ${outputPath} (${chunk.features.length} features)...`);
  fs.writeFileSync(outputPath, JSON.stringify(chunk));
}

console.log('Split complete!');
