import { Link } from "@tanstack/react-router";
import { ShoppingBag, Target, Gamepad2, ClipboardList } from "lucide-react";
import { useCart } from "@/lib/cart";

export function ShopHeader() {
  const { count } = useCart();
  return (
    <>
      <div className="ticket-stripes h-2 w-full" aria-hidden="true" />
      <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-9">
        <Link to="/shop" className="font-display text-base uppercase sm:text-xl">Mini McCann<span className="text-primary">.</span></Link>
        <nav className="flex items-center gap-5 text-xs font-bold uppercase tracking-[.14em]">
          <Link to="/games" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><Gamepad2 size={15} /> Games</Link>
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><Target size={15} /> Fruit Toss</Link>
          <Link to="/orders" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><ClipboardList size={15} /> Log</Link>
          <Link to="/checkout" className="flex items-center gap-1.5 text-highlight"><ShoppingBag size={16} /> Cart ({count})</Link>
        </nav>
      </header>
    </>
  );
}
