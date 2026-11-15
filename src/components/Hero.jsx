import { ArrowDown } from "lucide-react";
import { PROFILE } from "../data.js";
import WaveDivider from "./WaveDivider.jsx";
import { useScrollY, prefersReducedMotion } from "../hooks.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Hero() {
  const { t } = useLanguage();
  const y = useScrollY();
  const isReducedMotion = prefersReducedMotion();
  const parallaxOffset =
    !isReducedMotion && typeof window !== "undefined" && window.innerWidth > 992
      ? Math.min(y * 0.14, 100)
      : 0;

  return (
    <section className="hero" id="home">
      {/* Background Photography Asset */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src="/matthew-hero.webp"
          alt="Matthew Filbert Angelus — Personal Portfolio"
          className="hero__bg-img"
          fetchPriority="high"
          decoding="async"
          width={2048}
          height={1365}
          style={{ "--hero-parallax": `${parallaxOffset}px` }}
        />
        <div className="hero__overlay" />
      </div>

      {/* Right-Aligned Editorial Headline */}
      <div className="hero__content">
        <div className="hero__editorial">
          <p className="hero__eyebrow">{t("hero.eyebrow")}</p>

          <h1 className="hero__name" aria-label="MATTHEW ANGELUS">
            <span className="hero__name-line">
              <span className="hero__name-line-inner">MATTHEW</span>
            </span>
            <span className="hero__name-line">
              <span className="hero__name-line-inner">ANGELUS</span>
            </span>
          </h1>
        </div>
      </div>

      {/* Subtle Editorial Bottom Bar */}
      <div className="hero__bottom">
        <div className="hero__location">
          <span>{t("hero.city")}</span>
        </div>

        <div className="hero__scroll">
          <a href="#about" aria-label={t("hero.scroll")}>
            <span>{t("hero.scroll")}</span>
            <ArrowDown size={13} className="hero__scroll-icon" />
          </a>
        </div>
      </div>

      {/* Layered SVG Wave Divider to Next Section */}
      <WaveDivider />
    </section>
  );
}
