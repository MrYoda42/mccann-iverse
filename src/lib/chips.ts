import { useEffect, useState } from "react";

const KEY = "mccann-chips";
export function useChips() {
  const [chips, setChipsState] = useState(1000);
  useEffect(() => { const v = Number(localStorage.getItem(KEY)); if (v > 0) setChipsState(v); }, []);
  const setChips = (fn: (c: number) => number) => setChipsState(c => { const n = Math.max(0, fn(c)); localStorage.setItem(KEY, String(n)); return n; });
  return { chips, setChips, refill: () => setChips(() => 1000) };
}
