import { useEffect, useState } from 'react'
import NavBar from './components/NavBar';
import Header from './components/Header';

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
      console.log("games1: ", games)
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    getGames();
  }, [])

  return (
    <div className='min-h-screen bg-slate-100 text-black font-'>
      <Header></Header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading &&
          <div className="flex justify-center">
            <div className="mt-8 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/40">
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
                className="rounded-1xl border border-slate-800 bg-black p-4 shadow-sm hover:border-cyan-500/60 hover:shadow-cyan-500/20 transition"
              >
                <img className='border border-slate-100 ' src={game.headerImage}></img>
                <h2 className="text-sm font-semibold text-cyan-300 uppercase">
                  {game.name}
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Era: <span className="text-slate-200">{game.era}</span>
                </p>
                <p className="text-xs text-neutral-400">
                  Plataforma: <span className="text-slate-200">{game.originalPlatform}</span>
                </p>
                {game.year && (
                  <p className="text-xs text-neutral-400">
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