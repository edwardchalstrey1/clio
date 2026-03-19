# Cliopatria GeoJSON Viewer

View the site at [https://clio-seven.vercel.app/](https://clio-seven.vercel.app/).

A high-performance, GPU-accelerated web application for exploring the [Cliopatria](https://github.com/Seshat-Global-History-Databank/cliopatria).
Built with Vite, React, and MapLibre GL JS.

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser to the URL shown in the terminal.

## Cliopatria

The main page displays a map of the world with historical polities highlighted in different colors. The polities are displayed as polygons and each has a unique colour. The polities are also animated to show their historical development over time.

## Clioguesser game

Clioguesser challenges the player to guess the year based on the map, with all the polities displayed for that year. It works as follows:

1. The player plays 10 rounds of Clioguesser. In each round they are presented with a particular map and have to guess which year is shown. The ten rounds draw years from the following ranges:
    - 4 from 1850CE to 2024CE
    - 3 from 1500CE to 1849CE
    - 3 from 1000BCE to 1499CE
2. The player gets a score based on the distance from the true year for a given round. In each round, they want to get as close to 0 as possible.
3. At the end of the 10 rounds, the combined score, the combined number of years out, is returned to the player.
4. In each round, the names of polities are not shown. However, clicking on a polity will reveal its name, incurring a penalty to the score for that round.

### Implmentation

- The scoring system should be in an easy to update function.
- When opening the app, there should be a choice between CLIOPATRIA or CLIOGUESSER, and to save time, the data should begin loading before the user chooses either (though this should be obscured until such as time as the user chooses one - if the loading hasn't finished then show the loading page with the correct title)
