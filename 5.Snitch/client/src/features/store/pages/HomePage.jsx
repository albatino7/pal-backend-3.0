import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../../products/components/ProductCard";
import ProductDetailModal from "../../products/components/ProductDetailModal";
import { usePublishedProducts } from "../../products/hooks/usePublishedProducts";

export default function HomePage() {
  const { data } = usePublishedProducts({ page: 1, limit: 4 });
  const isQuickViewOpen = useSelector((state) => Boolean(state.products.quickViewProduct));
  const featuredProducts = data?.products?.slice(0, 4) || [];

  return (
    <div className="space-y-16">
      <section className="relative flex min-h-[620px] overflow-hidden bg-[#272a22] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1280&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="relative z-10 flex max-w-3xl flex-col justify-center px-8 py-16 sm:px-16 lg:px-20">
          <div className="mb-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
            <Sparkles size={14} /> Your style, your rules
          </div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">
            The new season is here
          </p>
          <h1 className="font-display text-6xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-8xl">
            Find your
            <br />
            <span className="text-lime">own lane.</span>
          </h1>
          <p className="mt-7 max-w-md text-sm leading-6 text-white/70">
            Everyday fits with a little more attitude. Make the familiar feel brand new.
          </p>
          <Link
            to="/products"
            className="mt-9 inline-flex w-fit items-center gap-7 bg-lime px-6 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-ink transition hover:bg-white"
          >
            Explore the collection <ArrowRight size={15} />
          </Link>
          <div className="mt-16 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-9 bg-lime" /> The everyday, reimagined
          </div>
        </div>
        <span className="absolute bottom-7 right-8 hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60 sm:flex">
          Scroll to explore <ArrowUpRight size={13} />
        </span>
      </section>

      {/* Featured Drops Preview */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-black/[0.08] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
                Fresh Off The Rack
              </span>
              <h2 className="mt-1 font-display text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
                Featured Drops<span className="text-lime">.</span>
              </h2>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-ink hover:underline decoration-lime decoration-2 underline-offset-4"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} priority={true} />
            ))}
          </div>
        </section>
      )}

      {isQuickViewOpen && <ProductDetailModal />}
    </div>
  );
}
