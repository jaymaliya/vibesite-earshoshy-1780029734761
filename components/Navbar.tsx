"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();

  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [badgePulse, setBadgePulse] = React.useState(false);
  const prevTotalItems = React.useRef(totalItems);

  // Shadow on scroll
  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pulse badge when cart changes
  React.useEffect(() => {
    if (prevTotalItems.current !== totalItems) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 500);
      prevTotalItems.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  // Lock body scroll when mobile menu open
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleScrollTo(id: string) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    fontSize: "16px",
    fontWeight: 500,
    color: "#1A1A1A",
    letterSpacing: "-0.01em",
    padding: "0 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    lineHeight: 1,
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
    textDecoration: "none",
  };

  const navLinkHoverClass =
    "hover:text-[#BC9347] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347] focus-visible:rounded";

  return (
    <>
      {/* Keyframe for badge pulse — added as a global via style tag in _document, replicated inline via CSS variable trick */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#FAF7F2",
          borderBottom: scrolled ? "1px solid rgba(58,58,58,0.08)" : "1px solid transparent",
          boxShadow: scrolled
            ? "0 2px 16px 0 rgba(58,58,58,0.10)"
            : "none",
          transition:
            "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div style={{ flex: "0 0 auto", zIndex: 2 }}>
            <img
              src="/logo.png"
              alt="earshoshy logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer", display: "block" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop nav links — centered absolutely */}
          <div
            aria-label="Desktop navigation links"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
            className="hidden md:flex"
          >
            <button
              style={navLinkStyle}
              className={navLinkHoverClass}
              onClick={() => router.push("/shop")}
            >
              Shop
            </button>
            <button
              style={navLinkStyle}
              className={navLinkHoverClass}
              onClick={() => handleScrollTo("about")}
            >
              Our Story
            </button>
            <button
              style={navLinkStyle}
              className={navLinkHoverClass}
              onClick={() => handleScrollTo("support")}
            >
              Support
            </button>
          </div>

          {/* Right — cart + mobile hamburger */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              zIndex: 2,
            }}
          >
            {/* Cart button */}
            <button
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              onClick={() => router.push("/checkout")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              className="hover:bg-[#3B3B3B]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347] active:scale-95"
            >
              {/* Cart SVG — lucide-style shopping bag */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {/* Badge */}
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    backgroundColor: "#1A1A1A",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 600,
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    transform: badgePulse ? "scale(1.3)" : "scale(1)",
                    transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                width: "40px",
                height: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                borderRadius: "8px",
                transition: "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              className="md:hidden hover:bg-[#3B3B3B]/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
            >
              {/* Animated bars */}
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#1A1A1A",
                  borderRadius: "2px",
                  transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                  transition:
                    "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#1A1A1A",
                  borderRadius: "2px",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "22px",
                  height: "2px",
                  backgroundColor: "#1A1A1A",
                  borderRadius: "2px",
                  transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                  transition:
                    "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          backgroundColor: "#FAF7F2",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transform: menuOpen ? "translateY(0)" : "translateY(-16px)",
          transition:
            "opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
        className="md:hidden"
      >
        {/* Mobile logo */}
        <div style={{ marginBottom: "40px" }}>
          <img
            src="/logo.png"
            alt="earshoshy logo"
            style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
            onClick={() => {
              setMenuOpen(false);
              router.push("/");
            }}
          />
        </div>

        {/* Mobile nav links */}
        {[
          {
            label: "Shop",
            action: () => {
              setMenuOpen(false);
              router.push("/shop");
            },
          },
          {
            label: "Our Story",
            action: () => handleScrollTo("about"),
          },
          {
            label: "Support",
            action: () => handleScrollTo("support"),
          },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "28px",
              fontWeight: 500,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 32px",
              borderRadius: "12px",
              transition:
                "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            className="hover:text-[#BC9347] hover:bg-[#3B3B3B]/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
          >
            {label}
          </button>
        ))}

        {/* Mobile cart link */}
        <button
          onClick={() => {
            setMenuOpen(false);
            router.push("/checkout");
          }}
          style={{
            marginTop: "24px",
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            fontSize: "16px",
            fontWeight: 500,
            color: "#FAF7F2",
            backgroundColor: "#1A1A1A",
            border: "none",
            cursor: "pointer",
            padding: "14px 40px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition:
              "transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          className="hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          Cart
          {totalItems > 0 && (
            <span
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "9999px",
                backgroundColor: "#BC9347",
                color: "#FAF7F2",
                fontSize: "11px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </>
  );
}