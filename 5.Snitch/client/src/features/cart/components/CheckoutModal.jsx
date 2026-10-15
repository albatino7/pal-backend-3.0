import { Loader2, MapPin, Phone, ShieldCheck, User, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";

export default function CheckoutModal({ isOpen, onClose, cart, totalAmount, onOrderPlaced }) {
  const authUser = useSelector((state) => state.auth.user);
  const { checkout, isProcessing, error: checkoutError, clearError } = useRazorpayCheckout();

  const [formData, setFormData] = useState({
    fullName: authUser?.name || "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (validationError) setValidationError("");
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setValidationError("");
    clearError();

    const { fullName, phone, street, city, state, pinCode } = formData;
    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !state.trim() || !pinCode.trim()) {
      setValidationError("Please fill in all mandatory delivery address fields.");
      return;
    }

    if (!/^\d{6}$/.test(pinCode.trim())) {
      setValidationError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim().replace(/\D/g, ""))) {
      setValidationError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const compiledAddress = `${fullName.trim()}, Phone: ${phone.trim()}, ${street.trim()}${
      formData.landmark ? `, Landmark: ${formData.landmark.trim()}` : ""
    }, ${city.trim()}, ${state.trim()} - PIN: ${pinCode.trim()}`;

    await checkout({
      products: cart.products,
      totalAmount,
      shippingAddress: compiledAddress,
      onSuccess: (order) => {
        onClose();
        if (onOrderPlaced) onOrderPlaced(order);
      },
      onFailure: (errMsg) => {
        setValidationError(errMsg);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[92vh] bg-white border border-black/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4 bg-paper">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40">
              Secure Checkout
            </span>
            <h2 className="font-display text-xl font-black uppercase text-ink">
              Delivery & Payment
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex size-8 items-center justify-center border border-black/10 text-ink/60 transition hover:bg-ink hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handlePay} className="flex-1 overflow-y-auto p-6 space-y-6">
          {(validationError || checkoutError) && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
              {validationError || checkoutError}
            </div>
          )}

          {/* Delivery Address Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-ink flex items-center gap-2">
              <MapPin size={14} className="text-lime" /> Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                Flat, House no., Building, Street *
              </label>
              <input
                type="text"
                required
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                className="form-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Near Metro Station"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="sm:w-1/2">
              <label className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink/60 mb-1">
                PIN Code * (6 Digits)
              </label>
              <input
                type="text"
                required
                maxLength={6}
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="400001"
                className="form-input text-xs"
              />
            </div>
          </div>

          {/* Order Summary Overview */}
          <div className="border-t border-black/10 pt-4 space-y-2 bg-paper/60 p-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/50 block">
              Payment Summary
            </span>
            <div className="flex justify-between text-xs text-ink/70">
              <span>Items Subtotal ({cart?.products?.length || 0} items)</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-ink/70">
              <span>Standard Shipping</span>
              <span className="text-emerald-700 font-bold uppercase">Free</span>
            </div>
            <div className="flex justify-between text-sm font-black text-ink border-t border-black/10 pt-2">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-[10px] text-ink/50 bg-white p-2 border border-black/5">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>Payments encrypted and processed securely via Razorpay Gateway.</span>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex w-full items-center justify-center gap-2 bg-lime py-4 text-xs font-black uppercase tracking-[0.16em] text-ink transition hover:bg-ink hover:text-white disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing Razorpay Payment...
                </>
              ) : (
                `Pay ₹${totalAmount.toLocaleString("en-IN")} with Razorpay`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
