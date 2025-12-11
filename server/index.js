const express = require('express');
const cors = require('cors');
require('dotenv').config();

const STEAM_API_KEY = process.env.STEAM_API_KEY; // de momento no usada, pero la tendremos lista
const PORT = 5174;
const app = express();

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

const GAMES_CONFIG = [
  // JUEGOS JAPONESES CON APPID (Steam)
  { appId: 631510, era: '2000s', platform: 'PC', nameOverride: 'Devil May Cry HD Collection' }, // incluye DMC1,2,3
  { appId: 254700, era: '2000s', platform: 'PC', nameOverride: 'Resident Evil 4' },             // RE4
  { appId: 339340, era: '2000s', platform: 'PC', nameOverride: 'Resident Evil 0 HD' },          // RE0
  { appId: 304240, era: '2000s', platform: 'PC', nameOverride: 'Resident Evil Remake HD' },     // RE1 Remake
  { appId: 460790, era: '2000s', platform: 'PC', nameOverride: 'Bayonetta' },
  { appId: 235460, era: '2010s', platform: 'PC', nameOverride: 'Metal Gear Rising' },

  // JUEGOS JAPONESES SIN APPID (Simulados, vibe Y2K japonesa pura)
  // Devil May Cry individuales como PS2 (manuales)
  { appId: null, era: '2000s', platform: 'PS2', name: 'Devil May Cry',                 year: 2001, genres: ['Action', 'Hack & Slash'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Devil May Cry 2',              year: 2003, genres: ['Action', 'Hack & Slash'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Devil May Cry 3: Special Edition', year: 2005, genres: ['Action', 'Hack & Slash'] },

  { appId: null, era: '2000s', platform: 'PSP', name: 'Monster Hunter Freedom',        year: 2005, genres: ['Action', 'RPG'] },
  { appId: null, era: '2000s', platform: 'PSP', name: 'Monster Hunter Freedom 2',      year: 2007, genres: ['Action', 'RPG'] },
  { appId: null, era: '2010s', platform: 'PSP', name: 'Monster Hunter Portable 3rd',   year: 2010, genres: ['Action', 'RPG'] },
  { appId: null, era: '2010s', platform: 'PSP', name: 'The 3rd Birthday',              year: 2011, genres: ['Action', 'Shooter'] },
  { appId: null, era: '2000s', platform: 'PSP', name: 'Valkyrie Profile: Lenneth',     year: 2006, genres: ['JRPG'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Final Fantasy X',               year: 2001, genres: ['JRPG'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Final Fantasy X-2',             year: 2003, genres: ['JRPG'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Kingdom Hearts',                year: 2002, genres: ['Action RPG'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Kingdom Hearts 2',              year: 2005, genres: ['Action RPG'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Dirge of Cerberus: FFVII',      year: 2006, genres: ['Action', 'Shooter'] },
  { appId: null, era: '90s',   platform: 'PSX', name: 'Silent Hill',                   year: 1999, genres: ['Survival Horror'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Silent Hill 2',                 year: 2001, genres: ['Survival Horror'] },
  { appId: null, era: '2000s', platform: 'PS2', name: 'Silent Hill 3',                 year: 2003, genres: ['Survival Horror'] },
];


app.get('/api/games', async (req, res) => {
  try {
    // 1. Obtenemos datos base: algunos desde Steam, otros manuales
    const baseResults = await Promise.all(
      GAMES_CONFIG.map(async (gameCfg) => {
        // Caso A: juego con appId -> tiramos de Steam Store API
        if (gameCfg.appId) {
          const url = `https://store.steampowered.com/api/appdetails?appids=${gameCfg.appId}&l=en&cc=us`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Steam Store API returned ${response.status} for appId ${gameCfg.appId}`);
          }

          const data = await response.json();
          const appInfo = data[gameCfg.appId];

          if (!appInfo || !appInfo.success) {
            throw new Error(`No valid data for appId ${gameCfg.appId}`);
          }

          const appData = appInfo.data;

          // Sacamos lo que nos interesa del juego real de Steam
          return {
            appId: gameCfg.appId,
            name: gameCfg.nameOverride || appData.name,
            year:
              appData.release_date?.date
                ?.split(',')
                .pop()
                ?.trim() || null,
            headerImage: appData.header_image,
            genres: appData.genres?.map((g) => g.description) || [],
            platforms: Object.entries(appData.platforms || {})
              .filter(([, v]) => v)
              .map(([k]) => k), // ['windows', 'linux', ...]
            era: gameCfg.era,
            originalPlatform: gameCfg.platform,
          };
        }

        // Caso B: juego sin appId -> usamos datos manuales
        return {
          appId: null,
          name: gameCfg.name,
          year: gameCfg.year,
          headerImage: null, // luego en el front podremos poner una imagen por defecto
          genres: gameCfg.genres || [],
          platforms: [gameCfg.platform],
          era: gameCfg.era,
          originalPlatform: gameCfg.platform,
        };
      })
    );

    // 2. Expandimos a ~200 juegos duplicando la lista base
    const TOTAL = 200;

    const expandedResults = Array.from({ length: TOTAL }, (_, index) => {
      const baseGame = baseResults[index % baseResults.length];

      return {
        ...baseGame,
        id: index + 1, // id único para el front
      };
    });

    // 3. Devolvemos el array final
    res.json(expandedResults);
  } catch (error) {
    console.error('Error fetching games from Steam / building list:', error.message);
    res.status(500).json({
      message: 'Error fetching games from backend',
      error: error.message,
    });
  }
});
