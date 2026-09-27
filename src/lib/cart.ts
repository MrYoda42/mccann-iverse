import { useSyncExternalStore } from "react";
import classicImage from "@/assets/mccann-classic.jpg";
import deluxeImage from "@/assets/mccann-deluxe.jpg";
import plushImage from "@/assets/mccann-plush.jpg";
import pocketImage from "@/assets/mccann-pocket.jpg";
import rainyImage from "@/assets/mccann-rainy.jpg";
import arcadeImage from "@/assets/mccann-arcade.jpg";
import goldImage from "@/assets/mccann-gold.jpg";

export const products = [
  { id: "classic", name: "Classic Mini McCann", price: 24, blurb: "The original look, reimagined as a little collectible bust.", style: "The original", image: classicImage },
  { id: "deluxe", name: "Cloud Nine McCann", price: 39, blurb: "Collector figure standing on his own little cloud.", style: "Collector edition", image: deluxeImage },
  { id: "plush", name: "Plush Mini McCann", price: 29, blurb: "Soft, huggable, and only slightly judgmental.", style: "Soft & squishy", image: plushImage },
  { id: "pocket", name: "Pocket McCann", price: 12, blurb: "A tiny face charm for your keys and adventures.", style: "Everyday carry", image: pocketImage },
  { id: "rainy", name: "Rainy Day McCann", price: 32, blurb: "Yellow raincoat, clear umbrella, unbothered by the forecast.", style: "Weather ready", image: rainyImage },
  { id: "arcade", name: "Arcade McCann", price: 28, blurb: "Varsity jacket on. Controller in hand. Game face activated.", style: "Player one", image: arcadeImage },
  { id: "gold", name: "Gold Edition McCann", price: 49, blurb: "A little extra shine for the collector shelf.", style: "Limited look", image: goldImage },
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
