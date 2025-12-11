import { useEffect, useState } from 'react'

export default function App() {

  const API_KEY = "3192385a-b25d-4fba-befc-876b198b7d63";
  const BASE_URL = "https://retro.gg/api"

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getGames = async () => {
    try {
      const res  = await fetch(`${BASE_URL}/search/year/1993?key=${API_KEY}`);
      if (!res.ok) {
        throw new Error('Getting games failed');
      }
      const data = await res.json();
      setGames(data.results || []);

    } catch (error) {
      console.error("Getting games failed");
      setError(error.message);

    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getGames();

  }, [])
  
  return (
    // <div>
    //   <h1>Y2K GAMES</h1>
    //   {loading  && <div>Loading games...</div>}
    //   {error && <div>Error: {error}</div>}
    //   {!games.length && !loading && !error && (
    //     <div>No games were found</div>
    //   )}
    // </div>
    <div>
      <h1>Y2K GAMES</h1>
    </div>
  )
}
