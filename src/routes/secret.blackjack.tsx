import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SecretHeader } from "@/components/SecretHeader";
import { useChips } from "@/lib/chips";
import portrait from "@/assets/tomato-target.png.asset.json";

export const Route = createFileRoute("/secret/blackjack")({
  head: () => ({ meta: [
    { title: "McJack — McCasino" },
    { name: "description", content: "Play-money blackjack against McCann the dealer." },
    { property: "og:title", content: "McJack — McCasino" },
    { property: "og:description", content: "Play-money blackjack against McCann the dealer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Blackjack,
});

type C = { r: string; s: string };
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["♠", "♥", "♦", "♣"];
const draw = (): C => ({ r: ranks[Math.floor(Math.random() * 13)]!, s: suits[Math.floor(Math.random() * 4)]! });
const score = (h: C[]) => {
  let t = 0, a = 0;
  for (const c of h) { if (c.r === "A") { a++; t += 11; } else t += ["J", "Q", "K"].includes(c.r) ? 10 : Number(c.r); }
  while (t > 21 && a--) t -= 10;
  return t;
};

function Hand({ cards, hide }: { cards: C[]; hide?: boolean }) {
  return <div className="flex flex-wrap gap-2">{cards.map((c, i) => <div key={i} className={`flex h-20 w-14 items-center justify-center rounded-sm border border-stage-border text-lg font-bold ${hide && i === 1 ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>{hide && i === 1 ? "?" : <span className={c.s === "♥" || c.s === "♦" ? "text-primary" : ""}>{c.r}{c.s}</span>}</div>)}</div>;
}

function Blackjack() {
  const { chips, setChips, refill } = useChips();
  const [bet, setBet] = useState(25);
  const [player, setPlayer] = useState<C[]>([]);
  const [dealer, setDealer] = useState<C[]>([]);
  const [phase, setPhase] = useState<"bet" | "play" | "done">("bet");
  const [msg, setMsg] = useState("");

  const finish = (p: C[], d: C[], staked: number) => {
    const ps = score(p); let dd = d;
    if (ps <= 21) while (score(dd) < 17) dd = [...dd, draw()];
    const ds = score(dd); setDealer(dd); setPhase("done");
    if (ps > 21) setMsg("Bust! McCann takes it.");
    else if (ds > 21 || ps > ds) { setChips(c => c + staked * 2); setMsg(`You win ${staked * 2} McChips!`); }
    else if (ps === ds) { setChips(c => c + staked); setMsg("Push — bet returned."); }
    else setMsg("McCann wins this one.");
  };
  const deal = () => {
    if (bet > chips || bet <= 0) return;
    setChips(c => c - bet);
    const p = [draw(), draw()], d = [draw(), draw()];
    setPlayer(p); setDealer(d); setMsg(""); setPhase("play");
    if (score(p) === 21) { setDealer(d); setPhase("done"); setChips(c => c + Math.floor(bet * 2.5)); setMsg("Blackjack! 3:2 payout."); }
  };
  const hit = () => { const p = [...player, draw()]; setPlayer(p); if (score(p) > 21) finish(p, dealer, bet); };

  return <main className="min-h-screen bg-background text-foreground"><SecretHeader chips={chips} refill={refill} />
    <div className="mx-auto max-w-xl px-5 py-8">
      <h1 className="font-display text-4xl uppercase">Mc<span className="text-primary">Jack.</span></h1>
      <div className="mt-6 space-y-6 border border-stage-border bg-stage p-5">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-highlight"><img src={portrait.url} alt="" className="h-8 w-8 rounded-full object-cover object-top" /> Dealer McCann {phase === "done" && `· ${score(dealer)}`}</div>
          {dealer.length ? <Hand cards={dealer} hide={phase === "play"} /> : <p className="text-sm text-muted-foreground">Place a bet to deal.</p>}</div>
        <div><p className="mb-2 text-xs font-bold uppercase text-highlight">You {player.length > 0 && `· ${score(player)}`}</p>{player.length > 0 && <Hand cards={player} />}</div>
      </div>
      {msg && <p role="status" className="mt-4 text-center font-display text-lg uppercase text-highlight">{msg}</p>}
      <div className="mt-5 flex items-center gap-3">
        {phase === "play" ? <>
          <Button variant="tomato" className="flex-1 rounded-sm" onClick={hit}>Hit</Button>
          <Button variant="utility" className="flex-1 rounded-sm" onClick={() => finish(player, dealer, bet)}>Stand</Button>
        </> : <>
          <input type="number" min={1} value={bet} onChange={e => setBet(Number(e.target.value))} aria-label="Bet" className="w-24 rounded-sm border border-input bg-muted px-3 py-2 text-sm" />
          <Button variant="tomato" className="flex-1 rounded-sm" onClick={deal} disabled={bet > chips || bet <= 0}>Deal</Button>
        </>}
      </div>
    </div>
  </main>;
}
