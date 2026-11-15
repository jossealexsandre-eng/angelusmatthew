import { useState, useEffect, useRef } from "react";
import { COMMITTEE_EXPERIENCE, ORGANIZATIONAL_EXPERIENCE } from "../data.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

function ExperienceCarousel({ photos, lang }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (!photos || photos.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % photos.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [photos, isPaused]);

  if (!photos || photos.length === 0) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % photos.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + photos.length) % photos.length);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="exp-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Dokumentasi Relawan Sosial Kitabisa"
    >
      <div className="exp-carousel__viewport">
        <div
          className="exp-carousel__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {photos.map((photo, idx) => (
            <div className="exp-carousel__slide" key={idx}>
              <img
                src={photo.src}
                alt={photo.alt}
                className="exp-carousel__img"
                loading="lazy"
              />
              <div className="exp-carousel__scrim" />
              <div className="exp-carousel__caption">
                <h4 className="exp-carousel__heading">Kita Bisa Volunteer</h4>
                <p className="exp-carousel__title">
                  {photo[`caption_${lang}`] || photo.caption_id || photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel manual navigation buttons */}
        <button
          type="button"
          className="exp-carousel__nav exp-carousel__nav--prev"
          onClick={prevSlide}
          aria-label="Foto sebelumnya"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className="exp-carousel__nav exp-carousel__nav--next"
          onClick={nextSlide}
          aria-label="Foto selanjutnya"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Footer controls: counter + indicator dots */}
      <div className="exp-carousel__bar">
        <span className="exp-carousel__counter">
          0{current + 1} <span className="exp-carousel__divider">/</span> 0{photos.length}
        </span>
        <div className="exp-carousel__dots">
          {photos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`exp-carousel__dot ${idx === current ? "is-active" : ""}`}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { lang, t } = useLanguage();

  return (
    <section className="section section--dark" id="experience">
      <div className="container experience__container">
        {/* Left Column: Heading */}
        <div className="experience__col-left">
          <SectionHead
            eyebrow={t("experience.eyebrow")}
            title={t("experience.title")}
            accent={t("experience.accent")}
            lead={t("experience.lead")}
          />
        </div>

        {/* Right Column: Divided Subsections for Committee and Organization */}
        <div className="experience__col-right">
          {/* Subsection 1: Kepanitiaan & Aksi Sosial (Reverse Chronological) */}
          <div className="experience__group">
            <Reveal className="experience__group-header" delay={40}>
              <span className="experience__group-eyebrow">{t("experience.group1")}</span>
              <h3 className="experience__group-title">{t("experience.subhead.committee")}</h3>
            </Reveal>

            <ol className="timeline">
              {COMMITTEE_EXPERIENCE.map((e, i) => {
                const role = e[`role_${lang}`] || e.role;
                const period = e[`period_${lang}`] || e.period;
                const eventName = e[`event_${lang}`] || e.event;
                const org = e[`org_${lang}`] || e.org;
                const points = e[`points_${lang}`] || e.points;

                return (
                  <Reveal as="li" className="timeline__item" key={e.id} delay={i * 70}>
                    <span className="timeline__date">{period} · {e.location}</span>
                    <div className="timeline__body">
                      <h3>{role}</h3>
                      <p className="timeline__org">{eventName} · {org}</p>
                      <ul className="timeline__points">
                        {points.slice(0, 3).map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                      {e.photos && e.photos.length > 0 && (
                        <ExperienceCarousel photos={e.photos} lang={lang} />
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>

          {/* Subsection 2: Pengalaman Organisasi & Kepemimpinan */}
          <div className="experience__group experience__group--separated">
            <Reveal className="experience__group-header" delay={40}>
              <span className="experience__group-eyebrow">{t("experience.group2")}</span>
              <h3 className="experience__group-title">{t("experience.subhead.organization")}</h3>
            </Reveal>

            <ol className="timeline">
              {ORGANIZATIONAL_EXPERIENCE.map((e, i) => {
                const role = e[`role_${lang}`] || e.role;
                const org = e[`org_${lang}`] || e.org;
                const institution = e[`institution_${lang}`] || e.institution;
                const period = e[`period_${lang}`] || e.period;
                const points = e[`points_${lang}`] || e.points;

                return (
                  <Reveal as="li" className="timeline__item" key={e.id} delay={i * 70}>
                    <span className="timeline__date">{period} · {e.location}</span>
                    <div className="timeline__body">
                      <h3>{role}</h3>
                      <p className="timeline__org">{org} · {institution}</p>
                      <ul className="timeline__points">
                        {points.slice(0, 3).map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                      {e.photos && e.photos.length > 0 && (
                        <ExperienceCarousel photos={e.photos} lang={lang} />
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
