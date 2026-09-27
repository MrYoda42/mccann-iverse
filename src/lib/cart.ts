import { useSyncExternalStore } from "react";

export const products = [
  { id: "classic", name: "Classic Mini McCann", price: 24, blurb: "Hand-painted 4-inch figure. Glasses included, obviously." },
  { id: "deluxe", name: "Deluxe Mini McCann", price: 39, blurb: "6-inch collector edition with cloudy-sky display base." },
  { id: "plush", name: "Plush Mini McCann", price: 29, blurb: "Soft, huggable, and only slightly judgmental." },
  { id: "pocket", name: "Pocket McCann", price: 12, blurb: "Keychain-sized. Take him everywhere." },
] as const;
export type ProductId = typeof products[number]["id"];
export type Cart = Partial<Record<ProductId, number>>;

const KEY = "mini-mccann-cart";
let cart: Cart = {};
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { cart = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { cart = {}; }
}
function set(next: Cart) {
  cart = next;
  localStorage.setItem(KEY, JSON.stringify(cart));
  listeners.forEach(l => l());
}
const empty: Cart = {};

export function useCart() {
  const state = useSyncExternalStore(
    l => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return cart; },
    () => empty,
  );
  const items = products.filter(p => (state[p.id] ?? 0) > 0).map(p => ({ ...p, qty: state[p.id]! }));
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return {
    items, subtotal, count,
    add: (id: ProductId) => set({ ...cart, [id]: (cart[id] ?? 0) + 1 }),
    setQty: (id: ProductId, qty: number) => { const n = { ...cart }; if (qty <= 0) delete n[id]; else n[id] = qty; set(n); },
    clear: () => set({}),
  };
}

export const money = (n: number) => `$${n.toFixed(2)}`;
