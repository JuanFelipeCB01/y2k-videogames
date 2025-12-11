import { useEffect, useState } from 'react'

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getGames = async () => {
    try {
      const res  = await fetch(`http://localhost:5174/api/games`);
      if (!res.ok) {
        throw new Error('Getting games failed');
      }
      const data = await res.json();
      setGames(data || []);

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

    console.log("games: ", games)
  }, [])
  
  return (
    <div>
      <h1 className="text-4xl font-bold text-pink-500 bg-black">Y2K GAMES</h1>

      {/* Loading */}
      { loading && <div>Loading games...</div> }

      {/* Error */}
      { error && <div>Error: {error}</div>}

      {/* No hay juegos */}
      {!loading && !error && !games.length && (
        <div>No hay juegos disponibles</div>
      )}

      {!loading && !error && games.length > 0 && (
        <div>
          {games.map((game) => (
            <div key={game.id}>{game.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}
