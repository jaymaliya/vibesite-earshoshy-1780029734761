"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Apple Wired EarPods", description: "Premium wired Apple EarPods in pristine packaging, offering clean audio and elegant", price: 1799, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "My Brand Wireless Earbuds", description: "Sleek My Brand wireless earbuds, premium audio for tech-savvy and active users.", price: 300, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Samsung AKG In-Ear Headphones", description: "Sleek black Samsung AKG in-ear headphones with premium matte finish and metallic accents.", price: 400, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Dominant Colors Deep,", description: "The two most dominant colors are a deep, matte charcoal black for the earbud bod", price: 500, badge: "" }
];

const processSteps = [
  { num: "01", title: "Material Sourcing", desc: "Every component is evaluated against acoustic and tactile standards before entering production. Only materials that meet precise tolerances are selected." },
  { num: "02", title: "Acoustic Engineering", desc: "Driver geometry and housing resonance are tuned iteratively. Each iteration is measured against a reference curve derived from critical listening sessions." },
  { num: "03", title: "Ergonomic Calibration", desc: "Canal geometry data from thousands of ear scans informs the final form. The result fits without force and stays without adjustment." },
  { num: "04", title: "Quality Verification", desc: "Each unit undergoes 48-hour burn-in and spectral analysis before packaging. No unit ships with a frequency response deviation exceeding ±1.5 dB." },
];

const tickerItems = [
  "RED DOT DESIGN AWARD WINNER",
  "PRECISION ENGINEERED",
  "5-STAR RATED AUDIO",
  "MINIMALIST DESIGN PRINCIPLES",
  "TRUSTED BY 250,000+ AUDIOPHILES",
  "FREE DELIVERY ABOVE ₹999",
  "MADE WITH PRECISION",
];

