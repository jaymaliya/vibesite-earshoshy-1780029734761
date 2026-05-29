"use client";
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Apple Wired EarPods", description: "Premium wired Apple EarPods in pristine packaging, offering clean audio and elegant design.", price: 1799 },
  { id: 2, img: "/product-2.jpg", name: "My Brand Wireless Earbuds", description: "Sleek My Brand wireless earbuds, premium audio for tech-savvy and active users.", price: 300 },
  { id: 3, img: "/product-3.jpg", name: "Samsung AKG In-Ear Headphones", description: "Sleek black Samsung AKG in-ear headphones with premium matte finish and metallic accents.", price: 400 },
  { id: 4, img: "/product-4.jpg", name: "Dominant Colors Deep,", description: "The two most dominant colors are a deep, matte charcoal black for the earbud body.", price: 500 },
];

const reviews = [
  { name: "Arjun M.", date: "March 2025", rating: 5, text: "The sound clarity is exceptional. I've tried many earphones in this segment — nothing comes close to the precision of the audio staging here. Worth every rupee." },
  { name: "Priya S.", date: "February 2025", rating: 5, text: "Packaging alone signals quality. The earphones fit perfectly without adjustment. Call quality on the inline remote is outstanding — voices come through crisp and natural." },
  { name: "Rahul K.", date: "January 2025", rating: 4, text: "Genuinely surprised by the build quality. The cable feels durable, not cheap or tangly. Audio is clean with good mid-range presence. Would recommend to anyone upgrading from bundled earphones." },
  { name: "Sneha T.", date: "December 2024", rating: 5, text: "Minimalist, precise, and effortlessly elegant. The form follows the function perfectly. These sit comfortably for hours — ideal for focused work or long commutes." },
];

