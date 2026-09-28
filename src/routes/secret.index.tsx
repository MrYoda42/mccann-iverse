import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SecretHeader } from "@/components/SecretHeader";
import { useChips } from "@/lib/chips";
import gold from "@/assets/mccann-gold.jpg";
import arcade from "@/assets/mccann-arcade.jpg";

export const Route = createFileRoute("/secret/")({
  head: () => ({ meta: [
    { title: "McCasino — Secret Room" },
    { name: "description", content: "You found the secret McCann room. Play-money Plinko and Blackjack." },
    { property: "og:title", content: "McCasino — Secret Room" },
    { property: "og:description", content: "Play-money Plinko and Blackjack, McCann style." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Secret,
});

const games = [
  { title: "McPlinko", text: "Drop a McCann and watch him bounce.", to: "/secret/plinko" as const, image: gold },
  { title: "McJack", text: "Beat McCann the dealer to 21.", to: "/secret/blackjack" as const, image: arcade },
];

function Secret() {
  const { chips, refill } = useChips();
  return <main className="min-h-screen bg-background text-foreground"><SecretHeader chips={chips} refill={refill} />
    <div className="mx-auto max-w-[1000px] px-5 py-10 sm:px-9">
      <p className="text-xs font-extrabold uppercase tracking-[.2em] text-highlight">Code 6767 accepted</p>
      <h1 className="mt-2 font-display text-4xl uppercase sm:text-6xl">The secret <span className="text-primary">McCasino.</span></h1>
      <p className="mt-3 text-sm text-muted-foreground">Play money only — McChips have no real value.</p>
      <div className="mt-9 grid gap-5 sm:grid-cols-2">
        {games.map(g => <article key={g.title} className="flex flex-col border border-stage-border bg-stage">
          <img src={g.image} alt="" className="aspect-[4/3] w-full object-cover" />
          <div className="p-5"><h2 className="font-display text-xl uppercase">{g.title}</h2><p className="mt-2 text-sm text-muted-foreground">{g.text}</p>
            <Button asChild variant="tomato" className="mt-5 w-full rounded-sm"><Link to={g.to}>Play</Link></Button></div>
        </article>)}
      </div>
    </div>
  </main>;
}
