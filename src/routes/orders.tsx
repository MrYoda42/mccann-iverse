import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";
import { money } from "@/lib/cart";
import { clearOrders, readOrders, type LoggedOrder } from "@/lib/orders";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [
    { title: "Order Log — Mini McCann Shop" },
    { name: "description", content: "Every Mini McCann order and the details entered at checkout." },
    { property: "og:title", content: "Order Log — Mini McCann Shop" },
    { property: "og:description", content: "Every Mini McCann order and the details entered at checkout." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Orders,
});

function Orders() {
  const [orders, setOrders] = useState<LoggedOrder[]>([]);
  useEffect(() => setOrders(readOrders()), []);
  return <main className="min-h-screen bg-background text-foreground"><ShopHeader />
    <div className="mx-auto max-w-[1000px] px-5 py-10 sm:px-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-highlight">Store log</p>
          <h1 className="mt-2 font-display text-4xl uppercase">Order <span className="text-primary">log.</span></h1>
          <p className="mt-2 text-sm text-muted-foreground">{orders.length} order{orders.length === 1 ? "" : "s"} recorded on this device.</p></div>
        {orders.length > 0 && <Button variant="utility" className="rounded-sm" onClick={() => { if (confirm("Delete the whole log?")) { clearOrders(); setOrders([]); } }}>Clear log</Button>}
      </div>
      {orders.length === 0 ? <p className="mt-10 text-muted-foreground">No orders yet. Place one from the shop and it shows up here.</p> :
      <ul className="mt-8 space-y-4">{orders.map(o => <li key={o.id} className="border border-stage-border bg-stage p-5 text-sm">
        <div className="flex flex-wrap justify-between gap-2"><span className="font-display text-lg">#{o.id}</span><span className="text-muted-foreground">{new Date(o.date).toLocaleString()}</span></div>
        <p className="mt-2"><b>{o.name}</b> · {o.email}</p>
        <p className="text-muted-foreground">{o.address} · {o.shipping}</p>
        <ul className="mt-3 border-t border-border pt-3">{o.items.map(i => <li key={i.name} className="flex justify-between"><span>{i.qty} × {i.name}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
        <p className="mt-2 text-right font-display text-highlight">Total {money(o.total)}</p>
      </li>)}</ul>}
    </div>
  </main>;
}
