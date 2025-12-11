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
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans'>
      <h1 className="text-4xl md:text-5xl font-extrabold text-fuchsia-400 text-center tracking-[0.2em]">Y2K GAMES</h1>
      <p className="text-center text-sm text-slate-400 mt-2">
        Retro vibes · PS2 · PSP · Survival Horror
      </p>

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