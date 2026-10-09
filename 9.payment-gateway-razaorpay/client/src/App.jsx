import { useEffect, useState } from "react";
import axios from "axios";
import {
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  LoaderCircle,
  Package,
  RefreshCw,
  Star,
} from "lucide-react";
import Normal from "./Normal";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from our backend
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);

      const { data } = await axios.get("/api/product");

      // Adjust this depending on your backend response structure
      const productList = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(productList);

      if (productList.length > 0) {
        setSelectedProduct(productList[0]);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      setMessage("Unable to load products. Please try again.");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create order and open Razorpay Checkout
  const buyProduct = async (product) => {
    try {
      setLoading(true);
      setMessage("");
      setSelectedProduct(product);

      const { data } = await axios.post(
        `/api/payment/createorder/${product._id}`,
      );

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout script is not loaded.");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Kapda Co.",
        description: product.title || product.name || "Product purchase",
        image: product.thumbnail || undefined,

        handler: async (response) => {
          try {
            setMessage("Verifying your payment...");

            const result = await axios.post("/api/payment/verify", response);

            if (result.data.status === "success") {
              setMessage("");
              setPaymentSuccess(true);
            } else {
              setMessage("Payment verification failed.");
            }
          } catch (error) {
            console.error(
              "Verification error:",
              error.response?.data || error.message,
            );

            setMessage(
              error.response?.data?.message ||
                "We couldn't verify your payment. Please contact support if money was deducted.",
            );
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage("Payment window closed.");
          },
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);
        setMessage(
          response.error?.description || "Payment failed. Please try again.",
        );
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to start checkout.",
      );
      setLoading(false);
    }
  };

  // Stop the loading state when the success screen is shown
  useEffect(() => {
    if (paymentSuccess) {
      setLoading(false);
    }
  }, [paymentSuccess]);

  // Celebration screen
  if (paymentSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 py-12">
        {/* Confetti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 55 }).map((_, index) => (
            <span
              key={index}
              className="confetti-piece absolute -top-8"
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${(index % 15) * 0.16}s`,
                animationDuration: `${3 + (index % 5)}s`,
                backgroundColor: [
                  "#2563eb",
                  "#10b981",
                  "#f59e0b",
                  "#ec4899",
                  "#8b5cf6",
                ][index % 5],
                transform: `rotate(${index * 23}deg)`,
              }}
            />
          ))}
        </div>

        {/* Success card */}
        <div className="relative z-10 w-full max-w-lg animate-success-entrance rounded-3xl border border-white bg-white/90 p-7 text-center shadow-2xl shadow-blue-100 backdrop-blur-xl sm:p-10">
          <div className="absolute -right-3 -top-3 animate-bounce rounded-full bg-amber-100 p-3 text-amber-500 shadow-md">
            <Sparkles size={27} />
          </div>

          <div className="mx-auto mb-7 flex h-28 w-28 animate-success-pulse items-center justify-center rounded-full bg-emerald-100">
            <div className="flex h-20 w-20 animate-check-pop items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
              <Check size={48} strokeWidth={3} />
            </div>
          </div>

          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <ShieldCheck size={17} />
            Payment verified
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Yay! It's yours!
          </h1>

          <p className="mx-auto mt-4 max-w-sm leading-7 text-slate-500">
            Your payment was successful. Thanks for shopping with Kapda Co. Your
            next favorite thing is on its way!
          </p>

          {selectedProduct && (
            <div className="mt-7 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <img
                src={selectedProduct.thumbnail || selectedProduct.images?.[0]}
                alt={selectedProduct.title || selectedProduct.name}
                className="h-20 w-20 rounded-xl bg-white object-contain"
              />

              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 font-bold text-slate-800">
                  {selectedProduct.title || selectedProduct.name}
                </h2>
                <p className="mt-1 text-sm text-emerald-600">
                  Order payment confirmed
                </p>
              </div>

              <ShoppingBag className="shrink-0 text-blue-600" size={23} />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                setPaymentSuccess(false);
                setMessage("");
                fetchProducts();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <ShoppingBag size={19} />
              Continue Shopping
              <ArrowRight size={18} />
            </button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Thank you for choosing Kapda Co.
          </p>
        </div>
      </div>
    );
  }

  // Product listing screen
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-8">
      <Normal />
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
              <ShoppingBag className="text-blue-600" size={32} />
              Kapda Co.
            </h1>
            <p className="mt-2 text-slate-500">Find something you will love.</p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <ShieldCheck size={18} className="text-emerald-500" />
            Secure checkout
          </div>
        </header>

        {message && (
          <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p>{message}</p>
            <button
              onClick={() => setMessage("")}
              className="font-bold"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {productsLoading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="animate-spin" size={25} />
            Loading your products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Package size={42} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No products found
            </h2>
            <p className="mt-2 text-slate-500">
              Check your backend products endpoint.
            </p>
            <button
              onClick={fetchProducts}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              <RefreshCw size={17} />
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Our Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {products.length} products available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-50 p-5">
                    <img
                      src={
                        product.thumbnail ||
                        product.images?.[0] ||
                        "https://placehold.co/400x300?text=Product"
                      }
                      alt={product.title || product.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                    />

                    {product.discountPercentage > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                        {Math.round(product.discountPercentage)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      {product.category || "Featured"}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-bold text-slate-900">
                      {product.title || product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">
                      {product.description || "A great pick for you."}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{product.amount ?? product.price}
                      </span>

                      {product.rating != null && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                          <Star size={16} fill="currentColor" />
                          {Number(product.rating).toFixed(1)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => buyProduct(product)}
                      disabled={loading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading && selectedProduct?._id === product._id ? (
                        <>
                          <LoaderCircle className="animate-spin" size={19} />
                          Opening checkout...
                        </>
                      ) : (
                        <>
                          <CreditCard size={19} />
                          Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
