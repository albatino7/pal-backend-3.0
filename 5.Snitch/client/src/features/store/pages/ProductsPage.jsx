import { ArrowRight, Shirt } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  return (
    <section className="mx-auto max-w-4xl py-16 text-center sm:py-24">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-lime">
        <Shirt size={23} />
      </span>
      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
        The good stuff
      </p>
      <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.06em] sm:text-7xl">
        New fits are coming.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-ink/55">
        The collection is getting ready. Check back soon for your next everyday favourite.
      </p>
      <Link to="/home" className="action-link mt-8">
        Back to home <ArrowRight size={15} />
      </Link>
    </section>
  );
}
