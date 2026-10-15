import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";

function Field({ label, name, register, rules, error, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-ink/55">
        {label}
      </span>
      <input
        type={type}
        autoComplete={name === "email" ? "email" : name === "password" ? "current-password" : "name"}
        className={`form-input ${error ? "border-red-500 focus:border-red-500" : ""}`}
        {...register(name, rules)}
        {...props}
      />
      {error && <span className="mt-1.5 block text-xs text-red-600">{error.message}</span>}
    </label>
  );
}

export default function AuthPage({ mode }) {
  const {
    register,
    formState: { errors },
    onSubmit,
    isRegister,
    isSubmitting,
    serverError,
  } = useAuthForm(mode);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-132px)] max-w-[1440px] items-center gap-12 px-5 pb-12 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
      <section className="relative hidden min-h-[630px] overflow-hidden rounded-[4px] bg-[#25291f] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/15" />
        <div className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Sparkles size={15} className="text-lime" /> The next drop is yours
        </div>
        <div className="relative z-10 max-w-xl">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-lime">
            Less ordinary. More you.
          </p>
          <h1 className="font-display text-6xl font-black uppercase leading-[0.92] tracking-[-0.06em] xl:text-7xl">
            Make room
            <br />
            for <span className="text-lime">better</span>
            <br />
            basics.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-6 text-white/70">
            The pieces you reach for, made to take you everywhere. Your wardrobe called.
          </p>
          <div className="mt-9 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">
            <span className="flex size-7 items-center justify-center rounded-full border border-white/30">
              <Check size={13} className="text-lime" />
            </span>
            New-season fits, just for you
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
          <span>SNITCH / COLLECTION 01</span>
          <span>01 — 04</span>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[480px] py-8 lg:py-0">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink/50 transition hover:text-ink"
        >
          <ArrowLeft size={14} /> Back to the store
        </Link>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/45">
          {isRegister ? "Your people, your style" : "Welcome back"}
        </p>
        <h2 className="font-display text-4xl font-black tracking-[-0.055em] sm:text-5xl">
          {isRegister ? "Get in on it." : "Good to have\nyou back."}
        </h2>
        <p className="mt-4 text-sm leading-6 text-ink/55">
          {isRegister
            ? "Create an account and find your new everyday."
            : "Sign in to pick up right where you left off."}
        </p>

        <form className="mt-9 space-y-5" onSubmit={onSubmit} noValidate>
          {isRegister && (
            <Field
              label="Your name"
              name="name"
              placeholder="Alex Morgan"
              register={register}
              error={errors.name}
              rules={{
                required: "Please enter your name.",
                minLength: { value: 2, message: "Name must be at least 2 characters." },
                maxLength: { value: 20, message: "Name must be 20 characters or fewer." },
              }}
            />
          )}
          <Field
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            register={register}
            error={errors.email}
            rules={{
              required: "Please enter your email.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            }}
          />
          <label className="block">
            <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-ink/55">
              Password
            </span>
            <span className="relative block">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder="Enter your password"
                className={`form-input pr-12 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                {...register("password", {
                  required: "Please enter your password.",
                  minLength: isRegister
                    ? { value: 3, message: "Password must be at least 3 characters." }
                    : undefined,
                  maxLength: isRegister
                    ? { value: 10, message: "Password must be 10 characters or fewer." }
                    : undefined,
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink/45 hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
            {errors.password && (
              <span className="mt-1.5 block text-xs text-red-600">{errors.password.message}</span>
            )}
          </label>

          {serverError && (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex w-full items-center justify-between bg-lime px-5 py-4 text-[10px] font-black uppercase tracking-[0.18em] transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-ink/55">
          {isRegister ? "Already part of the club?" : "New around here?"}{" "}
          <Link
            to={isRegister ? "/login" : "/register"}
            className="font-bold text-ink underline decoration-lime decoration-2 underline-offset-4"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <p className="mt-8 border-t border-black/10 pt-5 text-center text-[9px] font-medium uppercase leading-5 tracking-[0.12em] text-ink/40">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </section>
    </div>
  );
}