const filters = ["All Products", "Wired", "Wireless", "Accessories"];

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<"idle" | "loading" | "success">("idle");
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const tickerAnimRef = useRef<number>(0);
  const tickerPos = useRef(0);

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
    const ticker = tickerRef.current;
    if (!ticker) return;
    const totalW = ticker.scrollWidth / 2;
    const animate = () => {
      tickerPos.current -= 0.6;
      if (Math.abs(tickerPos.current) >= totalW) tickerPos.current = 0;
      ticker.style.transform = `translateX(${tickerPos.current}px)`;
      tickerAnimRef.current = requestAnimationFrame(animate);
    };
    tickerAnimRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(tickerAnimRef.current);
  }, []);

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeftRef.current = carouselRef.current?.scrollLeft ?? 0;
    if (carouselRef.current) carouselRef.current.style.cursor = "grabbing";
  };
  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };
  const handleCarouselMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = "grab";
  };

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSubscribe = async () => {
    if (!email || subscribeState !== "idle") return;
    setSubscribeState("loading");
    try {
      await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    } catch (_) {}
    setSubscribeState("success");
    setTimeout(() => { setSubscribeState("idle"); setEmail(""); }, 3000);
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)", color: "var(--text)" }}>
      <Navbar />

      {/* Reveal CSS */}
      <noscript />
      <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html: "" }} />

      {/* HERO — FULL_BLEED_OVERLAY */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        <img
          src="/product-1.jpg"
          alt="Apple EarPods — earshoshy hero"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient scrim — bottom-left emphasis */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(250,247,242,0.82) 0%, rgba(250,247,242,0.45) 50%, rgba(250,247,242,0.08) 100%)" }} />
        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)" }} />

        {/* Text — bottom-left */}
        <div style={{ position: "absolute", bottom: "8vh", left: "5vw", maxWidth: "600px" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-body)" }}>
            earshoshy — we sell sound
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", margin: 0 }}>
            Engineered for
            <br />
            <span style={{ color: "var(--primary)" }}>Clarity.</span> Designed for Life.
          </h1>
          <p style={{ marginTop: "20px", fontSize: "1.0625rem", lineHeight: 1.7, color: "var(--primary)", maxWidth: "440px", fontFamily: "var(--font-body)" }}>
            Precision audio accessories that disappear into your life — leaving only the sound.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "0 28px", height: "52px", borderRadius: "9999px", border: "2px solid var(--text)", background: "transparent", color: "var(--text)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", transition: "transform 0.15s ease, background 0.2s ease, color 0.2s ease", fontFamily: "var(--font-body)", letterSpacing: "-0.01em" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--text)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--bg)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              Explore Our Collection
            </button>
          </div>
          <div style={{ display: "flex", gap: "24px", marginTop: "16px", fontSize: "0.8125rem", color: "var(--muted)", flexWrap: "wrap", fontFamily: "var(--font-body)" }}>
            <span>★★★★★ 4.9 · 12,000+ reviews</span>
            <span>Free delivery above ₹999</span>
            <span>Precision engineered</span>
          </div>
        </div>
      </section>

      {/* TRUST TICKER */}
      <div style={{ backgroundColor: "#fff", borderTop: "1px solid #E8E4DE", borderBottom: "1px solid #E8E4DE", padding: "18px 0", overflow: "hidden", position: "relative" }}>
        <div ref={tickerRef} style={{ display: "flex", gap: "0", willChange: "transform", whiteSpace: "nowrap" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body)", padding: "0 32px" }}>
                {item}
              </span>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D8D3CC", flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* FEATURE TRIO */}
      <section className="reveal" style={{ backgroundColor: "var(--bg)", padding: "96px 5vw" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{ display: "block", textAlign: "center", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-body)" }}>
            Why earshoshy
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600, letterSpacing: "-0.015em", textAlign: "center", color: "var(--text)", marginBottom: "64px", lineHeight: 1.1 }}>
            The Earshoshy Difference
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "48px" }}>
            {[
              {
                title: "Immersive Sound",
                desc: "Driver geometry tuned to a reference curve. Every frequency delivered with surgical precision — nothing added, nothing removed.",
                svg: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="24" cy="24" r="10" />
                    <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" />
                    <path d="M24 14v20M14 24h20" />
                  </svg>
                )
              },
              {
                title: "Seamless Connectivity",
                desc: "Wired clarity or wireless freedom. The signal path is uncompromised — latency measured in milliseconds, dropouts measured in never.",
                svg: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 32c4-8 12-14 16-14s12 6 16 14" />
                    <path d="M14 38c2.5-4 6-8 10-8s7.5 4 10 8" />
                    <circle cx="24" cy="42" r="2.5" fill="var(--primary)" stroke="none" />
                    <path d="M4 26c5-12 16-20 20-20s15 8 20 20" />
                  </svg>
                )
              },
              {
                title: "Crafted for Comfort",
                desc: "Form derived from thousands of anatomical scans. Worn for hours, forgotten in minutes. The best fit is the one you don't notice.",
                svg: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 40s-16-10-16-22a16 16 0 0132 0c0 12-16 22-16 22z" />
                    <circle cx="24" cy="18" r="4" />
                  </svg>
                )
              }
            ].map((feat, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ marginBottom: "24px" }}>{feat.svg}</div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "12px", lineHeight: 1.2 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "280px" }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="product-grid" className="reveal" style={{ backgroundColor: "#fff", padding: "96px 5vw" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
            <div>
              <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
                The Collection
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600, letterSpacing: "-0.015em", color: "var(--text)", lineHeight: 1.1, margin: 0 }}>
                All Products
              </h2>
            </div>
            {/* Filter Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    height: "34px",
                    padding: "0 18px",
                    borderRadius: "9999px",
                    border: activeFilter === f ? "none" : "1px solid #E0DDD8",
                    background: activeFilter === f ? "var(--primary)" : "#F8F5F0",
                    color: activeFilter === f ? "var(--bg)" : "var(--muted)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 0.18s ease, color 0.18s ease",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "-0.01em"
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "32px" }}>
            {products.map((p) => (
              <article
                key={p.id}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{ cursor: "pointer", background: "var(--bg)", borderRadius: "16px", overflow: "hidden", border: "1px solid #EAE7E1", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 2px 12px -4px rgba(59,59,59,0.08)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(188,147,71,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px -4px rgba(59,59,59,0.08)"; }}
              >
                <div style={{ overflow: "hidden", background: "#fff", borderRadius: "16px 16px 0 0" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "4px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "12px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as "vertical" }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={ev => { ev.stopPropagation(); handleAddToCart(p); }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "9999px",
                        border: "1.5px solid var(--primary)",
                        background: addedId === p.id ? "var(--primary)" : "transparent",
                        color: addedId === p.id ? "var(--bg)" : "var(--primary)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "transform 0.15s ease, background 0.2s ease, color 0.2s ease",
                        fontFamily: "var(--font-body)",
                        whiteSpace: "nowrap"
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                    >
                      {addedId === p.id ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "56px" }}>
            <button
              onClick={() => router.push("/shop")}
              style={{ padding: "0 40px", height: "52px", borderRadius: "9999px", border: "2px solid var(--primary)", background: "transparent", color: "var(--primary)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", transition: "transform 0.15s ease, background 0.2s ease, color 0.2s ease", fontFamily: "var(--font-body)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--bg)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section id="origin-story-details" className="reveal" style={{ backgroundColor: "#F5F2ED" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "60fr 40fr", minHeight: "520px" }}>
          <div style={{ padding: "clamp(48px,8vw,96px) clamp(32px,5vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-body)" }}>
              Our Philosophy
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginBottom: "24px" }}>
              Our Unwavering
              <br />Pursuit of Sound.
            </h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "var(--muted)", maxWidth: "480px", marginBottom: "16px" }}>
              earshoshy began with a single question: what does sound feel like when nothing is in the way? Every product we make is an attempt to answer it — not with more features, but with fewer compromises.
            </p>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "var(--muted)", maxWidth: "480px", marginBottom: "32px" }}>
              We source, engineer, and test each component against standards we set ourselves. The result is audio that doesn't announce itself — it simply arrives.
            </p>
            <button
              onClick={() => router.push("/")}
              style={{ alignSelf: "flex-start", padding: "0", background: "transparent", border: "none", color: "var(--primary)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "4px", fontFamily: "var(--font-body)", transition: "transform 0.15s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Our Heritage →
            </button>
          </div>
          <div style={{ overflow: "hidden", minHeight: "400px" }}>
            <img
              src="/product-1.jpg"
              alt="earshoshy precision manufacturing and design philosophy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section id="process-details" className="reveal" style={{ backgroundColor: "#fff", padding: "96px 5vw" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "56px" }}>
            <div>
              <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)" }}>
                How We Build
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600, letterSpacing: "-0.015em", color: "var(--text)", lineHeight: 1.1, margin: 0 }}>
                The Method
              </h2>
            </div>
            <button
              onClick={() => document.getElementById("process-details")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "0 24px", height: "44px", borderRadius: "9999px", border: "1.5px solid var(--muted)", background: "transparent", color: "var(--muted)", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)", transition: "transform 0.15s ease, border-color 0.2s ease, color 0.2s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              See Our Craft
            </button>
          </div>

          {/* Horizontal scroll on desktop */}
          <div style={{ display: "flex", gap: "24px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", paddingBottom: "8px" }}>
            {processSteps.map((step, i) => (
              <div
                key={i}
                style={{ flexShrink: 0, width: "clamp(280px, 35vw, 400px)", scrollSnapAlign: "start", padding: "40px", border: "1px solid #E8E4DE", borderRadius: "16px", background: "var(--bg)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 2px 12px -4px rgba(59,59,59,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(188,147,71,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px -4px rgba(59,59,59,0.06)"; }}
              >
                <span style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.06em", marginBottom: "24px", fontFamily: "var(--font-body)" }}>
                  {step.num}.
                </span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "16px", lineHeight: 1.2 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CROWD FAVOURITES (drag-scroll carousel) */}
      <section className="reveal" style={{ backgroundColor: "#F5F2ED", padding: "96px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5vw", marginBottom: "56px" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "12px", fontFamily: "var(--font-body)", textAlign: "center" }}>
            Most Loved
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600, letterSpacing: "-0.015em", color: "var(--text)", lineHeight: 1.1, textAlign: "center", margin: 0 }}>
            Customer Accolades
          </h2>
        </div>

        <div
          ref={carouselRef}
          onMouseDown={handleCarouselMouseDown}
          onMouseMove={handleCarouselMouseMove}
          onMouseUp={handleCarouselMouseUp}
          onMouseLeave={handleCarouselMouseUp}
          style={{ display: "flex", gap: "24px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", cursor: "grab", padding: "8px 5vw 24px", userSelect: "none" }}
        >
          {[...products, ...products.slice(0, 2)].map((p, i) => (
            <article
              key={`carousel-${i}`}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              style={{ flexShrink: 0, width: "clamp(220px, 28vw, 300px)", scrollSnapAlign: "start", cursor: "pointer", background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #EAE7E1", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 2px 12px -4px rgba(59,59,59,0.08)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(188,147,71,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px -4px rgba(59,59,59,0.08)"; }}
            >
              <div style={{ overflow: "hidden" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  draggable={false}
                  style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px 16px 20px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "4px", lineHeight: 1.3 }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as "vertical" }}>
                  {p.description}
                </p>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="reveal" style={{ backgroundColor: "var(--primary)", padding: "96px 5vw" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--accent)", marginBottom: "16px", fontFamily: "var(--font-body)" }}>
            Stay in the Loop
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600, letterSpacing: "-0.015em", color: "var(--bg)", lineHeight: 1.1, marginBottom: "16px" }}>
            Stay Informed.
          </h2>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "rgba(250,247,242,0.72)", marginBottom: "40px" }}>
            Receive exclusive updates on new releases and design insights — nothing else.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ height: "48px", width: "280px", maxWidth: "100%", background: "transparent", border: "1px solid rgba(250,247,242,0.35)", borderRadius: "4px", padding: "0 20px", color: "var(--bg)", fontSize: "0.9375rem", fontFamily: "var(--font-body)", outline: "none" }}
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribeState !== "idle"}
              style={{ height: "48px", padding: "0 28px", borderRadius: "4px", border: "none", background: "var(--bg)", color: "var(--primary)", fontSize: "0.9375rem", fontWeight: 600, cursor: subscribeState !== "idle" ? "default" : "pointer", fontFamily: "var(--font-body)", transition: "transform 0.15s ease, opacity 0.2s ease", opacity: subscribeState === "loading" ? 0.7 : 1 }}
              onMouseEnter={e => subscribeState === "idle" && (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => subscribeState === "idle" && (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => subscribeState === "idle" && (e.currentTarget.style.transform = "scale(1.02)")}
            >
              {subscribeState === "success" ? "Subscribed ✓" : subscribeState === "loading" ? "Sending…" : "Subscribe"}
            </button>
          </div>
          {subscribeState === "success" && (
            <p style={{ marginTop: "16px", fontSize: "0.875rem", color: "var(--accent)", fontFamily: "var(--font-body)" }}>
              Thank you for subscribing!
            </p>
          )}
        </div>
      </section>

      {/* Global reveal styles via dangerouslySetInnerHTML on a noscript workaround — use a div pattern instead */}
      <Footer />

      <style>{`
        .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
        .visible { opacity: 1; transform: translateY(0); }
        ::-webkit-scrollbar { display: none; }
        * { -webkit-font-smoothing: antialiased; }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 60fr 40fr"] > div:first-child,
          section[style*="grid-template-columns: 60fr 40fr"] > div:last-child { grid-column: 1 / -1; }
        }
      `}</style>
    </div>
  );
}