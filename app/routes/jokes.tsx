import { LinksFunction, LoaderFunction, useLoaderData } from "remix";
import { Outlet, Link } from "remix";
import stylesUrl from "../styles/jokes.css";
import type { Joke } from "@prisma/client";
import { db } from "~/utils/db.server"

type PartialJoke = { id: string; name: string }
type LoaderData = { jokes: Array<PartialJoke> };
export let loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokes: await db.joke.findMany({
      take: 5,
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    })
  };
  return data 
}
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl
    }
  ];
};

export default function JokesRoute() {
  const { jokes } = useLoaderData<LoaderData>();
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
                {jokes.map((joke: Joke) => <li><Link to={joke.id}>{joke.name}</Link></li> )}
             
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}