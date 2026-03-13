# Cliopatria GeoJSON Viewer

A high-performance, GPU-accelerated web application for exploring the Cliopatria Global History Databank. Built with Vite, React, and MapLibre GL JS.

## Features
- **Super Fast Filtering**: Instantaneous year sweeping and mode switching using GPU-accelerated expressions.
- **Large Dataset Handling**: Optimized for the 200MB+ `cliopatria_polities_only_seshat_processed.geojson` dataset.
- **Premium UI**: Modern dark-themed design with glassmorphism and smooth transitions.
- **Vercel Ready**: Confirmed build process for seamless deployment.

## Getting Started

### Local Development
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown in the terminal.

### Deployment to Vercel
This project is optimized for Vercel. You can deploy it by:
1. Pushing the codebase to GitHub.
2. Connecting your GitHub repository to Vercel.
3. Vercel will automatically detect the Vite project and deploy it.

**Build Command**: `npm run build`
**Output Directory**: `dist`

## Data Source
The application uses the `public/data.geojson` file, which is a copy of the processed Cliopatria data.
