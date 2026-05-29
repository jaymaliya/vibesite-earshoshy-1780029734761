"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const linkBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    fontSize: "15px",
    fontWeight: 400,
    color: "#A89880",
    padding: "4px 0",
    textAlign: "left",
    lineHeight: 1.6,
    transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    fontSize: "12px",
    fontWeight: 600,
    color: "#6E6459",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "20px",
  };

  return (
    <footer
      style={{
        backgroundColor: "#FAF7F2",
        borderTop: "1px solid rgba(58,58,58,0.10)",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
      aria-label="Site footer"
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div>
            <img
              src="/logo.png"
              alt="earshoshy logo"
              style={{
                height: "32px",
                objectFit: "contain",
                opacity: 0.85,
                display: "block",
                marginBottom: "20px",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "15px",
                color: "#A89880",
                lineHeight: 1.7,
                maxWidth: "240px",
                margin: 0,
              }}
            >
              We sell sound. Nothing more, nothing less. Precision audio for those who listen closely.
            </p>

            {/* Social icons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "28px",
                alignItems: "center",
              }}
            >
              {/* Instagram */}
              <a
                href="https://instagram.com/earshoshy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="earshoshy on Instagram"
                style={{
                  color: "#6E6459",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(110,100,89,0.08)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                className="hover:text-[#BC9347] hover:bg-[#BC9347]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com/earshoshy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="earshoshy on Twitter"
                style={{
                  color: "#6E6459",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(110,100,89,0.08)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                className="hover:text-[#BC9347] hover:bg-[#BC9347]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l16 16M4 20L20 4" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917777777777"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with earshoshy on WhatsApp"
                style={{
                  color: "#6E6459",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(110,100,89,0.08)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                className="hover:text-[#BC9347] hover:bg-[#BC9347]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p style={headingStyle}>Navigate</p>
            <nav aria-label="Footer navigation" style={{ display: "flex", flexDirection: "column" }}>
              <button
                style={linkBtnStyle}
                className="hover:text-[#BC9347] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9347]"
                onClick={() => router.push("/")}
              >
                Home
              </button>
              <button
                style={linkBtnStyle}
                className="hover:text-[#BC9347] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9347]"
                onClick={() => router.push("/shop")}
              >
                Shop
              </button>
              <button
                style={linkBtnStyle}
                className="hover:text-[#BC9347] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9347]"
                onClick={() => {
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Our Story
              </button>
              <button
                style={linkBtnStyle}
                className="hover:text-[#BC9347] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9347]"
                onClick={() => {
                  document.getElementById("support")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Support
              </button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p style={headingStyle}>Contact</p>
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "15px",
                color: "#A89880",
                textDecoration: "none",
                display: "block",
                marginBottom: "8px",
                lineHeight: 1.6,
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              className="hover:text-[#BC9347] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BC9347]"
            >
              maliyajay77@gmail.com
            </a>
            <p
              style={{
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "14px",
                color: "#A89880",
                margin: "16px 0 0 0",
                lineHeight: 1.6,
              }}
            >
              Free shipping on orders over ₹999.
              <br />
              Returns within 7 days.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <p style={headingStyle}>Stay in the loop</p>
            <p
              style={{
                fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                fontSize: "14px",
                color: "#A89880",
                lineHeight: 1.6,
                marginBottom: "20px",
                marginTop: 0,
              }}
            >
              New drops, rare finds, no noise.
            </p>

            {status === "success" ? (
              <p
                role="status"
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                  fontSize: "15px",
                  color: "#BC9347",
                  fontWeight: 500,
                  padding: "14px 0",
                }}
              >
                Thanks! We'll be in touch.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                aria-label="Newsletter subscription form"
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize: "14px",
                    color: "#1A1A1A",
                    backgroundColor: "rgba(58,58,58,0.06)",
                    border: "1px solid rgba(58,58,58,0.14)",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition:
                      "border-color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  className="focus:border-[#BC9347] focus:bg-white placeholder:text-[#A89880]"
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#FAF7F2",
                    backgroundColor: status === "loading" ? "#6E6459" : "#1A1A1A",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    letterSpacing: "-0.01em",
                    transition:
                      "transform 0.25s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  className="hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BC9347]"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>

                {status === "error" && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
                      fontSize: "13px",
                      color: "#8b3a2f",
                      margin: 0,
                    }}
                  >
                    Something went wrong. Try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(58,58,58,0.08)",
            marginBottom: "32px",
          }}
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "13px",
              color: "#A89880",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} earshoshy. All rights reserved.
          </p>

          <p
            style={{
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "13px",
              color: "#A89880",
              margin: 0,
            }}
          >
            Made with care in India&nbsp;&nbsp;·&nbsp;&nbsp;UPI &amp; Cards accepted
          </p>
        </div>
      </div>
    </footer>
  );
}