import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Grid2X2, Timer, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";
import portrait from "@/assets/tomato-target.png.asset.json";
import rainy from "@/assets/mccann-rainy.jpg";
import arcade from "@/assets/mccann-arcade.jpg";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [
    { title: "Games — Mini McCann" },
    { name: "description", content: "Play Fruit Toss, Mini McCann Match, and McCann Pop." },
    { property: "og:title", content: "Games — Mini McCann" },
    { property: "og:description", content: "Play Fruit Toss, Mini McCann Match, and McCann Pop." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Games,
});

const games = [
  { title: "Fruit Toss", text: "Take aim with four fruits.", to: "/" as const, image: portrait.url, icon: Target },
  { title: "McCann Match", text: "Find all eight matching pairs.", to: "/games/match" as const, image: rainy, icon: Grid2X2 },
  { title: "McCann Pop", text: "Catch as many as you can in 30 seconds.", to: "/games/pop" as const, image: arcade, icon: Timer },
];

function Games() {
  return <main className="min-h-screen bg-background text-foreground">
    <ShopHeader />
    <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-9">
      <p className="text-xs font-extrabold uppercase tracking-[.18em] text-highlight">The game room</p>
      <h1 className="mt-2 font-display text-4xl uppercase sm:text-6xl">Pick a <span className="text-primary">game.</span></h1>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {games.map(game => <article key={game.title} className="flex flex-col border border-stage-border bg-stage">
          <div className="aspect-[4/3] overflow-hidden bg-muted"><img src={game.image} alt="" className="h-full w-full object-cover object-center" /></div>
          <div className="flex flex-1 flex-col p-5">
            <game.icon className="mb-4 text-highlight" size={24} />
            <h2 className="font-display text-xl uppercase">{game.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{game.text}</p>
            <Button asChild variant="tomato" className="mt-6 w-full rounded-sm"><Link to={game.to}>Play <ArrowRight /></Link></Button>
          </div>
        </article>)}
      </div>
    </div>
  </main>;
}