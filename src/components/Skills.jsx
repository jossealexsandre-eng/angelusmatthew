import { SKILL_GROUPS, SOFT_SKILLS } from "../data.js";
import { useInView } from "../hooks.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

function BarCard({ group, title, delay, lang }) {
  const [ref, seen] = useInView({ threshold: 0.2, rootMargin: "0px" });
  return (
    <Reveal as="article" className="skill-card" delay={delay}>
      <h3>{title}</h3>
      <ul className="bars" ref={ref}>
        {group.bars.map((b) => {
          const barName = b[`name_${lang}`] || b.name;
          return (
            <li key={b.name}>
              <span>{barName}</span>
              <div className="bar" role="presentation">
                <i style={{ width: seen ? `${b.level || 84}%` : 0 }} />
              </div>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}


export default function Skills() {
  const { lang, t } = useLanguage();

  const languageList = [
    t("skills.lang.id"),
    t("skills.lang.en"),
    t("skills.lang.fr"),
  ];

  return (
    <section className="section section--dark" id="skills">
      <div className="container">
        <SectionHead
          eyebrow={t("skills.eyebrow")}
          title={t("skills.title")}
          accent={t("skills.accent")}
        />

        <div className="skills">
          {/* Column 1 — Professional Skills */}
          <BarCard
            key="col-prof"
            group={SKILL_GROUPS[0]}
            title={t("skills.col1")}
            delay={0}
            lang={lang}
          />

          {/* Column 2 — Digital & Productivity */}
          <BarCard
            key="col-digital"
            group={SKILL_GROUPS[1]}
            title={t("skills.col2")}
            delay={90}
            lang={lang}
          />

          {/* Column 3 — Soft Skills & Languages */}
          <Reveal as="article" className="skill-card" delay={180}>
            <h3>{t("skills.col3")}</h3>
            <div className="chips">
              {SOFT_SKILLS.map((skill, idx) => {
                const label = typeof skill === "object" ? (skill[lang] || skill.id) : skill;
                return <span key={idx}>{label}</span>;
              })}
            </div>

            <h3 className="mt">{t("skills.languages")}</h3>
            <div className="chips">
              {languageList.map((langItem) => (
                <span key={langItem}>{langItem}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
