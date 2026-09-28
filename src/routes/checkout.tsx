import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";
import { money, useCart } from "@/lib/cart";
import { logOrder } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Mini McCann Shop" },
      { name: "description", content: "Review your cart and place your Mini McCann order." },
      { property: "og:title", content: "Checkout — Mini McCann Shop" },
      { property: "og:description", content: "Review your cart and place your Mini McCann order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

const field = "w-full rounded-sm border border-input bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Checkout() {
  const { items, subtotal, setQty, clear } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [placing, setPlacing] = useState(false);
  const shipCost = items.length === 0 ? 0 : shipping === "express" ? 14 : subtotal >= 50 ? 0 : 6;
  const tax = subtotal * 0.08;
  const total = subtotal + shipCost + tax;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const card = String(data.get("card")).replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(card)) return alert("Please enter a valid card number.");
    setPlacing(true);
    const order = Math.random().toString(36).slice(2, 8).toUpperCase();
    const g = (k: string) => String(data.get(k) ?? "");
    logOrder({
      id: order, date: new Date().toISOString(), name: g("name"), email: g("email"),
      address: `${g("address")}, ${g("city")}, ${g("state")} ${g("zip")}`,
      shipping: shipping === "express" ? "Express" : "Standard",
      items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      total: Math.round(total * 100) / 100,
    });
    setTimeout(() => {
      clear();
      navigate({ to: "/order-complete", search: { order, name: String(data.get("name")), total: Math.round(total * 100) / 100 } });
    }, 900);
  };

  if (items.length === 0) return (
    <main className="min-h-screen bg-background text-foreground"><ShopHeader />
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl uppercase">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">No McCanns yet. Let's fix that.</p>
        <Button asChild variant="tomato" className="mt-6 rounded-sm"><Link to="/shop">Browse the shop</Link></Button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ShopHeader />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-10 sm:px-9 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="space-y-8">
          <h1 className="font-display text-4xl uppercase">Checkout</h1>
          <fieldset className="space-y-3">
            <legend className="mb-3 text-xs font-extrabold uppercase tracking-[.18em] text-highlight">Contact</legend>
            <input required name="name" placeholder="Full name" className={field} />
            <input required name="email" type="email" placeholder="Email" className={field} />
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="mb-3 text-xs font-extrabold uppercase tracking-[.18em] text-highlight">Shipping address</legend>
            <input required name="address" placeholder="Street address" className={field} />
            <div className="grid grid-cols-3 gap-3">
              <input required name="city" placeholder="City" className={field} />
              <input required name="state" placeholder="State" className={field} />
              <input required name="zip" placeholder="ZIP" className={field} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["standard", "express"] as const).map(s => (
                <label key={s} className={`flex cursor-pointer items-center justify-between rounded-sm border p-3 text-sm ${shipping === s ? "border-highlight" : "border-border"}`}>
                  <span className="flex items-center gap-2"><input type="radio" name="ship" checked={shipping === s} onChange={() => setShipping(s)} />{s === "standard" ? "Standard (5–7 days)" : "Express (1–2 days)"}</span>
                  <span>{s === "express" ? "$14.00" : subtotal >= 50 ? "Free" : "$6.00"}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="mb-3 text-xs font-extrabold uppercase tracking-[.18em] text-highlight">Payment</legend>
            <input required name="card" inputMode="numeric" placeholder="Card number" className={field} />
            <div className="grid grid-cols-2 gap-3">
              <input required name="exp" placeholder="MM / YY" pattern="\d{2}\s?/\s?\d{2}" className={field} />
              <input required name="cvc" placeholder="CVC" pattern="\d{3,4}" className={field} />
            </div>
            <p className="text-xs text-muted-foreground">Demo checkout — no real charge is made.</p>
          </fieldset>
          <Button type="submit" variant="tomato" size="lg" disabled={placing} className="h-12 w-full rounded-sm text-base">{placing ? "Placing order…" : `Place order · ${money(total)}`}</Button>
        </form>

        <aside className="h-fit border border-stage-border bg-stage p-5 lg:sticky lg:top-6">
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[.18em] text-highlight">Order summary</h2>
          <ul className="space-y-4">
            {items.map(i => (
              <li key={i.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={i.image} alt="" className="h-14 w-14 shrink-0 object-cover" />
                  <div className="min-w-0">
                  <p className="font-bold">{i.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                    <button type="button" aria-label="Decrease" onClick={() => setQty(i.id, i.qty - 1)}><Minus size={14} /></button>
                    <span className="tabular-nums text-foreground">{i.qty}</span>
                    <button type="button" aria-label="Increase" onClick={() => setQty(i.id, i.qty + 1)}><Plus size={14} /></button>
                    <button type="button" aria-label="Remove" className="ml-2" onClick={() => setQty(i.id, 0)}><Trash2 size={14} /></button>
                  </div>
                  </div>
                </div>
                <span className="tabular-nums">{money(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{money(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipCost === 0 ? "Free" : money(shipCost)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax (8%)</dt><dd>{money(tax)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg"><dt>Total</dt><dd className="text-highlight">{money(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
