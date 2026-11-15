import { ACHIEVEMENTS } from "../data.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

export default function Achievements() {
  const { lang, t } = useLanguage();

  return (
    <section className="section section--light" id="achievements">
      <div className="container">
        <SectionHead
          eyebrow={t("achievements.eyebrow")}
          title={t("achievements.title")}
          accent={t("achievements.accent")}
          lead={t("achievements.lead")}
        />

        <div className="achievements">
          {ACHIEVEMENTS.map((a, i) => {
            const title = a[`title_${lang}`] || a.title;
            const desc = a[`desc_${lang}`] || a.desc;
            const dateStr = a[`date_${lang}`] || a.date || a.year;
            const issuer = a[`issuer_${lang}`] || a.issuer;

            return (
              <Reveal as="article" className="achv" key={a.title} delay={i * 90}>
                <span className="achv__year">{dateStr}</span>
                <h3>{title}</h3>
                {issuer && <p className="achv__issuer">{issuer}</p>}
                <p className="achv__desc">{desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
