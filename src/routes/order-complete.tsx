import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";

export const Route = createFileRoute("/order-complete")({
  validateSearch: z.object({ order: z.string().catch(""), name: z.string().catch(""), total: z.string().catch("0.00") }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Mini McCann Shop" },
      { name: "description", content: "Your Mini McCann order is on its way." },
      { property: "og:title", content: "Order Confirmed — Mini McCann Shop" },
      { property: "og:description", content: "Your Mini McCann order is on its way." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Done,
});

function Done() {
  const { order, name, total } = Route.useSearch();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ShopHeader />
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <CheckCircle2 className="mx-auto text-highlight" size={56} />
        <h1 className="mt-4 font-display text-4xl uppercase">Thanks{name ? `, ${name.split(" ")[0]}` : ""}!</h1>
        <p className="mt-3 text-muted-foreground">Order <span className="font-bold text-foreground">#{order}</span> for <span className="font-bold text-foreground">${total}</span> is confirmed. Your mini McCanns are being packed.</p>
        <Button asChild variant="tomato" className="mt-8 rounded-sm"><Link to="/shop">Keep shopping</Link></Button>
      </div>
    </main>
  );
}
