import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SecretHeader } from "@/components/SecretHeader";
import { useChips } from "@/lib/chips";
import portrait from "@/assets/tomato-target.png.asset.json";

export const Route = createFileRoute("/secret/plinko")({
  head: () => ({ meta: [
    { title: "McPlinko — McCasino" },
    { name: "description", content: "Drop McCann down the board for play-money prizes." },
    { property: "og:title", content: "McPlinko — McCasino" },
    { property: "og:description", content: "Drop McCann down the board for play-money prizes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Plinko,
});

const ROWS = 8;
const mult = [5, 2, 1.2, 0.5, 0.2, 0.5, 1.2, 2, 5];

function Plinko() {
  const { chips, setChips, refill } = useChips();
  const [bet, setBet] = useState(10);
  const [path, setPath] = useState<number[]>([]);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState("");
  const dropping = step >= 0 && step < ROWS;

  const drop = () => {
    if (dropping || bet > chips || bet <= 0) return;
    setChips(c => c - bet); setResult("");
    const p = [0]; for (let i = 0; i < ROWS; i++) p.push(p[i]! + (Math.random() < .5 ? 0 : 1));
    setPath(p); setStep(0);
    let s = 0;
    const t = setInterval(() => {
      s++; setStep(s);
      if (s >= ROWS) {
        clearInterval(t);
        const win = Math.round(bet * mult[p[ROWS]!]!);
        setChips(c => c + win); setResult(`${mult[p[ROWS]!]}× — you got ${win} McChips`);
      }
    }, 180);
  };

  const pos = step >= 0 ? path[step]! : null;
  return <main className="min-h-screen bg-background text-foreground"><SecretHeader chips={chips} refill={refill} />
    <div className="mx-auto max-w-xl px-5 py-8">
      <h1 className="font-display text-4xl uppercase">Mc<span className="text-primary">Plinko.</span></h1>
      <div className="mt-6 space-y-3 border border-stage-border bg-stage p-4">
        {Array.from({ length: ROWS + 1 }, (_, r) => <div key={r} className="flex justify-center gap-2">
          {Array.from({ length: r + 1 }, (_, c) => <div key={c} className="flex h-7 w-7 items-center justify-center">
            {pos !== null && step === r && pos === c ? <img src={portrait.url} alt="McCann" className="h-7 w-7 rounded-full object-cover object-top ring-2 ring-highlight" /> : <span className="h-2 w-2 rounded-full bg-muted-foreground" />}
          </div>)}
        </div>)}
        <div className="flex justify-center gap-2">{mult.map((m, i) => <span key={i} className={`w-7 text-center text-[10px] font-bold ${step === ROWS && pos === i ? "text-highlight" : "text-muted-foreground"}`}>{m}×</span>)}</div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <input type="number" min={1} value={bet} onChange={e => setBet(Number(e.target.value))} aria-label="Bet" className="w-24 rounded-sm border border-input bg-muted px-3 py-2 text-sm" />
        <Button variant="tomato" className="flex-1 rounded-sm" onClick={drop} disabled={dropping || bet > chips || bet <= 0}>Drop McCann</Button>
      </div>
      {result && <p role="status" className="mt-4 text-center font-display text-lg uppercase text-highlight">{result}</p>}
    </div>
  </main>;
}
