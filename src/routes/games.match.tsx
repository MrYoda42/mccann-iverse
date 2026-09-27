import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";
import { products } from "@/lib/cart";
import portrait from "@/assets/tomato-target.png.asset.json";

export const Route = createFileRoute("/games/match")({
  head: () => ({ meta: [
    { title: "McCann Match — Mini McCann Games" },
    { name: "description", content: "Flip the cards and match all eight Mini McCann looks." },
    { property: "og:title", content: "McCann Match — Mini McCann Games" },
    { property: "og:description", content: "Flip the cards and match all eight Mini McCann looks." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Match,
});

const faces = [{ name: "The original", image: portrait.url }, ...products.map(p => ({ name: p.name, image: p.image }))];
type Card = { id: number; pair: number };
const initialOrder = [0, 3, 5, 1, 6, 2, 7, 4, 2, 6, 4, 0, 1, 7, 3, 5];
const makeDeck = (order: number[]): Card[] => order.map((pair, id) => ({ id, pair }));

function Match() {
  const [deck, setDeck] = useState(() => makeDeck(initialOrder));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  const flip = (card: Card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pair)) return;
    if (flipped.length === 0) { setFlipped([card.id]); return; }
    setFlipped([flipped[0], card.id]);
    setMoves(m => m + 1);
    const first = deck.find(c => c.id === flipped[0]);
    if (first?.pair === card.pair) {
      timeout.current = setTimeout(() => { setMatched(m => [...m, card.pair]); setFlipped([]); }, 450);
    } else timeout.current = setTimeout(() => setFlipped([]), 900);
  };

  const reset = () => {
    if (timeout.current) clearTimeout(timeout.current);
    const order = [...faces.keys(), ...faces.keys()];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    setDeck(makeDeck(order)); setFlipped([]); setMatched([]); setMoves(0);
  };

  return <main className="min-h-screen bg-background text-foreground"><ShopHeader />
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-9">
      <Link to="/games" className="inline-flex items-center gap-2 text-xs font-bold uppercase text-highlight hover:text-foreground"><ArrowLeft size={15} /> All games</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-display text-3xl uppercase sm:text-5xl">McCann <span className="text-primary">Match.</span></h1><p className="mt-2 text-sm text-muted-foreground">Find the pairs.</p></div>
        <Button type="button" variant="utility" onClick={reset} aria-label="New game" title="New game" className="rounded-sm"><RotateCcw /> New game</Button>
      </div>
      <div className="my-6 flex justify-between border-y border-border py-3 text-xs font-bold uppercase tracking-[.15em] text-highlight"><span>Pairs {matched.length} / 8</span><span>Moves {moves}</span></div>
      {matched.length === 8 && <div role="status" className="mb-5 border border-highlight bg-stage p-4 text-center font-display text-lg uppercase text-highlight">All matched in {moves} moves!</div>}
      <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Memory cards">
        {deck.map(card => {
          const showing = flipped.includes(card.id) || matched.includes(card.pair);
          return <Button key={card.id} type="button" variant="utility" onClick={() => flip(card)} disabled={matched.includes(card.pair)} aria-label={showing ? faces[card.pair].name : `Hidden card ${card.id + 1}`} aria-pressed={showing} className={`relative aspect-square h-auto w-full overflow-hidden rounded-sm p-0 ${showing ? "border-highlight" : "hover:border-highlight"}`}>
            {showing ? <img src={faces[card.pair].image} alt="" className="h-full w-full object-cover" /> : <span className="font-display text-3xl text-highlight sm:text-5xl">?</span>}
          </Button>;
        })}
      </div>
    </div>
  </main>;
}