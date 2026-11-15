import { PROFILE } from "../data.js";
import { useCountUp, useInView } from "../hooks.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";

function Stat({ value, label }) {
  const [ref, seen] = useInView({ threshold: 0.3, rootMargin: "0px" });
  const n = useCountUp(value, seen);
  return (
    <li ref={ref}>
      <span className="stat__num">
        {n}
        <small>+</small>
      </span>
      <span className="stat__label">{label}</span>
    </li>
  );
}

export default function About() {
  const { t } = useLanguage();
  const leadSentence = t("about.lead");
  const words = leadSentence.split(" ");

  const stats = [
    { value: 12, label: t("about.stats.education") },
    { value: 5, label: t("about.stats.org") },
    { value: 4, label: t("about.stats.industry") },
    { value: 3, label: t("about.stats.competition") },
  ];

  return (
    <section className="section about-section" id="about" data-scroll-scene>
      <div className="container">
        {/* 3-Column Editorial Grid matching reference image */}
        <div className="about__layout">
          {/* Column 1: Typography, Story, Campus */}
          <Reveal className="about__col about__col--left" delay={50}>
            <h2 className="about__title">
              <span>{t("about.title1")}</span>
              <span>{t("about.title2")}</span>
            </h2>

            <div className="about__lead-statement">
              {words.map((word, index) => (
                <span data-word key={index}>
                  {word}{" "}
                </span>
              ))}
            </div>

            <div className="about__divider" aria-hidden="true" />

            <div className="about__paragraphs">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </div>
          </Reveal>

          {/* Column 2: Centerpiece Portrait with Burgundy Decorative Circle */}
          <Reveal className="about__col about__col--center" delay={150}>
            <div className="about__portrait-container">
              <div className="about__circle" aria-hidden="true" />
              <div className="about__portrait-wrap">
                <img
                  src="/about-portrait.jpg"
                  alt={PROFILE.fullName}
                  className="about__portrait"
                  width={682}
                  height={1024}
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          {/* Column 3: Profile Name, Legal Symbolism, Quote */}
          <Reveal className="about__col about__col--right" delay={250}>
            <div className="about__profile-header">
              <h3 className="about__profile-name">
                <span>Matthew Filbert</span>
                <span>Angelus</span>
              </h3>
              <div className="about__profile-meta">
                <p>{t("about.metaCampus")}</p>
              </div>
              <div className="about__meta-divider" aria-hidden="true" />
            </div>

            <div className="about__quote-note">
              <p style={{ whiteSpace: "pre-line" }}>{t("about.quote")}</p>
            </div>
          </Reveal>
        </div>

        {/* Stats counter preserved with smooth count-up animation */}
        <Reveal as="ul" className="stats stats--about" delay={200}>
          {stats.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
