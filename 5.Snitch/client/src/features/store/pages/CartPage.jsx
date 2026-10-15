import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartPage() {
  return (
    <section className="mx-auto max-w-4xl py-16 text-center sm:py-24">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-lime">
        <ShoppingBag size={22} />
      </span>
      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
        Your bag
      </p>
      <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.06em] sm:text-7xl">
        Room for something good.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-ink/55">
        Your bag is looking a little light. Find something that feels like you.
      </p>
      <Link to="/products" className="action-link mt-8">
        Start exploring <ArrowRight size={15} />
      </Link>
    </section>
  );
}
