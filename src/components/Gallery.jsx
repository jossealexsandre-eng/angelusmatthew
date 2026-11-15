import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, X, ZoomIn } from "lucide-react";
import { GALLERY_ARCHIVE } from "../data.js";
import { prefersReducedMotion } from "../hooks.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Gallery() {
  const { lang, t } = useLanguage();
  const [activeActualIndex, setActiveActualIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Carousel physics & animation refs
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const isAnimatingStepRef = useRef(false);
  const lastTimeRef = useRef(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const rafIdRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // Triple clone for seamless infinite loop (5 * 3 = 15 cards)
  const items = [...GALLERY_ARCHIVE, ...GALLERY_ARCHIVE, ...GALLERY_ARCHIVE];
  const totalOriginal = GALLERY_ARCHIVE.length;

  // Measure card step width (card width + gap)
  const getStepMetrics = useCallback(() => {
    if (!trackRef.current) return { cardWidth: 320, gap: 28, step: 348, setWidth: 1740 };
    const firstCard = trackRef.current.children[0];
    if (!firstCard) return { cardWidth: 320, gap: 28, step: 348, setWidth: 1740 };
    
    const cardWidth = firstCard.offsetWidth || 320;
    const computedGap = parseFloat(window.getComputedStyle(trackRef.current).gap) || 28;
    const step = cardWidth + computedGap;
    const setWidth = step * totalOriginal;
    return { cardWidth, gap: computedGap, step, setWidth };
  }, [totalOriginal]);

  // Center Detection: find which card is closest to viewport center
  const updateActiveCenter = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    const cards = trackRef.current.children;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const dist = Math.abs(centerX - cardCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    const actualIdx = closestIdx % totalOriginal;
    setActiveActualIndex(actualIdx);

    // Apply is-center class to card closest to viewport center
    for (let i = 0; i < cards.length; i++) {
      if (i === closestIdx) {
        cards[i].classList.add("is-center");
      } else {
        cards[i].classList.remove("is-center");
      }
    }
  }, [totalOriginal]);

  // Main Animation Loop
  useEffect(() => {
    const isReduced = prefersReducedMotion();

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min(32, time - lastTimeRef.current);
      lastTimeRef.current = time;

      const { setWidth } = getStepMetrics();

      if (isAnimatingStepRef.current) {
        // Smooth lerp transition to target step offset
        const diff = targetOffsetRef.current - offsetRef.current;
        if (Math.abs(diff) > 0.5) {
          offsetRef.current += diff * 0.12;
        } else {
          offsetRef.current = targetOffsetRef.current;
          isAnimatingStepRef.current = false;
        }
      } else if (!isHovered && !isDragging && lightboxIndex === null && !isReduced) {
        // Continuous linear slow crawl: ~35 seconds for full cycle
        const speed = setWidth / 35000; // px per millisecond
        offsetRef.current -= speed * delta;
        targetOffsetRef.current = offsetRef.current;
      }

      // Infinite seamless boundary wrapping
      if (setWidth > 0) {
        while (offsetRef.current <= -setWidth) {
          offsetRef.current += setWidth;
          targetOffsetRef.current += setWidth;
        }
        while (offsetRef.current > 0) {
          offsetRef.current -= setWidth;
          targetOffsetRef.current -= setWidth;
        }
      }

      // Apply transform using GPU-accelerated translate3d
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      updateActiveCenter();
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [getStepMetrics, isHovered, isDragging, lightboxIndex, updateActiveCenter]);

  // Step Navigation: Next Slide
  const handleNext = () => {
    const { step } = getStepMetrics();
    targetOffsetRef.current = offsetRef.current - step;
    isAnimatingStepRef.current = true;
  };

  // Step Navigation: Previous Slide
  const handlePrev = () => {
    const { step } = getStepMetrics();
    targetOffsetRef.current = offsetRef.current + step;
    isAnimatingStepRef.current = true;
  };

  // Drag / Swipe handling
  const handlePointerDown = (e) => {
    if (lightboxIndex !== null) return;
    setIsDragging(true);
    isAnimatingStepRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);
    offsetRef.current = dragStartOffsetRef.current + deltaX;
    targetOffsetRef.current = offsetRef.current;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If swiped with notable intent, snap to nearest card
    const { step } = getStepMetrics();
    if (dragDistanceRef.current > 35) {
      const nearestCardIndex = Math.round(offsetRef.current / step);
      targetOffsetRef.current = nearestCardIndex * step;
      isAnimatingStepRef.current = true;
    }
  };

  // Lightbox handlers
  const openLightbox = (originalIdx, e) => {
    // Prevent opening if the user was just dragging
    if (dragDistanceRef.current > 8) return;
    setLightboxIndex(originalIdx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % totalOriginal);
  }, [totalOriginal]);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + totalOriginal) % totalOriginal);
  }, [totalOriginal]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  // Mobile Lightbox Swipe gestures
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const onLightboxTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const onLightboxTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) nextLightbox();
      else prevLightbox();
    } else if (Math.abs(diffY) > 60 && Math.abs(diffY) > Math.abs(diffX)) {
      closeLightbox();
    }
  };

  const formatIndex = (num) => String(num).padStart(2, "0");

  return (
    <section className="section gallery-section" id="gallery" data-scroll-scene>
      <div className="container">
        {/* ========================================================
            2-COLUMN EDITORIAL SECTION HEADER
            ======================================================== */}
        <div className="gallery__header">
          {/* Left Column: Large Editorial Heading */}
          <div className="gallery__header-left">
            <h2 className="gallery__heading">{t("gallery.heading")}</h2>
          </div>

          {/* Right Column: Lead Description + Elegant Control Suite */}
          <div className="gallery__header-right">
            <p className="gallery__lead">{t("gallery.lead")}</p>

            <div className="gallery__controls-suite">
              {/* Active Slide Counter (01 / 05) */}
              <div className="gallery__counter" aria-live="polite">
                <span className="gallery__counter-num">
                  {formatIndex(activeActualIndex + 1)}
                </span>
                <span className="gallery__counter-divider">/</span>
                <span className="gallery__counter-total">
                  {formatIndex(totalOriginal)}
                </span>
              </div>

              {/* Thin Progress Indicator */}
              <div className="gallery__progress-track" aria-hidden="true">
                <div
                  className="gallery__progress-bar"
                  style={{
                    width: `${((activeActualIndex + 1) / totalOriginal) * 100}%`,
                  }}
                />
              </div>

              {/* Minimalist Prev/Next Arrow Buttons */}
              <div className="gallery__nav-btns">
                <button
                  type="button"
                  className="gallery__nav-btn gallery__nav-btn--prev"
                  onClick={handlePrev}
                  aria-label={t("gallery.prev")}
                >
                  <ArrowLeft size={16} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  className="gallery__nav-btn gallery__nav-btn--next"
                  onClick={handleNext}
                  aria-label={t("gallery.next")}
                >
                  <ArrowRight size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          INFINITE HORIZONTAL CAROUSEL
          ======================================================== */}
      <div
        className={`gallery__carousel-wrapper ${isDragging ? "is-dragging" : ""}`}
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="region"
        aria-label={t("gallery.region")}
      >
        <div className="gallery__track" ref={trackRef}>
          {items.map((item, idx) => {
            const originalIndex = idx % totalOriginal;
            const tag = item[`tag_${lang}`] || item.tag;
            const title = item[`title_${lang}`] || item.title;

            return (
              <figure
                key={`${item.id}-${idx}`}
                className="gallery__card"
                onClick={(e) => openLightbox(originalIndex, e)}
                tabIndex={0}
                role="button"
                aria-label={`${tag} — ${title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(originalIndex);
                  }
                }}
              >
                <div className="gallery__card-media">
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={idx < 6 ? "eager" : "lazy"}
                    draggable={false}
                  />
                  <div className="gallery__card-gradient" />
                  
                  {/* Subtle hover icon hint */}
                  <span className="gallery__card-zoom-hint" aria-hidden="true">
                    <ZoomIn size={16} />
                  </span>
                </div>

                <figcaption className="gallery__card-caption">
                  <span className="gallery__card-tag">
                    {tag}
                  </span>
                  <h3 className="gallery__card-title">{title}</h3>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          ELEGANT WAVE DIVIDER (TRANSITION TO CONTACT)
          ======================================================== */}
      <div className="gallery__wave-divider" aria-hidden="true">
        <svg
          className="gallery__wave-canvas"
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle depth layer */}
          <path
            d="M 0,26
               C 270,26 430,44 690,44
               C 930,44 1070,6 1230,6
               C 1320,6 1395,12 1440,16
               L 1440,50 L 0,50 Z"
            fill="#e2d8c7"
            opacity="0.65"
          />
          {/* Main cream wave matching Contact section background */}
          <path
            d="M 0,22
               C 260,22 420,40 680,40
               C 920,40 1060,4 1220,4
               C 1315,4 1390,12 1440,16
               L 1440,50 L 0,50 Z"
            fill="#F4EFE5"
          />
        </svg>
      </div>

      {/* ========================================================
          FULLSCREEN EDITORIAL LIGHTBOX
          ======================================================== */}
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery.region")}
          onTouchStart={onLightboxTouchStart}
          onTouchEnd={onLightboxTouchEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Top Bar: Counter + Close */}
          <div className="gallery-lightbox__top">
            <span className="gallery-lightbox__counter">
              {formatIndex(lightboxIndex + 1)} / {formatIndex(totalOriginal)}
            </span>
            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeLightbox}
              aria-label={t("gallery.close")}
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            className="gallery-lightbox__arrow gallery-lightbox__arrow--prev"
            onClick={prevLightbox}
            aria-label={t("gallery.prev")}
          >
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            className="gallery-lightbox__arrow gallery-lightbox__arrow--next"
            onClick={nextLightbox}
            aria-label={t("gallery.next")}
          >
            <ArrowRight size={24} strokeWidth={1.5} />
          </button>

          {/* Lightbox Content Container */}
          <div className="gallery-lightbox__center">
            <div className="gallery-lightbox__media-wrap">
              <img
                src={GALLERY_ARCHIVE[lightboxIndex].src}
                alt={GALLERY_ARCHIVE[lightboxIndex].alt}
                className="gallery-lightbox__img"
              />
            </div>

            <div className="gallery-lightbox__meta">
              <span className="gallery-lightbox__tag">
                {GALLERY_ARCHIVE[lightboxIndex][`tag_${lang}`] || GALLERY_ARCHIVE[lightboxIndex].tag}
              </span>
              <h3 className="gallery-lightbox__title">
                {GALLERY_ARCHIVE[lightboxIndex][`title_${lang}`] || GALLERY_ARCHIVE[lightboxIndex].title}
              </h3>
              <p className="gallery-lightbox__desc">
                {GALLERY_ARCHIVE[lightboxIndex][`desc_${lang}`] || GALLERY_ARCHIVE[lightboxIndex].desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
