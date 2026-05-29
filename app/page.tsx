"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Apple Wired EarPods", description: "Premium wired Apple EarPods in pristine packaging, offering clean audio and elegant design.", price: 1799 },
  { id: 2, img: "/product-2.jpg", name: "My Brand Wireless Earbuds", description: "Sleek My Brand wireless earbuds, premium audio for tech-savvy and active users.", price: 300 },
  { id: 3, img: "/product-3.jpg", name: "Samsung AKG In-Ear Headphones", description: "Sleek black Samsung AKG in-ear headphones with premium matte finish and metallic accents.", price: 400 },
  { id: 4, img: "/product-4.jpg", name: "Dominant Colors Deep,", description: "The two most dominant colors are a deep, matte charcoal black for the earbud bod", price: 500 },
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

export default function HomePage() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<"idle" | "loading" | "success">("idle");
  const [addedId, setAddedId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Scroll-reveal
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

  // Nav scroll transparency
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = "grab";
  };

  const handleAddItem = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSubscribe = async () => {
    if (!email) return;
    setSubscribeState("loading");
    try {
      await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    } catch (_) {}
    setSubscribeState("success");
    setTimeout(() => setSubscribeState("idle"), 3000);
    setEmail("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        :root {
          --bg: #FAF7F2;
          --surface: #6E6459;
          --primary: #3B3B3B;
          --accent: #BC9347;
          --text: #1A1A1A;
          --muted: #A89880;
          --font-heading: 'Fraunces', Georgia, serif;
          --font-body: 'DM Sans', sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
        .will-reveal { opacity: 0; transform: translateY(24px); }
        .visible { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-child:nth-child(1) { transition-delay: 0ms; }
        .reveal-child:nth-child(2) { transition-delay: 80ms; }
        .reveal-child:nth-child(3) { transition-delay: 160ms; }
        .reveal-child:nth-child(4) { transition-delay: 240ms; }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker-scroll 28s linear infinite; }
        .process-scroll { overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; }
        .process-scroll::-webkit-scrollbar { display: none; }
        .mobile-nav { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg); z-index: 200; transform: translateX(-100%); transition: transform 300ms ease-out; }
        .mobile-nav.open { transform: translateX(0); }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
        input:focus { outline: 2px solid var(--accent); outline-offset: 2px; }
        button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      `}</style>

      {/* CUSTOM NAVBAR (transparent over hero) */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: navScrolled ? "var(--bg)" : "transparent",
        borderBottom: navScrolled ? "1px solid rgba(164,152,128,0.3)" : "none",
        transition: "background-color 250ms ease-in-out, border-bottom 250ms ease-in-out",
        padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
        fontFamily: "var(--font-body)",
      }}>
        {/* Logo */}
        <div style={{ cursor: "pointer", padding: "4px 8px", borderRadius: "8px", background: navScrolled ? "transparent" : "rgba(255,255,255,0.12)" }}
          onClick={() => router.push("/")}>
          <img src="/logo.png" alt="earshoshy logo" style={{ height: "40px", objectFit: "contain" }} />
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-only" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {["Shop", "Our Story"].map(link => (
            <button key={link}
              onClick={() => link === "Shop" ? router.push("/shop") : document.getElementById("origin-story")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em",
                color: navScrolled ? "var(--text)" : "#FAF7F2",
                padding: "0 20px", height: "72px",
                fontFamily: "var(--font-body)",
                transition: "color 250ms ease",
              }}>
              {link}
            </button>
          ))}
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "15px", fontWeight: 500, letterSpacing: "-0.01em",
              color: navScrolled ? "var(--text)" : "#FAF7F2",
              padding: "0 20px", height: "72px",
              fontFamily: "var(--font-body)",
              transition: "color 250ms ease",
            }}>
            Support
          </button>
        </nav>

        {/* Cart + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={navScrolled ? "var(--text)" : "#FAF7F2"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: "2px", right: "2px", width: "18px", height: "18px", borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)" }}>
                {totalItems}
              </span>
            )}
          </button>
          {/* Hamburger mobile */}
          <button className="mobile-only" onClick={() => setMobileNavOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}>
            <svg width="22" height="20" viewBox="0 0 22 20" fill="none" stroke={navScrolled ? "var(--text)" : "#FAF7F2"} strokeWidth="1.8" strokeLinecap="round">
              <line x1="0" y1="3" x2="22" y2="3"/><line x1="0" y1="10" x2="22" y2="10"/><line x1="0" y1="17" x2="22" y2="17"/>
            </svg>
          </button>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav${mobileNavOpen ? " open" : ""}`}>
        <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src="/logo.png" alt="earshoshy" style={{ height: "36px", objectFit: "contain" }} />
          <button onClick={() => setMobileNavOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="19" y2="19"/><line x1="19" y1="1" x2="1" y2="19"/>
            </svg>
          </button>
        </div>
        <nav style={{ padding: "40px 32px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "Shop", action: () => { setMobileNavOpen(false); router.push("/shop"); } },
            { label: "Our Story", action: () => { setMobileNavOpen(false); document.getElementById("origin-story")?.scrollIntoView({ behavior: "smooth" }); } },
            { label: "Support", action: () => { setMobileNavOpen(false); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); } },
            { label: "Account", action: () => { setMobileNavOpen(false); } },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "clamp(2rem, 8vw, 2.5rem)", fontWeight: 500, fontFamily: "var(--font-heading)", color: "var(--text)", padding: "12px 0", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ═══════════════════════════════════════════
          HERO — FULL_BLEED_OVERLAY
      ═══════════════════════════════════════════ */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        {/* Full-bleed product image */}
        <img
          src="/product-1.jpg"
          alt="Apple Wired EarPods — pristine packaging on off-white surface"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Subtle gradient scrim — bottom-left focus */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,26,26,0.55) 0%, rgba(26,26,26,0.18) 50%, rgba(26,26,26,0.04) 100%)" }} />
        {/* Radial lift behind product center */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 60% 45%, rgba(250,247,242,0.12) 0%, transparent 70%)" }} />

        {/* Overlaid text — lower left */}
        <div style={{ position: "absolute", bottom: "8vh", left: "5vw", maxWidth: "min(640px, 90vw)", display: "flex", flexDirection: "column", gap: "24px" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "rgba(250,247,242,0.7)", fontFamily: "var(--font-body)" }}>
            Earshoshy — We Sell Sound
          </span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#FAF7F2" }}>
            Engineered for<br />Clarity. Designed<br />for Life.
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.65, color: "rgba(250,247,242,0.8)", maxWidth: "420px", fontFamily: "var(--font-body)", fontWeight: 400 }}>
            Precision audio hardware. No excess. Every component chosen for acoustic integrity and tactile restraint.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FAF7F2"; (e.currentTarget as HTMLButtonElement).style.color = "#1A1A1A"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#FAF7F2"; }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ padding: "0 40px", height: "52px", background: "transparent", border: "2px solid #FAF7F2", borderRadius: "9999px", color: "#FAF7F2", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", letterSpacing: "0.01em", transition: "background 200ms ease, color 200ms ease, transform 150ms ease" }}>
              Explore Our Collection
            </button>
            {/* Trust signals */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "13px", color: "rgba(250,247,242,0.65)", fontFamily: "var(--font-body)", fontWeight: 400 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#BC9347" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                4.9 · 12,400+ reviews
              </span>
              <span>Free delivery above ₹999</span>
              <span>Trusted by 250,000+ audiophiles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE TRIO
      ═══════════════════════════════════════════ */}
      <section className="reveal" style={{ backgroundColor: "var(--bg)", padding: "120px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span style={{ display: "block", textAlign: "center", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "16px" }}>
            Why earshoshy
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", textAlign: "center", marginBottom: "72px" }}>
            Three principles. Zero compromise.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "48px" }}>
            {[
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="24" cy="24" r="18"/><path d="M16 24c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8"/><circle cx="24" cy="24" r="3"/>
                  </svg>
                ),
                title: "Immersive Audio",
                desc: "Driver geometry tuned against ISO 226:2003 equal-loudness contours. You hear exactly what was recorded — nothing added, nothing removed.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M24 8c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16"/><path d="M32 8l8 0 0 8"/><path d="M40 8L28 20"/>
                  </svg>
                ),
                title: "Seamless Connectivity",
                desc: "Engineered plug geometry ensures full signal contact across 3.5mm and USB-C interfaces. No adapters needed. No signal loss tolerated.",
              },
              {
                icon: (
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="24" cy="20" rx="10" ry="14"/><path d="M12 32c0 6.6 5.4 12 12 12s12-5.4 12-12"/><line x1="24" y1="44" x2="24" y2="40"/>
                  </svg>
                ),
                title: "Engineered Comfort",
                desc: "Canal geometry derived from scan data across 4,000 ear profiles. The fit is stable at rest and under movement — designed to disappear.",
              },
            ].map((feat, i) => (
              <div key={i} className="reveal-child" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0px", textAlign: "center" }}>
                <div style={{ marginBottom: "24px" }}>{feat.icon}</div>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "12px" }}>{feat.title}</h3>
                <p style={{ fontSize: "16px", lineHeight: 1.65, color: "var(--muted)", maxWidth: "300px", fontFamily: "var(--font-body)" }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRODUCT GRID — VISUAL FINGERPRINT
          Scroll-triggered subtle product animation on hover
      ═══════════════════════════════════════════ */}
      <section className="reveal" style={{ backgroundColor: "var(--bg)", padding: "0 48px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "12px" }}>
                Full Catalogue
              </span>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
                Every instrument,<br />precisely catalogued.
              </h2>
            </div>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ background: "none", border: "1.5px solid var(--primary)", borderRadius: "9999px", padding: "12px 32px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--text)", cursor: "pointer", letterSpacing: "0.01em", transition: "transform 150ms ease" }}>
              View All Products
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "32px" }}>
            {products.map((p, i) => (
              <article
                key={p.id}
                className="reveal-child"
                style={{ cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", borderRadius: "16px", background: "rgba(255,255,255,0.6)", boxShadow: "0 1px 6px rgba(59,59,59,0.06)" }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(188,147,71,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(59,59,59,0.06)"; }}>
                <div style={{ overflow: "hidden", borderRadius: "12px 12px 0 0", background: "#FFFFFF" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.6s ease", display: "block" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px 20px 20px" }}>
                  <h3 style={{ fontFamily: "var(--font-body)", fontSize: "17px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "4px" }}>{p.name}</h3>
                  <p style={{ fontSize: "13px", fontFamily: "var(--font-body)", color: "var(--muted)", lineHeight: 1.5, marginBottom: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-body)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    <button
                      onClick={ev => { ev.stopPropagation(); handleAddItem(p); }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      style={{ background: addedId === p.id ? "#3A3A3A" : "var(--primary)", color: "#FAF7F2", border: "none", borderRadius: "9999px", padding: "8px 18px", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", transition: "background 200ms ease, transform 150ms ease", whiteSpace: "nowrap" }}>
                      {addedId === p.id ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ORIGIN STORY — VISUAL FINGERPRINT: editorial split
          60% text / 40% image, product-1 image right
      ═══════════════════════════════════════════ */}
      <section id="origin-story" className="reveal" style={{ backgroundColor: "#F2EDE6", padding: "0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "60fr 40fr", minHeight: "560px" }}>
          {/* Text column */}
          <div style={{ padding: "96px 80px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              Our Philosophy
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", maxWidth: "560px" }}>
              Our Unwavering<br />Pursuit of Sound.
            </h2>
            <p style={{ fontSize: "18px", lineHeight: 1.75, color: "var(--muted)", maxWidth: "520px", fontFamily: "var(--font-body)", fontWeight: 400 }}>
              earshoshy was not founded on the premise of making audio affordable. It was founded on the premise that most audio is insufficient. We source components with the same criteria an acoustics laboratory applies — measurement first, marketing never.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", maxWidth: "500px", fontFamily: "var(--font-body)", fontWeight: 400 }}>
              Every product in our catalogue has passed a 48-hour listening panel before its specifications were finalised. If it did not earn its place in silence, it did not earn a name.
            </p>
            <button
              id="origin-story-details"
              onClick={() => document.getElementById("origin-story-details")?.scrollIntoView({ behavior: "smooth" })}
              style={{ alignSelf: "flex-start", background: "none", border: "none", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--text)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "4px", padding: "0", letterSpacing: "0.01em" }}>
              Our Heritage
            </button>
          </div>
          {/* Image column */}
          <div style={{ overflow: "hidden", minHeight: "480px" }}>
            <img
              src="/product-1.jpg"
              alt="earshoshy product — precision engineering process"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROCESS STEPS — horizontal scroll
      ═══════════════════════════════════════════ */}
      <section id="process-details" className="reveal" style={{ backgroundColor: "var(--bg)", padding: "120px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "16px" }}>
            The Method
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)" }}>
              Four steps.<br />No shortcuts.
            </h2>
            <button
              onClick={() => document.getElementById("process-details")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "none", border: "none", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--accent)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", padding: "0" }}>
              See Our Craft
            </button>
          </div>
        </div>
        <div
          className="process-scroll"
          style={{ display: "flex", gap: "24px", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "16px" }}>
          {processSteps.map((step, i) => (
            <div
              key={i}
              style={{ flex: "0 0 360px", padding: "40px", border: "1px solid rgba(164,152,128,0.3)", borderRadius: "16px", background: "#FFFFFF", scrollSnapAlign: "start", transition: "box-shadow 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 40px -8px rgba(188,147,71,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", letterSpacing: "0.08em", marginBottom: "24px" }}>{step.num}.</div>
              <h3 style={{ fontFamily: "var(--font-body)", fontSize: "22px", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "16px" }}>{step.title}</h3>
              <p style={{ fontSize: "15px", lineHeight: 1.65, color: "var(--muted)", fontFamily: "var(--font-body)" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CROWD FAVOURITES — drag-scroll carousel
      ═══════════════════════════════════════════ */}
      <section className="reveal" style={{ backgroundColor: "#F0EBE3", padding: "120px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px", marginBottom: "56px" }}>
          <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "16px", textAlign: "center" }}>
            Most Acclaimed
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", textAlign: "center" }}>
            Customer Accolades
          </h2>
        </div>
        <div
          ref={carouselRef}
          className="process-scroll"
          style={{ display: "flex", gap: "32px", paddingLeft: "48px", paddingRight: "48px", paddingBottom: "8px", cursor: "grab", userSelect: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}>
          {[...products, ...products.slice(0, 2)].map((p, i) => (
            <div
              key={`fav-${i}`}
              style={{ flex: "0 0 260px", cursor: "pointer", background: "#FFFFFF", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 6px rgba(59,59,59,0.06)", transition: "transform 0.3s ease, box-shadow 0.3s ease", scrollSnapAlign: "start" }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(188,147,71,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(59,59,59,0.06)"; }}>
              <div style={{ overflow: "hidden", background: "#FFFFFF" }}>
                <img
                  src={p.img}
                  alt={p.name}
                  style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 0.6s ease", display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                <h3 style={{ fontFamily: "var(--font-body)", fontSize: "16px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em", marginBottom: "4px" }}>{p.name}</h3>
                <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-body)" }}>₹{p.price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER — dark section
      ═══════════════════════════════════════════ */}
      <section id="contact" className="reveal" style={{ backgroundColor: "var(--primary)", padding: "100px 48px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "rgba(168,152,128,0.8)", fontFamily: "var(--font-body)" }}>
            Dispatch
          </span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#FAF7F2" }}>
            Stay Informed.
          </h2>
          <p style={{ fontSize: "17px", lineHeight: 1.65, color: "#A89880", fontFamily: "var(--font-body)", fontWeight: 400, maxWidth: "480px" }}>
            New releases. Design insights. Acoustic notes from the listening room. Sent infrequently. Read carefully.
          </p>
          <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "480px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ flex: "1 1 220px", height: "48px", background: "transparent", border: "1px solid rgba(168,152,128,0.5)", borderRadius: "6px", padding: "0 20px", fontSize: "15px", color: "#FAF7F2", fontFamily: "var(--font-body)", outline: "none" }}
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribeState !== "idle"}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ height: "48px", width: "140px", background: "#FAF7F2", color: "var(--primary)", border: "none", borderRadius: "6px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: subscribeState !== "idle" ? "default" : "pointer", transition: "transform 150ms ease, background 200ms ease", opacity: subscribeState === "loading" ? 0.7 : 1 }}>
              {subscribeState === "success" ? "✓ Subscribed" : subscribeState === "loading" ? "Sending…" : "Subscribe"}
            </button>
          </div>
          {subscribeState === "success" && (
            <p style={{ fontSize: "14px", color: "var(--accent)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
              Thank you for subscribing.
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST TICKER — continuously scrolling
      ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#FFFFFF", padding: "20px 0", overflow: "hidden", borderTop: "1px solid rgba(164,152,128,0.2)", borderBottom: "1px solid rgba(164,152,128,0.2)" }}>
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div className="ticker-track" style={{ display: "flex", gap: "0", whiteSpace: "nowrap", willChange: "transform" }}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "24px", fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", padding: "0 32px" }}>
                {item}
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#DEDEDE", flexShrink: 0, display: "inline-block" }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "var(--bg)", borderTop: "1px solid rgba(164,152,128,0.25)", padding: "72px 48px 0", fontFamily: "var(--font-body)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* 4-col grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", paddingBottom: "56px" }}>
            {/* Col 1 — Brand */}
            <div>
              <img src="/logo.png" alt="earshoshy" style={{ height: "32px", objectFit: "contain", opacity: 0.85, marginBottom: "16px" }} />
              <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--muted)", maxWidth: "220px" }}>
                Audio Perfection. Simplified.
              </p>
              <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                {[
                  { label: "Instagram", href: "https://instagram.com" },
                  { label: "Twitter", href: "https://twitter.com" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{ color: "var(--muted)", display: "flex" }}>
                    {s.label === "Instagram" ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — Shop */}
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text)", marginBottom: "24px" }}>Shop</h4>
              {[
                { label: "Wired EarPods", action: () => router.push("/shop") },
                { label: "Wireless Headphones", action: () => router.push("/shop") },
                { label: "Accessories", action: () => router.push("/shop") },
                { label: "Gift Cards", action: () => router.push("/shop") },
              ].map(l => (
                <button key={l.label} onClick={l.action} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)", textAlign: "left", padding: "0 0 12px", lineHeight: 1.5 }}>{l.label}</button>
              ))}
            </div>

            {/* Col 3 — Explore */}
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text)", marginBottom: "24px" }}>Explore</h4>
              {[
                { label: "Our Story", action: () => document.getElementById("origin-story")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "Design Philosophy", action: () => document.getElementById("origin-story")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "Support", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
                { label: "Contact Us", action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
              ].map(l => (
                <button key={l.label} onClick={l.action} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--muted)", fontFamily: "var(--font-body)", textAlign: "left", padding: "0 0 12px", lineHeight: 1.5 }}>{l.label}</button>
              ))}
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "16px", fontFamily: "var(--font-body)" }}>Stay in the loop</h4>
              <input
                type="email"
                placeholder="your@email.com"
                style={{ width: "100%", height: "44px", border: "1px solid rgba(164,152,128,0.4)", borderRadius: "6px", padding: "0 16px", fontSize: "14px", fontFamily: "var(--font-body)", background: "transparent", color: "var(--text)", outline: "none", marginBottom: "12px" }}
              />
              <button
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.01)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                style={{ width: "100%", height: "44px", background: "var(--primary)", color: "#FAF7F2", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", transition: "transform 150ms ease" }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid rgba(164,152,128,0.25)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              © 2025 earshoshy. All rights reserved.{" "}
              <button id="privacy-policy" onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-body)", textDecoration: "underline" }}>Privacy Policy</button>
              {" · "}
              <button id="terms-of-service" onClick={() => {}} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-body)", textDecoration: "underline" }}>Terms of Service</button>
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {["Visa", "Mastercard", "Amex", "UPI"].map(pay => (
                <span key={pay} style={{ fontSize: "11px", fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--muted)", border: "1px solid rgba(164,152,128,0.3)", borderRadius: "4px", padding: "3px 7px", letterSpacing: "0.04em" }}>{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}