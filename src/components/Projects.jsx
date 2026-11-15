import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Layers, X } from "lucide-react";
import { PROJECTS, PROJECT_FILTERS } from "../data.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";

// 4 Verified featured certificates prioritized on initial view
const FEATURED_CERT_IDS = [
  "cerdas-hukum-2026",
  "volunteer-amgala-2026",
  "webinar-law-connect-2026",
  "kuliah-umum-ham-2025",
];

// Pre-order collection so the 4 featured certificates appear first
const PRIORITIZED_PROJECTS = [
  ...FEATURED_CERT_IDS.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean),
  ...PROJECTS.filter((p) => !FEATURED_CERT_IDS.includes(p.id)),
];

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const { lang, t } = useLanguage();

  useEffect(() => {
    setActivePageIndex(0);
  }, [project]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!dialog.open) {
      dialog.showModal();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [onClose]);

  const hasPages = Array.isArray(project.pages) && project.pages.length > 1;
  const currentImage = hasPages ? project.pages[activePageIndex].src : project.image;
  const pageLabel = hasPages
    ? (project.pages[activePageIndex][`label_${lang}`] || project.pages[activePageIndex].label)
    : "";
  const currentAlt = hasPages ? `${project.title} - ${pageLabel}` : project.title;

  const categoryLabel = project[`categoryLabel_${lang}`] || project.categoryLabel;
  const description = project[`desc_${lang}`] || project.desc;
  const roleLabel = project[`role_${lang}`] || project.role;

  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="cert-dialog-title"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="project-dialog__inner">
        <button
          className="dialog-close"
          aria-label={t("projects.dialog.close")}
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="project-dialog__header">
          <p className="project-dialog__eyebrow">
            {categoryLabel} · {project.year}
          </p>
          <h2 id="cert-dialog-title">{project.title}</h2>
          <p className="project-dialog__issuer">
            {t("projects.dialog.issuedBy")} <strong>{project.issuer}</strong>
          </p>
        </div>

        <div className="project-dialog__media-wrap">
          <img
            src={currentImage}
            alt={currentAlt}
            className="project-dialog__img"
          />

          {hasPages && (
            <div className="project-dialog__page-tabs" role="tablist" aria-label="Halaman sertifikat">
              {project.pages.map((p, idx) => {
                const label = p[`label_${lang}`] || p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    role="tab"
                    aria-selected={activePageIndex === idx}
                    className={`project-dialog__page-tab ${activePageIndex === idx ? "is-active" : ""}`}
                    onClick={() => setActivePageIndex(idx)}
                  >
                    <Layers size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="project-dialog__details">
          <p className="project-dialog__desc">{description}</p>

          <div className="project-dialog__meta-grid">
            <div className="project-dialog__meta-item">
              <span>{t("projects.dialog.issuer")}</span>
              <strong>{project.issuer}</strong>
            </div>

            {project.date && (
              <div className="project-dialog__meta-item">
                <span>{t("projects.dialog.date")}</span>
                <strong>{project.date}</strong>
              </div>
            )}

            {roleLabel && (
              <div className="project-dialog__meta-item">
                <span>{t("projects.dialog.role")}</span>
                <strong>{roleLabel}</strong>
              </div>
            )}

            {project.certNumber && (
              <div className="project-dialog__meta-item">
                <span>{t("projects.dialog.regNum")}</span>
                <strong>{project.certNumber}</strong>
              </div>
            )}
          </div>

          <div className="tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const lastTriggerRef = useRef(null);
  const { lang, t } = useLanguage();

  const isAll = filter === "all";
  const allFiltered = isAll
    ? PRIORITIZED_PROJECTS
    : PROJECTS.filter((project) => project.cat === filter);

  // Show only 4 initially if more than 4 items exist and not expanded
  const shouldShowToggle = allFiltered.length > 4;
  const visibleItems = shouldShowToggle && !expanded
    ? allFiltered.slice(0, 4)
    : allFiltered;

  const handleFilterChange = (key) => {
    setFilter(key);
    setExpanded(false);
  };

  const handleToggleExpand = () => {
    if (expanded) {
      setExpanded(false);
      // Smoothly return user to the top of the Projects gallery
      const section = document.getElementById("projects");
      if (section) {
        const offset = -75;
        const target = section.getBoundingClientRect().top + window.pageYOffset + offset;
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    } else {
      setExpanded(true);
    }
  };

  const handleOpenModal = (project, e) => {
    lastTriggerRef.current = e?.currentTarget || null;
    setSelected(project);
  };

  const handleCloseModal = () => {
    setSelected(null);
    setTimeout(() => {
      lastTriggerRef.current?.focus();
    }, 40);
  };

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <SectionHead
          eyebrow={t("projects.eyebrow")}
          title={t("projects.title")}
          lead={t("projects.lead")}
        />

        <div className="projects__toolbar">
          <div className="filters" role="group" aria-label="Filter kategori sertifikat">
            {PROJECT_FILTERS.map((item) => {
              const label = t(`projects.filter.${item.key}`, item.label);
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`filter ${filter === item.key ? "is-active" : ""}`}
                  aria-pressed={filter === item.key}
                  onClick={() => handleFilterChange(item.key)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span className="project-count" role="status">
            {isAll && !expanded && allFiltered.length > 4
              ? `4 / ${allFiltered.length} ${t("projects.counter")}`
              : `${allFiltered.length} ${t("projects.counter")}`}
          </span>
        </div>

        <div className="projects" key={filter}>
          {visibleItems.map((project, index) => {
            const categoryLabel = (project[`categoryLabel_${lang}`] || project.categoryLabel || "").toUpperCase();
            const isNewlyRevealed = expanded && index >= 4;

            return (
              <Reveal
                as="article"
                className={`project project--${project.cat} ${isNewlyRevealed ? "project--fade-in" : ""}`}
                key={project.id || project.title}
                delay={(index % 2) * 80}
              >
                {/* Clean Certificate Image Thumbnail */}
                <button
                  type="button"
                  className="project__cover"
                  onClick={(e) => handleOpenModal(project, e)}
                  aria-label={`${t("projects.cardAria")} ${project.title}`}
                >
                  <div className="project__cert-wrap">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="project__cert-img"
                    />
                    <span className="project__open" aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </button>

                {/* Minimalist Card Body */}
                <div className="project__body">
                  <div className="project__meta-header">
                    <span className="project__index-cat">
                      {String(index + 1).padStart(2, "0")} / {categoryLabel}
                    </span>
                  </div>

                  <h3>
                    <button
                      type="button"
                      onClick={(e) => handleOpenModal(project, e)}
                    >
                      {project.title}
                    </button>
                  </h3>

                  <p className="project__issuer-line">
                    {project.issuer} · {project.year}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* View All / Show Less Toggle Button */}
        {shouldShowToggle && (
          <div className="projects__view-more-wrap">
            <button
              type="button"
              className="btn-cert-toggle"
              onClick={handleToggleExpand}
              aria-expanded={expanded}
            >
              <span>{expanded ? t("projects.showLess") : t("projects.viewAll")}</span>
              {expanded ? (
                <ArrowUp size={14} className="btn-cert-toggle__icon" />
              ) : (
                <ArrowUpRight size={14} className="btn-cert-toggle__icon" />
              )}
            </button>
          </div>
        )}

        <p className="sample-note">
          {t("projects.viewHint")}
        </p>
      </div>

      {selected && (
        <ProjectDialog
          project={selected}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
