import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SecretHeader({ chips, refill }: { chips: number; refill: () => void }) {
  return <header className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-9">
    <Link to="/secret" className="font-display text-lg uppercase">McCasino<span className="text-primary">.</span></Link>
    <div className="flex items-center gap-3 text-sm font-bold">
      <span className="flex items-center gap-1.5 text-highlight"><Coins size={16} /> {chips} McChips</span>
      {chips < 10 && <Button size="sm" variant="utility" className="rounded-sm" onClick={refill}>Refill</Button>}
      <Link to="/games" className="text-xs uppercase text-muted-foreground hover:text-foreground">Exit</Link>
    </div>
  </header>;
}
