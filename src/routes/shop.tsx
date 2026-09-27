import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShopHeader } from "@/components/ShopHeader";
import { products, money, useCart } from "@/lib/cart";
import photo from "@/assets/tomato-target.png.asset.json";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Mini McCann Shop — Collect Your Own McCann" },
      { name: "description", content: "Figures, plushies, and keychains of everyone's favorite McCann. Order yours today." },
      { property: "og:title", content: "Mini McCann Shop — Collect Your Own McCann" },
      { property: "og:description", content: "Figures, plushies, and keychains of everyone's favorite McCann." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const scales = { classic: "scale-100", deluxe: "scale-110", plush: "scale-125 rounded-full", pocket: "scale-75" } as const;

function Shop() {
  const { add } = useCart();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ShopHeader />
      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-9">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-highlight">Now shipping</p>
        <h1 className="mt-2 font-display text-[clamp(2.4rem,5vw,4.5rem)] uppercase leading-none">Get your own <span className="text-primary">mini McCann.</span></h1>
        <p className="mt-4 max-w-md text-muted-foreground">Same face, smaller size. Pick your favorite format below.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(p => (
            <article key={p.id} className="flex flex-col border border-stage-border bg-stage">
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted">
                <img src={photo.url} alt={p.name} className={`h-3/4 w-3/4 object-cover shadow-lg ${scales[p.id]}`} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="font-display text-lg uppercase">{p.name}</h2>
                <p className="flex-1 text-sm text-muted-foreground">{p.blurb}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-display text-xl text-highlight">{money(p.price)}</span>
                  <Button variant="tomato" className="rounded-sm" onClick={() => { add(p.id); toast.success(`${p.name} added to cart`); }}>Add to cart</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