const cableOptions = ["1.2m Standard", "1.5m Extended"];
const finishOptions = [
  { label: "Arctic White", color: "#F8F8F8" },
  { label: "Space Grey", color: "#4A4A4A" },
  { label: "Warm Sand", color: "#D4B896" },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="1.5" style={{ display: "inline" }}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 4v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem, totalItems } = useCart() ?? { addItem: () => {}, totalItems: 0 };

  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Apple Wired EarPods";
  const displayPrice = paramPrice ?? 1799;

  const currentProduct = products.find(p => p.name === displayName) ?? products[0];
  const displayDescription = currentProduct?.description ?? "Premium audio designed with precision and clarity in mind.";

  const [quantity, setQuantity] = useState(1);
  const [selectedCable, setSelectedCable] = useState(cableOptions[0]);
  const [selectedFinish, setSelectedFinish] = useState(finishOptions[0]);
  const [addedState, setAddedState] = useState<"idle" | "added">("idle");
  const [buyNowState, setBuyNowState] = useState<"idle" | "added">("idle");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const recommendedProducts = products.filter(p => p.name !== displayName);

  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  function handleAddToCart() {
    addItem({ id: crypto.randomUUID(), name: displayName, price: displayPrice, quantity, image: displayImg });
    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 1500);
  }

  function handleBuyNow() {
    addItem({ id: crypto.randomUUID(), name: displayName, price: displayPrice, quantity, image: displayImg });
    setBuyNowState("added");
    setTimeout(() => { setBuyNowState("idle"); router.push("/checkout"); }, 400);
  }

  function handleCarouselMouseDown(e: React.MouseEvent) {
    isDragging.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeft.current = carouselRef.current?.scrollLeft ?? 0;
  }

  function handleCarouselMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  }

  function handleCarouselMouseUp() { isDragging.current = false; }

  const computedPrice = displayPrice * quantity;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <style>{`
        :root {
          --bg: #FAF7F2;
          --surface: #6E6459;
          --primary: #3B3B3B;
          --accent: #BC9347;
          --text: #1A1A1A;
          --muted: #A89880;
          --font-heading: 'Fraunces', serif;
          --font-body: 'DM Sans', sans-serif;
        }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        .product-thumbnail { cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .product-thumbnail:hover { transform: translateY(-2px); }
        .product-thumbnail.active-thumb { box-shadow: 0 0 0 2px var(--accent) !important; }

        .variant-pill { transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease; cursor: pointer; border: none; }
        .variant-pill:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .rec-card { cursor: pointer; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1); }
        .rec-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px -12px rgba(188,147,71,0.25) !important; }
        .rec-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .review-card { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1); }
        .review-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px -8px rgba(59,59,59,0.12) !important; }

        .qty-btn { transition: background 0.15s ease, transform 0.15s ease; cursor: pointer; }
        .qty-btn:hover { background: var(--primary) !important; color: #fff !important; }
        .qty-btn:active { transform: scale(0.95); }
        .qty-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .add-cart-btn { transition: transform 0.15s ease, background 0.2s ease; cursor: pointer; }
        .add-cart-btn:hover { transform: scale(1.02); }
        .add-cart-btn:active { transform: scale(0.98); }
        .add-cart-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .buy-now-btn { transition: transform 0.15s ease, background 0.2s ease; cursor: pointer; }
        .buy-now-btn:hover { transform: scale(1.02); background: var(--primary) !important; }
        .buy-now-btn:active { transform: scale(0.98); }
        .buy-now-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .back-btn { transition: transform 0.15s ease, color 0.15s ease; cursor: pointer; }
        .back-btn:hover { color: var(--accent) !important; transform: translateX(-2px); }
        .back-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .lightbox-backdrop { position: fixed; inset: 0; background: rgba(26,26,26,0.94); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeInBg 0.25s ease; }
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }

        .zoom-img { transition: transform 0.6s ease; cursor: zoom-in; }
        .zoom-img:hover { transform: scale(1.04); }

        @media (max-width: 767px) {
          .product-layout { flex-direction: column !important; }
          .image-col { position: relative !important; top: auto !important; width: 100% !important; }
          .info-col { width: 100% !important; padding: 32px 20px !important; }
          .mobile-sticky-bar { display: flex !important; }
          .desktop-cta-row { display: none !important; }
          .rec-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .mobile-sticky-bar { display: none !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      {/* Breadcrumb + Back */}
      <div style={{ background: "var(--bg)", borderBottom: "1px solid rgba(168,152,128,0.2)", padding: "0 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className="back-btn"
            onClick={() => router.push("/shop")}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--muted)", fontSize: "0.8125rem", fontFamily: "var(--font-body)", letterSpacing: "0.02em", padding: "0" }}
          >
            <BackArrowIcon />
            <span>Back to Shop</span>
          </button>
          <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>/</span>
          <span style={{ color: "var(--text)", fontSize: "0.8125rem", fontFamily: "var(--font-body)", fontWeight: 500 }}>{displayName}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
        <div
          className="product-layout"
          style={{ display: "flex", gap: "64px", alignItems: "flex-start", paddingTop: "48px", paddingBottom: "80px" }}
        >
          {/* Image Column — sticky on desktop */}
          <div
            className="image-col"
            style={{ width: "55%", position: "sticky", top: "88px", flexShrink: 0 }}
          >
            {/* Main Image */}
            <div
              style={{ background: "#F4F1EC", borderRadius: "20px", overflow: "hidden", boxShadow: "0 24px 64px -16px rgba(59,59,59,0.16)", position: "relative" }}
            >
              <img
                src={displayImg}
                alt={displayName}
                className="zoom-img"
                onClick={() => setLightboxOpen(true)}
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "contain", display: "block", padding: "32px" }}
              />
              {/* Zoom hint */}
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(250,247,242,0.85)", backdropFilter: "blur(4px)", borderRadius: "8px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
                </svg>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>Zoom</span>
              </div>
            </div>

            {/* Trust strip below image */}
            <div style={{ marginTop: "24px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { icon: <ShieldIcon />, text: "1-Year Warranty" },
                { icon: <TruckIcon />, text: "Free delivery above ₹999" },
                { icon: <ReturnIcon />, text: "7-Day Returns" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(110,100,89,0.08)", borderRadius: "10px", flex: "1 1 140px" }}>
                  {item.icon}
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div
            className="info-col"
            style={{ width: "45%", paddingTop: "8px", paddingBottom: "96px" }}
          >
            {/* Eyebrow */}
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-body)" }}>
              Premium Audio · Precision Engineered
            </p>

            {/* Product Title */}
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginBottom: "20px" }}>
              {displayName}
            </h1>

            {/* Rating Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= 5} />)}
              </div>
              <span style={{ fontSize: "0.8125rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>4.8 · 1,247 reviews</span>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--muted)", opacity: 0.5, display: "inline-block" }} />
              <span style={{ fontSize: "0.8125rem", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 500 }}>250,000+ sold</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "28px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "2rem", color: "var(--text)", letterSpacing: "-0.02em" }}>
                ₹{(displayPrice * quantity).toLocaleString("en-IN")}
              </span>
              {quantity > 1 && (
                <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                  (₹{displayPrice.toLocaleString("en-IN")} × {quantity})
                </span>
              )}
              <span style={{ fontSize: "0.75rem", background: "rgba(188,147,71,0.12)", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "6px" }}>
                In Stock
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "36px", maxWidth: "480px" }}>
              {displayDescription}
            </p>

            <div style={{ width: "48px", height: "1px", background: "rgba(168,152,128,0.3)", marginBottom: "36px" }} />

            {/* Finish Selector */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "14px" }}>
                Finish — <span style={{ textTransform: "none", letterSpacing: "normal", fontWeight: 400, color: "var(--text)" }}>{selectedFinish.label}</span>
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {finishOptions.map(f => (
                  <button
                    key={f.label}
                    onClick={() => setSelectedFinish(f)}
                    title={f.label}
                    style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: f.color,
                      border: selectedFinish.label === f.label ? "3px solid var(--accent)" : "2px solid rgba(168,152,128,0.3)",
                      boxShadow: selectedFinish.label === f.label ? "0 0 0 2px var(--bg), 0 0 0 4px var(--accent)" : "0 2px 8px rgba(59,59,59,0.1)",
                      cursor: "pointer",
                      transition: "box-shadow 0.18s ease, border-color 0.18s ease",
                      padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    aria-pressed={selectedFinish.label === f.label}
                  >
                    {selectedFinish.label === f.label && (
                      <span style={{ color: f.label === "Arctic White" ? "#666" : "#fff" }}><CheckIcon /></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Cable Length */}
            <div style={{ marginBottom: "36px" }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "14px" }}>
                Cable Length
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {cableOptions.map(opt => (
                  <button
                    key={opt}
                    className="variant-pill"
                    onClick={() => setSelectedCable(opt)}
                    style={{
                      padding: "0 22px", height: "38px", borderRadius: "9999px",
                      background: selectedCable === opt ? "var(--primary)" : "rgba(250,247,242,0.9)",
                      color: selectedCable === opt ? "#FAF7F2" : "var(--muted)",
                      fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: selectedCable === opt ? 600 : 400,
                      border: selectedCable === opt ? "1.5px solid var(--primary)" : "1.5px solid rgba(168,152,128,0.35)",
                    }}
                    aria-pressed={selectedCable === opt}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: "36px" }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "14px" }}>
                Quantity
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid rgba(168,152,128,0.35)", borderRadius: "10px", overflow: "hidden" }}>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: "44px", height: "44px", background: "transparent", border: "none", color: "var(--text)", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span style={{ width: "52px", textAlign: "center", fontSize: "1rem", fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                  {quantity}
                </span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: "44px", height: "44px", background: "transparent", border: "none", color: "var(--text)", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons — hidden on mobile */}
            <div className="desktop-cta-row" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <button
                className="add-cart-btn"
                onClick={handleAddToCart}
                style={{
                  width: "100%", height: "58px", borderRadius: "12px",
                  background: addedState === "added" ? "#3A3A3A" : "var(--primary)",
                  color: "#FAF7F2",
                  fontSize: "1rem", fontFamily: "var(--font-body)", fontWeight: 600,
                  border: "none",
                  letterSpacing: "0.01em",
                  boxShadow: "0 8px 24px -8px rgba(59,59,59,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                {addedState === "added" ? (
                  <><CheckIcon /><span>Added to Bag</span></>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>

              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
                style={{
                  width: "100%", height: "58px", borderRadius: "12px",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: "1rem", fontFamily: "var(--font-body)", fontWeight: 600,
                  border: "2px solid var(--primary)",
                  letterSpacing: "0.01em",
                }}
              >
                {buyNowState === "added" ? "Redirecting..." : "Buy Now"}
              </button>
            </div>

            {/* Feature Highlights */}
            <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "Precisely tuned acoustic drivers for natural sound reproduction",
                "Inline remote with volume control and call answer",
                "Ergonomic form — stays seated without adjustment",
                "Compatible with all 3.5mm audio devices",
              ].map((feat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(188,147,71,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{feat}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: "1px", background: "rgba(168,152,128,0.2)", margin: "40px 0" }} />

            {/* Specifications */}
            <div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "1.375rem", letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "24px" }}>
                Technical Specifications
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { label: "Driver Type", value: "Dynamic, 14mm" },
                  { label: "Frequency Response", value: "20Hz – 20kHz" },
                  { label: "Impedance", value: "32Ω" },
                  { label: "Connector", value: "3.5mm TRS" },
                  { label: "Cable Length", value: selectedCable === "1.2m Standard" ? "1.2 metres" : "1.5 metres" },
                  { label: "Finish", value: selectedFinish.label },
                  { label: "Weight", value: "20g" },
                  { label: "In the Box", value: "EarPods, Documentation" },
                ].map((spec, i, arr) => (
                  <div
                    key={spec.label}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(168,152,128,0.15)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 400 }}>{spec.label}</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reveal" style={{ background: "rgba(110,100,89,0.04)", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "56px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
                Customer Voices
              </p>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
                What audiophiles say.
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                {[1,2,3,4,5].map(s => <StarIcon key={s} filled={true} />)}
              </div>
              <span style={{ fontSize: "1.25rem", fontFamily: "var(--font-heading)", fontWeight: 500, color: "var(--text)" }}>4.8</span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>from 1,247 reviews</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {reviews.map((r, i) => (
              <article
                key={i}
                className="review-card"
                style={{
                  background: "var(--bg)", borderRadius: "16px",
                  padding: "28px 28px 24px",
                  boxShadow: "0 4px 16px -4px rgba(59,59,59,0.08)",
                  border: "1px solid rgba(168,152,128,0.15)",
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
                  {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= r.rating} />)}
                </div>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "20px", fontStyle: "italic" }}>
                  "{r.text}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", fontFamily: "var(--font-body)" }}>{r.name}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{r.date}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* You Might Also Like */}
      <section className="reveal" style={{ padding: "96px 48px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
              Continue Exploring
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
              You might also like.
            </h2>
          </div>

          <div
            ref={carouselRef}
            className="no-scrollbar"
            onMouseDown={handleCarouselMouseDown}
            onMouseMove={handleCarouselMouseMove}
            onMouseUp={handleCarouselMouseUp}
            onMouseLeave={handleCarouselMouseUp}
            style={{
              display: "flex", gap: "24px",
              overflowX: "auto", paddingBottom: "16px",
              cursor: "grab", userSelect: "none",
              scrollSnapType: "x mandatory",
            }}
          >
            {recommendedProducts.map((p) => (
              <article
                key={p.id}
                className="rec-card"
                tabIndex={0}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                onKeyDown={e => { if (e.key === "Enter") router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`); }}
                style={{
                  flexShrink: 0, width: "clamp(220px, 25vw, 300px)",
                  scrollSnapAlign: "start",
                  boxShadow: "0 4px 20px -8px rgba(59,59,59,0.1)",
                  borderRadius: "16px", overflow: "hidden",
                  background: "var(--bg)",
                  border: "1px solid rgba(168,152,128,0.15)",
                }}
              >
                <div style={{ overflow: "hidden", background: "#F4F1EC", height: "220px" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.6s ease", padding: "16px" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "1.0625rem", letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "6px", lineHeight: 1.3 }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.description}
                  </p>
                  <span style={{ fontSize: "1rem", fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--accent)" }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar */}
      <div
        className="mobile-sticky-bar"
        style={{
          display: "none",
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "14px 20px 20px",
          background: "var(--bg)",
          borderTop: "1px solid rgba(168,152,128,0.25)",
          alignItems: "center", justifyContent: "space-between", gap: "12px",
          zIndex: 50, boxShadow: "0 -8px 30px -4px rgba(59,59,59,0.1)",
        }}
      >
        <div>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.5rem", color: "var(--text)", letterSpacing: "-0.02em" }}>
            ₹{computedPrice.toLocaleString("en-IN")}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)", display: "block" }}>
            Qty: {quantity}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            flex: 1, maxWidth: "200px", height: "50px", borderRadius: "12px",
            background: addedState === "added" ? "#3A3A3A" : "var(--primary)",
            color: "#FAF7F2",
            fontSize: "0.9375rem", fontFamily: "var(--font-body)", fontWeight: 600,
            border: "none", cursor: "pointer",
            transition: "transform 0.15s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
        >
          {addedState === "added" ? <><CheckIcon /> Added</> : "Add to Cart"}
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: "24px", right: "24px",
              background: "rgba(250,247,242,0.12)", border: "1px solid rgba(250,247,242,0.2)",
              borderRadius: "50%", width: "44px", height: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#FAF7F2",
            }}
            aria-label="Close lightbox"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#F4F1EC", borderRadius: "20px",
              maxWidth: "min(600px, 90vw)", maxHeight: "80vh",
              padding: "32px", overflow: "hidden",
            }}
          >
            <img
              src={displayImg}
              alt={`${displayName} — full view`}
              style={{ width: "100%", height: "auto", maxHeight: "70vh", objectFit: "contain", display: "block" }}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}