import { useEffect, useState } from 'react'
import React from 'react'

export default function App() {

  const API_KEY = "3192385a-b25d-4fba-befc-876b198b7d63";
  const BASE_URL = "https://retro.gg/api/"

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(Boolean);
  const [error, setError] = useState();

  const getGames = async () => {
    try {
      const  data  = await axios.get(`${BASE_URL}search/year/1993?key${API_KEY}`);
      setGames(data.results);
    } catch (error) {
      console.error("Getting games failed");
      setError(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log("Loading:", loading)
    getGames();

  }, [])
  
  return (
    <div>
      <h1>Y2K GAMES</h1>
      {loading  && <div>Loading games...</div>}
      {error ?? <div>Error: ${error}</div>}
      {if (!games.length) {
        games.map((game, index) =>(
          <div>
            <p>game.name</p>
        ))
        
      }}

    </div>
  )
}

