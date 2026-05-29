"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart } = useCart() ?? {};

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove("will-reveal");
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email is required.";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number.";
    if (!address.trim()) errs.address = "Address is required.";
    if (!city.trim()) errs.city = "City is required.";
    if (!state.trim()) errs.state = "State is required.";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "Enter a valid 6-digit PIN code.";
    return errs;
  }

  async function handlePayClick() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setPaying(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))),
        }),
      });
      const data = await res.json();
      setPayData(data);
    } catch (e) {
      setPaying(false);
    }
  }

  async function payNow() {
    if (typeof (window as any).PaymentRequest !== "undefined") {
      try {
        const req = new (window as any).PaymentRequest(
          [{
            supportedMethods: "https://tez.google.com/pay",
            data: {
              pa: payData.upiId,
              tr: payData.orderId,
              am: String(payData.amount),
              cu: "INR",
            },
          }],
          { total: { label: "Total", amount: { currency: "INR", value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete("success");
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handleConfirm() {
    setConfirming(true);
    try {
      await fetch("/api/upi-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: `${address} ${city} ${state} ${pin}`,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: "earshoshy",
          amount: payData.amount,
          upiTxnId,
        }),
      });
      setPaid(true);
      clearCart?.();
    } catch (e) {
      setConfirming(false);
    }
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    background: "#FFFFFF",
    border: "1px solid #E8E0D5",
    borderRadius: "8px",
    fontSize: "15px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  };

  const inputError: React.CSSProperties = {
    ...inputBase,
    border: "1.5px solid #C0392B",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "6px",
    fontFamily: "var(--font-body)",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#C0392B",
    marginTop: "4px",
    fontFamily: "var(--font-body)",
  };

  if (items.length === 0 && !paid) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "80vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 24px", fontFamily: "var(--font-body)" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "24px" }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "16px" }}>Your bag is empty.</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", marginBottom: "40px" }}>Add something from the collection to proceed.</p>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ transition: "transform 0.15s ease", padding: "16px 48px", background: "var(--primary)", color: "#FAF7F2", border: "none", borderRadius: "9999px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", letterSpacing: "0.02em" }}
            >
              Start Shopping
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --font-heading: 'Fraunces', serif; --font-body: 'DM Sans', sans-serif; --bg: #FAF7F2; --surface: #6E6459; --primary: #3B3B3B; --accent: #BC9347; --text: #1A1A1A; --muted: #A89880; }
        .reveal { opacity: 1; transform: translateY(0); }
        .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
        .visible { opacity: 1 !important; transform: translateY(0) !important; }
        input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(188,147,71,0.12) !important; }
        input::placeholder { color: var(--muted); }
        .checkout-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(188,147,71,0.12); }
        @media (max-width: 768px) {
          .checkout-grid { flex-direction: column !important; }
          .checkout-form-col { padding: 48px 20px !important; }
          .checkout-summary-col { padding: 32px 20px !important; position: static !important; border-left: none !important; border-top: 1px solid #E8E0D5 !important; }
          .form-row { flex-direction: column !important; }
        }
      `}</style>

      <main style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
        {/* Page Header */}
        <div style={{ borderBottom: "1px solid #E8E0D5", padding: "32px 48px 0", background: "var(--bg)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>earshoshy</span>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginTop: "8px", marginBottom: "24px" }}>
              Complete Your Order
            </h1>
          </div>
        </div>

        {/* Two-column Layout */}
        <div className="checkout-grid" style={{ display: "flex", maxWidth: "1280px", margin: "0 auto", minHeight: "calc(100vh - 200px)" }}>

          {/* LEFT — Form */}
          <div className="checkout-form-col reveal" style={{ flex: "1 1 55%", padding: "64px 48px 96px", borderRight: "1px solid #E8E0D5" }}>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "40px" }}>
              Shipping Information
            </h2>

            {/* Full Name */}
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                className="checkout-input"
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }}
                placeholder="Arjun Mehta"
                style={errors.name ? inputError : inputBase}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Email + Phone row */}
            <div className="form-row" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  className="checkout-input"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
                  placeholder="arjun@example.com"
                  style={errors.email ? inputError : inputBase}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Phone (10 digits)</label>
                <input
                  className="checkout-input"
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/, "")); setErrors(prev => ({ ...prev, phone: "" })); }}
                  placeholder="9876543210"
                  maxLength={10}
                  style={errors.phone ? inputError : inputBase}
                />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Street Address</label>
              <input
                className="checkout-input"
                type="text"
                value={address}
                onChange={e => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: "" })); }}
                placeholder="42, MG Road, Flat 3B"
                style={errors.address ? inputError : inputBase}
              />
              {errors.address && <p style={errorStyle}>{errors.address}</p>}
            </div>

            {/* City + State row */}
            <div className="form-row" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>City</label>
                <input
                  className="checkout-input"
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); setErrors(prev => ({ ...prev, city: "" })); }}
                  placeholder="Bangalore"
                  style={errors.city ? inputError : inputBase}
                />
                {errors.city && <p style={errorStyle}>{errors.city}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>State</label>
                <input
                  className="checkout-input"
                  type="text"
                  value={state}
                  onChange={e => { setState(e.target.value); setErrors(prev => ({ ...prev, state: "" })); }}
                  placeholder="Karnataka"
                  style={errors.state ? inputError : inputBase}
                />
                {errors.state && <p style={errorStyle}>{errors.state}</p>}
              </div>
            </div>

            {/* PIN */}
            <div style={{ marginBottom: "40px" }}>
              <label style={labelStyle}>PIN Code (6 digits)</label>
              <input
                className="checkout-input"
                type="text"
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/, "")); setErrors(prev => ({ ...prev, pin: "" })); }}
                placeholder="560001"
                maxLength={6}
                style={{ ...(errors.pin ? inputError : inputBase), maxWidth: "200px" }}
              />
              {errors.pin && <p style={errorStyle}>{errors.pin}</p>}
            </div>

            {/* Payment Method Note */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", borderRadius: "12px", padding: "20px 24px", marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(188,147,71,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>UPI Payment</p>
                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>Pay via Google Pay, PhonePe, Paytm, or any UPI app. Safe and instant.</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePayClick}
              disabled={paying}
              onMouseEnter={e => !paying && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                transition: "transform 0.15s ease",
                width: "100%",
                height: "56px",
                background: paying ? "var(--muted)" : "var(--primary)",
                color: "#FAF7F2",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: paying ? "not-allowed" : "pointer",
                letterSpacing: "0.01em",
                boxShadow: "0 8px 32px -8px rgba(59,59,59,0.35)",
              }}
            >
              {paying ? "Generating Payment..." : `Pay via UPI — ₹${total.toLocaleString("en-IN")}`}
            </button>

            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", marginTop: "16px", lineHeight: 1.6 }}>
              Secured by 256-bit encryption · Your data is never stored
            </p>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button
                onClick={() => router.push("/shop")}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="checkout-summary-col reveal" style={{ flex: "1 1 45%", padding: "64px 48px 96px", position: "sticky", top: "80px", alignSelf: "flex-start", maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "32px" }}>
              Order Summary
            </h2>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "10px", overflow: "hidden", background: "#F0EBE3", flexShrink: 0, border: "1px solid #E8E0D5" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p style={{ fontSize: "13px", color: "var(--muted)" }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #E8E0D5", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "var(--muted)" }}>Shipping</span>
                <span style={{ fontSize: "15px", fontWeight: 500, color: shipping === 0 ? "#2E7D32" : "var(--text)" }}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping === 0 && (
                <p style={{ fontSize: "12px", color: "#2E7D32", background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.15)", borderRadius: "6px", padding: "6px 10px" }}>
                  ✓ You qualify for free delivery
                </p>
              )}
              {shipping > 0 && (
                <p style={{ fontSize: "12px", color: "var(--muted)", background: "rgba(168,152,128,0.08)", border: "1px solid #E8E0D5", borderRadius: "6px", padding: "6px 10px" }}>
                  Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
              <div style={{ borderTop: "1px solid #E8E0D5", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-heading)" }}>Total</span>
                <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "100% Secure Payments" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, text: "Ships within 2–4 business days" },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, text: "7-day hassle-free returns" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {t.icon}
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAYMENT OVERLAY */}
        {payData && !paid && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(26,26,26,0.65)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
          }}>
            <div style={{
              background: "#FAF7F2", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "400px",
              boxShadow: "0 40px 80px -20px rgba(26,26,26,0.4)", fontFamily: "var(--font-body)"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>earshoshy</span>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>Order #{payData.orderId?.slice(-8)}</p>
                </div>
                <button
                  onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                  style={{ background: "#F0EBE3", border: "none", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Amount */}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>Amount to Pay</p>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  ₹{payData.amount?.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Mobile: Pay Button */}
              {isMobile ? (
                <div style={{ marginBottom: "20px" }}>
                  <button
                    onClick={payNow}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                    onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    style={{
                      transition: "transform 0.15s ease",
                      width: "100%", height: "52px", background: "var(--primary)", color: "#FAF7F2",
                      border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 600,
                      fontFamily: "var(--font-body)", cursor: "pointer",
                      boxShadow: "0 8px 24px -6px rgba(59,59,59,0.35)"
                    }}
                  >
                    Pay ₹{payData.amount?.toLocaleString("en-IN")} Now
                  </button>
                  <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                    Opens Google Pay · PhonePe · Paytm
                  </p>
                  {paymentLaunched && (
                    <div style={{ background: "rgba(46,125,50,0.08)", border: "1px solid rgba(46,125,50,0.2)", borderRadius: "8px", padding: "10px 14px", marginTop: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", color: "#2E7D32", fontWeight: 500 }}>Payment app opened — confirm below</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Desktop: QR Code */
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
                  <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "12px", border: "1px solid #E8E0D5", marginBottom: "10px" }}>
                    {payData.qrBase64 ? (
                      <img src={`data:image/png;base64,${payData.qrBase64}`} width={200} height={200} alt="UPI QR Code" />
                    ) : (
                      <div style={{ width: 200, height: 200, background: "#F0EBE3", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                          <path d="M14 14h7v7M14 17h4M14 21h4"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted)", textAlign: "center" }}>Scan with any UPI app</p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", textAlign: "center" }}>Google Pay · PhonePe · Paytm · BHIM</p>
                </div>
              )}

              {/* Divider */}
              <div style={{ borderTop: "1px solid #E8E0D5", paddingTop: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                  Confirm Payment
                </p>
                <input
                  type="text"
                  value={upiTxnId}
                  onChange={e => setUpiTxnId(e.target.value)}
                  placeholder="UPI Transaction ID (optional)"
                  style={{ ...inputBase, marginBottom: "12px", fontSize: "14px" }}
                />
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  onMouseEnter={e => !confirming && (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  style={{
                    transition: "transform 0.15s ease",
                    width: "100%", height: "48px",
                    background: confirming ? "var(--muted)" : "var(--accent)",
                    color: "#FAF7F2", border: "none", borderRadius: "10px",
                    fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-body)",
                    cursor: confirming ? "not-allowed" : "pointer",
                    boxShadow: confirming ? "none" : "0 6px 20px -6px rgba(188,147,71,0.5)"
                  }}
                >
                  {confirming ? "Confirming..." : "I've Paid — Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS OVERLAY */}
        {paid && payData && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(26,26,26,0.75)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001, padding: "20px"
          }}>
            <div style={{
              background: "#FAF7F2", borderRadius: "24px", padding: "48px 36px", width: "100%", maxWidth: "400px",
              textAlign: "center", boxShadow: "0 40px 80px -20px rgba(26,26,26,0.4)", fontFamily: "var(--font-body)"
            }}>
              {/* Success Icon */}
              <div style={{ width: "72px", height: "72px", background: "rgba(46,125,50,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "8px" }}>
                Order Confirmed!
              </h2>
              <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "6px" }}>
                Order #{payData.orderId?.slice(-8)}
              </p>
              <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "40px" }}>
                We'll ship your order soon.<br />You'll receive a confirmation shortly.
              </p>

              <button
                onClick={() => router.push("/")}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  transition: "transform 0.15s ease",
                  width: "100%", height: "52px", background: "var(--primary)", color: "#FAF7F2",
                  border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 600,
                  fontFamily: "var(--font-body)", cursor: "pointer", marginBottom: "12px",
                  boxShadow: "0 8px 24px -6px rgba(59,59,59,0.35)"
                }}
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push("/shop")}
                style={{
                  width: "100%", height: "44px", background: "transparent",
                  color: "var(--muted)", border: "1px solid #E8E0D5",
                  borderRadius: "12px", fontSize: "14px", fontFamily: "var(--font-body)",
                  cursor: "pointer"
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}