import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generatePageTitle } from "@/utils/utils";
import { getPageMeta } from "@/utils/seo";
import { renderSEOTags } from "@/utils/seo-tags";
import { getRuntimeConfig } from "@/utils/runtime-config";
import { Menu, X, Sparkles, TrendingUp} from "lucide-react";
import "./home.css";

const navItems = [
  {
    label: "Markets",
    to: "/markets",
    className:
      "oui-text-[#cecfd2] hover:oui-text-white hover:!oui-underline font-normal",
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    className:
      "oui-text-[#cecfd2] hover:oui-text-white hover:!oui-underline font-normal",
  },
  {
    label: "AI Trading",
    to: "/perp",
    className: "text-[#8f9097] hover:text-white font-normal",
    color: "#8f9097",
    disabled: true,
  },
  {
    label: "Points",
    to: "/rewards",
    className: "text-[#8f9097] hover:text-white font-normal",
    color: "#8f9097",
    disabled: true,
  },
  {
    label: "Referral",
    to: "/rewards/affiliate?tab=affiliate",
    className: "text-[#8f9097] hover:text-white font-normal",
    color: "#8f9097",
    disabled: true,
  },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(13,11,17,0.8)] backdrop-blur-[12px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/darkLogo.png" alt="Qell.ai" className="h-8 w-auto block" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-sm transition-colors ${item.className} ${
                  item.disabled ? "pointer-events-none cursor-default" : ""
                }`}
                style={item.color ? { color: item.color } : undefined}
                aria-disabled={item.disabled ? "true" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07090f] border-t border-[#333741]">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block text-sm text-[#cecfd2] hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let vantaEffect: { destroy: () => void } | null = null;

    const setup = async () => {
      if (!vantaRef.current) return;
      const THREE = await import("three");
      const HALO = (await import("vanta/dist/vanta.halo.min")).default;
      vantaEffect = HALO({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        backgroundColor: 0x07090f,
        baseColor: 0x6820042,
        color2: 0x15918901,
        amplitudeFactor: 1.4,
        ringFactor: 1,
        rotationFactor: 1,
        size: 1.1,
        speed: 1,
        xOffset: 0.13,
        yOffset: -0.01,
      });
    };

    setup();

    return () => {
      vantaEffect?.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-[#0d0b11] pt-16 overflow-hidden">
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-white font-bold leading-tight text-balance text-3xl md:text-4xl lg:text-5xl">
              The AI Revolution of Decentralized Trading
            </h1>
            <p className="text-[#cecfd2] text-lg max-w-lg font-normal">
              Unleashing institutional-grade AI execution with $500M+ daily liquidity across 18+ chains.
            </p>
            <button
              className="home-newsletter-button rounded-md h-9 w-[132px] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(130,90,255,0.35)]"
              onClick={() => navigate("/perp")}
              type="button"
              style={{ fontSize: "12px" }}
            >
              Start Trading
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07090f] to-transparent" />
    </section>
  );
}

function TradeSmarterSection() {
  return (
    <section className="relative py-48 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/home/TradeSmarterSectionBG.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
     

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col gap-4 mb-12 text-center sm:text-left sm:items-start sm:max-w-3xl sm:mx-auto sm:pl-80 lg:pl-100">
          <h2 className="text-3xl md:text-4xl font-bold text-white  font-normal">Trade Smarter.</h2>
          <p className="text-lg md:text-2xl font-semibold tracking-wide font-normal">
            AI-POWERED PERPETUALS & RWA.
          </p>
          <p className="text-[#94969c] text-sm md:text-base font-normal"  style={{ fontSize: "12px" }}>
            Low slippage. Intelligent execution. Global markets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 max-w-3xl mx-auto sm:pl-80 lg:pl-100">
          <div className="relative flex-1  rounded-xl overflow-hidden px-6 py-5">
            <img
              src="/home/Rectangle.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative flex items-center gap-3 mb-3">
              <img src="/home/AIInsights.png" alt="AI Insights" className="h-6 w-auto" />
            </div>
            <p
              className="relative text-[#94969c] text-xs md:text-sm font-normal"
              style={{ fontSize: "10px" }}
            >
              AI-assisted decisions, smart trading signals. Optimize strategies.
            </p>
          </div>

          <div className="relative flex-1  rounded-xl overflow-hidden px-6 py-5">
            <img
              src="/home/Rectangle.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative flex items-center gap-3 mb-3">
              <img src="/home/RWAUSStocks.png" alt="RWA US Stocks" className="h-6 w-auto" />
            </div>
            <p
              className="relative text-[#94969c]  md:text-sm font-normal"
              style={{ fontSize: "10px" }}
            >
              Institutional depth. 24/7 access. Trade AMZN, TSLA, GOOGL...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: "/home/chat.png",
    title: "Institutional-Grade Liquidity",
    description:
      "Trade across all major chains without the hassle of bridging. Our infrastructure unifies networks for instant settlements and a truly boundary-less experience.",
  },
  {
    icon: "/home/flash.png",
    title: "Seamless Omnichain Connectivity",
    description:
      "Our engine is built for the tightest spreads in the industry. By leveraging deep market-maker support, we minimize slippage to keep your trades on track.",
  },
  {
    icon: "/home/awarre.png",
    title: "Optimized Execution and Low Slippage",
    description:
      "Our engine is built for the tightest spreads in the industry. By leveraging deep market-maker support, we minimize slippage to keep your trades on track.",
  },
  {
    icon: "/home/swime.png",
    title: "Unmatched Cost Efficiency",
    description:
      "Maximize your profits with our industry-leading fee structure. We offer highly competitive rates to significantly reduce your overhead on every execution.",
  },
];

function WhyChooseSection() {
  return (
    <section className="relative py-48 bg-[#0f0c11]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-3xl font-bold text-white font-normal">Why Choose qell.ai?</h2>
            <p className="text-[#94969c] text-sx leading-relaxed font-normal">
              We bring you institutional-grade liquidity and AI-powered insights across all major chains. Trade perps and
              RWA with minimal slippage and the lowest fees in the game. It is high-performance trading, simplified.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col gap-3">
                  <div className="w-10 h-10">
                    <img src={feature.icon} alt={feature.title}  />
                  </div>
                  <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                  <p className="text-[#94969c] text-xs leading-relaxed font-normal">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center items-center lg:justify-end">
            <img
              src="/home/laptop.gif"
              alt="Qell.ai trading dashboard"
              className="w-full max-w-4xl lg:max-w-7xl scale-[2] origin-left mt-32"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const formAction =
    getRuntimeConfig("VITE_NEWSLETTER_FORM_ACTION")?.trim() || "";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formAction || formAction.includes("your_form_id")) {
      console.warn("Newsletter form action is not configured.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    fetch(formAction, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit newsletter form");
        }
        setEmail("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <section className="relative py-48 overflow-hidden bg-[#000000]">
      <div className="absolute inset-x-0 bottom-8 h-[350px] ">
        <img
          src="/home/earth.gif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col gap-8 -translate-y-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Stay updated with Qell.ai</h2>

          <form
            onSubmit={handleSubmit}
            className="flex items-center max-w-sm mx-auto rounded-full border border-[#2c2c36] bg-[rgba(38,38,50,0.8)] overflow-hidden"
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="&nbsp;&nbsp;&nbsp;&nbsp;Your email"
              className="flex-1 bg-transparent px-2 py-1.5 text-[8px] text-white placeholder:text-[#8b8f9a] focus:outline-none"
              required
              style={{ fontSize: "10px" }}
            />
            <button
              type="submit"
              className="home-newsletter-button rounded-r-full px-3 py-2.5 font-semibold text-white h-full"
              style={{ fontSize: "10px", lineHeight: "1" }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const partners = [
    { name: "Polygon", logo: "polygon" },
    { name: "LayerZero", logo: "layerzero" },
    { name: "Arbitrum", logo: "arbitrum" },
    { name: "Optimism", logo: "optimism" },
    { name: "Ethereum", logo: "ethereum" },
  ];

  return (
    <section className="py-24 bg-[#0d0b11]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 ">
          Join our growing list of partners
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center  text-[#94969c] font-semibold hover:text-white transition-colors"
            >
              <PartnerLogo name={partner.logo} />
    
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerLogo({ name }: { name: string }) {
  const srcMap: Record<string, string> = {
    polygon: "/home/polygon.png",
    layerzero: "/home/layerzero.png",
    arbitrum: "/home/arbitrum.png",
    optimism: "/home/optimism.png",
    ethereum: "/home/ethereum.png",
  };

  const src = srcMap[name];
  if (!src) return null;

  return <img src={src} alt={name} className="w-32 h-10" />;
}

function Footer({ appName }: { appName: string }) {
  return (
    <footer className="bg-[#07090f] ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <Link to="/home" className="flex items-center">
            <img src="/darkLogo.png" alt="Qell.ai" className="h-8 w-auto block" />
          </Link>
          <p className="text-xs text-[#94969c] font-normal">
            © 2026 {appName}. Next-Gen AI-Driven Perps & RWA.
            <a href="#" className="hover:text-white transition-colors">
              {" "}Privacy Policy
            </a>
            {" "} |{" "}
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-[#2d374b] flex items-center justify-center text-[#94969c] hover:text-white hover:bg-[#333741] transition-colors"
            aria-label="X"
          >
            <img src="/home/x.png" alt="X" className="w-10 h-10" />
          </a>
          <a
            href="#"
            className="w-10 h-10 "
            aria-label="Discord"
          >
            <img src="/home/discord.png" alt="Discord" className="w-10 h-10" />
          </a>
          <a
            href="#"
            className="w-10 h-10 "
            aria-label="Telegram"
          >
            <img src="/home/github.png" alt="GitHub" className="w-10 h-10" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function HomeIndex() {
  const pageMeta = useMemo(() => getPageMeta(), []);
  const pageTitle = useMemo(() => generatePageTitle("Home"), []);
  const appName = useMemo(() => getRuntimeConfig("VITE_APP_NAME") || "Qell.ai", []);

  return (
    <>
      {renderSEOTags(pageMeta, pageTitle)}
      <main className="home-page min-h-screen">
        <Header />
        <HeroSection />
        <TradeSmarterSection />
        <WhyChooseSection />
        <NewsletterSection />
        <PartnersSection />
        <Footer appName={appName} />
      </main>
    </>
  );
}
