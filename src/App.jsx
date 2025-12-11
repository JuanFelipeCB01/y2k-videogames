import { useEffect, useState } from 'react'
import NavBar from './components/NavBar';

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getGames = async () => {
    try {
      const res = await fetch(`http://localhost:5174/api/games`);
      if (!res.ok) {
        throw new Error('Getting games failed');
      }
      const data = await res.json();
      setGames(data || []);

    } catch (error) {
      console.error("Getting games failed");
      setError(error.message);

    } finally {
      setLoading(false);
      console.log("games: ", games)
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    getGames();
  }, [])

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-'>
      <h1 className="text-4xl bg-slate-100 md:text-5xl font-[Plank] text-black text-center tracking-[0.2em] pt-8 pb-8">Y2K GAMES</h1>
      {/* <p className="text-center text-sm text-slate-100 py-2 font-[Nuls]">
        Retro · PS2 · PSP · Survival Horror
      </p> */}

      <NavBar></NavBar>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading &&
          <div className="flex justify-center">
            <div className="mt-8 px-4 py-2 rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-sm border border-fuchsia-500/40">
              Cargando juegos...
            </div>
          </div>
        }
        {/* Error */}
        {error && <div>Error: {error}</div>}
        {/* No hay juegos */}
        {!loading && !error && !games.length && (
          <div>No hay juegos disponibles</div>
        )}
        {!loading && !error && games.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <div
                key={game.id}
                className="rounded-1xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/20 transition"
              >
                <h2 className="text-sm font-semibold text-fuchsia-300 uppercase">
                  {game.name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Era: <span className="text-slate-200">{game.era}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Plataforma: <span className="text-slate-200">{game.originalPlatform}</span>
                </p>
                {game.year && (
                  <p className="text-xs text-slate-400">
                    Año: <span className="text-slate-200">{game.year}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}