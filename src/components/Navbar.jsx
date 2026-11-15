import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X, Sun, Moon, ChevronDown, Check, FileDown } from "lucide-react";
import { NAV_LINKS } from "../data.js";
import { useScrollSpy, useScrollY } from "../hooks.js";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const trigger = useRef(null);
  const panel = useRef(null);
  const langDropdownRef = useRef(null);
  const mobileLangRef = useRef(null);
  const y = useScrollY();
  const [active, setActive] = useScrollSpy(NAV_LINKS.map((link) => link.id));
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const closeMenu = (immediate = false) => {
    setLangOpen(false);
    setMobileLangOpen(false);

    if (immediate) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsClosing(false);
      setOpen(false);
      return;
    }

    if (!open || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 280);
  };

  const openMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setOpen(true);
  };

  const toggleMenu = () => {
    if (open && !isClosing) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setActive(id);
    closeMenu();

    const element = document.getElementById(id);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - navHeight);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${id}`);
    }
  };

  // Close desktop language dropdown on outside click or Escape
  useEffect(() => {
    if (!langOpen) return;

    const handleOutsideClick = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [langOpen]);

  // Close mobile language dropdown on outside click or Escape
  useEffect(() => {
    if (!mobileLangOpen) return;

    const handleOutsideClick = (e) => {
      if (mobileLangRef.current && !mobileLangRef.current.contains(e.target)) {
        setMobileLangOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileLangOpen]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Handle mobile drawer lock and Escape key
  useEffect(() => {
    if (!open && !isClosing) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (open && !isClosing) {
      panel.current?.querySelector("a")?.focus();
    }

    const onKey = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        trigger.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1160) {
        closeMenu(true);
      }
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, isClosing]);

  const selectLanguage = (selectedLang) => {
    setLang(selectedLang);
    setLangOpen(false);
    setMobileLangOpen(false);
  };

  return (
    <>
      <a className="skip-link" href="#home" onClick={(e) => handleNavClick(e, "home")}>
        {t("nav.skip")}
      </a>

      <header className={`nav ${y > 30 ? "is-scrolled" : ""}`}>
        {/* Signature Logo */}
        <a
          href="#home"
          className="nav__logo"
          aria-label="Matthew"
          onClick={(e) => handleNavClick(e, "home")}
        >
          <img
            src="/logo-burgundy.png"
            alt="Matthew"
            className="nav__logo-img nav__logo-img--burgundy"
            width={116}
            height={32}
            loading="eager"
          />
          <img
            src="/logo-cream.png"
            alt="Matthew"
            className="nav__logo-img nav__logo-img--cream"
            width={116}
            height={32}
            loading="eager"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav__menu" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            const labelKey = `nav.${link.id}`;
            const label = t(labelKey, link.label);
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav__link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls: Theme Toggle, Language Switcher, CTA */}
        <div className="nav__actions">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
            title={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
          >
            <span
              className={`theme-toggle__icon ${theme === "light" ? "is-active" : ""}`}
              aria-hidden="true"
            >
              <Sun size={13} strokeWidth={2} />
            </span>
            <span
              className={`theme-toggle__icon ${theme === "dark" ? "is-active" : ""}`}
              aria-hidden="true"
            >
              <Moon size={13} strokeWidth={2} />
            </span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="lang-selector-wrapper" ref={langDropdownRef}>
            <button
              type="button"
              className="lang-trigger"
              onClick={() => setLangOpen((prev) => !prev)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label={t("lang.select")}
            >
              <span>{lang.toUpperCase()}</span>
              <ChevronDown size={12} className={`lang-trigger__chevron ${langOpen ? "is-open" : ""}`} />
            </button>

            {langOpen && (
              <div className="lang-dropdown" role="listbox" aria-label={t("lang.select")}>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === "id"}
                  className={`lang-dropdown__item ${lang === "id" ? "is-active" : ""}`}
                  onClick={() => selectLanguage("id")}
                >
                  <span>Indonesia (ID)</span>
                  {lang === "id" && <Check size={13} strokeWidth={2.2} />}
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === "en"}
                  className={`lang-dropdown__item ${lang === "en" ? "is-active" : ""}`}
                  onClick={() => selectLanguage("en")}
                >
                  <span>English (EN)</span>
                  {lang === "en" && <Check size={13} strokeWidth={2.2} />}
                </button>
              </div>
            )}
          </div>

          {/* Download CV Button right beside Contact */}
          <a
            href="/Matthew_Filbert_Angelus_CV.pdf"
            download="Matthew_Filbert_Angelus_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nav__cv-btn"
            aria-label={t("nav.downloadCv", "Download CV")}
            title={t("nav.downloadCv", "Download CV (PDF)")}
          >
            <FileDown size={13} strokeWidth={2} className="nav__cv-icon" />
            <span>{t("nav.downloadCv", "Download CV")}</span>
          </a>

          {/* CTA Pill Button */}
          <a
            href="#contact"
            className="nav__cta"
            onClick={(e) => handleNavClick(e, "contact")}
          >
            <span>{t("nav.cta")}</span>
            <ArrowUpRight size={13} strokeWidth={2} />
          </a>

          {/* Hamburger Mobile Toggle (Animated Three-Bar) */}
          <button
            ref={trigger}
            className={`nav__toggle ${open && !isClosing ? "is-active" : ""}`}
            aria-label={open && !isClosing ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open && !isClosing}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <span className="nav__toggle-icon" aria-hidden="true">
              <span className="nav__toggle-bar nav__toggle-bar--top" />
              <span className="nav__toggle-bar nav__toggle-bar--mid" />
              <span className="nav__toggle-bar nav__toggle-bar--bot" />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {open && (
        <div
          ref={panel}
          id="mobile-menu"
          className={`mobile-menu ${isClosing ? "is-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menuTitle")}
        >
          {/* Top Header: MA Logo (Left) | Theme Toggle, Language Switcher, Close (Right) */}
          <div className="mobile-menu__header">
            <a
              href="#home"
              className="mobile-menu__logo"
              aria-label="Matthew"
              onClick={(e) => handleNavClick(e, "home")}
            >
              <img
                src="/logo-burgundy.png"
                alt="Matthew"
                className="nav__logo-img nav__logo-img--burgundy"
                width={105}
                height={29}
                loading="eager"
              />
              <img
                src="/logo-cream.png"
                alt="Matthew"
                className="nav__logo-img nav__logo-img--cream"
                width={105}
                height={29}
                loading="eager"
              />
            </a>

            <div className="mobile-menu__header-actions">
              {/* Dark / Light Mode Toggle Button */}
              <button
                type="button"
                className="mobile-menu__icon-btn"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
                title={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
              >
                {theme === "dark" ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
              </button>

              {/* Language Switcher Dropdown */}
              <div className="mobile-menu__lang-wrapper" ref={mobileLangRef}>
                <button
                  type="button"
                  className="mobile-menu__lang-trigger"
                  onClick={() => setMobileLangOpen((prev) => !prev)}
                  aria-expanded={mobileLangOpen}
                  aria-haspopup="listbox"
                  aria-label={t("lang.select")}
                >
                  <span>{lang.toUpperCase()}</span>
                  <ChevronDown
                    size={12}
                    className={`lang-trigger__chevron ${mobileLangOpen ? "is-open" : ""}`}
                  />
                </button>

                {mobileLangOpen && (
                  <div
                    className="mobile-menu__lang-dropdown"
                    role="listbox"
                    aria-label={t("lang.select")}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === "id"}
                      className={`mobile-menu__lang-item ${lang === "id" ? "is-active" : ""}`}
                      onClick={() => selectLanguage("id")}
                    >
                      <span>Indonesia (ID)</span>
                      {lang === "id" && <Check size={13} strokeWidth={2.2} />}
                    </button>
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === "en"}
                      className={`mobile-menu__lang-item ${lang === "en" ? "is-active" : ""}`}
                      onClick={() => selectLanguage("en")}
                    >
                      <span>English (EN)</span>
                      {lang === "en" && <Check size={13} strokeWidth={2.2} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button (X) */}
              <button
                type="button"
                className="mobile-menu__icon-btn mobile-menu__close-btn"
                aria-label={t("nav.closeMenu")}
                onClick={() => {
                  closeMenu();
                  trigger.current?.focus();
                }}
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Scrollable Content: Links, LET'S TALK button, and Footer */}
          <div className="mobile-menu__content">
            <nav className="mobile-menu__links" aria-label="Navigasi mobile">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                const labelKey = `nav.${link.id}`;
                const label = t(labelKey, link.label);
                return (
                  <a
                    href={`#${link.id}`}
                    key={link.id}
                    className={`mobile-menu__link ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => handleNavClick(e, link.id)}
                  >
                    <span>{label}</span>
                    <ArrowUpRight size={15} className="mobile-menu__link-arrow" />
                  </a>
                );
              })}
            </nav>

            {/* Download CV in Mobile Drawer */}
            <a
              href="/Matthew_Filbert_Angelus_CV.pdf"
              download="Matthew_Filbert_Angelus_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu__cv-btn"
              onClick={() => closeMenu()}
            >
              <FileDown size={14} strokeWidth={2} />
              <span>{t("nav.downloadCvFull", "Download CV (PDF)")}</span>
            </a>

            {/* Primary CTA Button */}
            <a
              href="#contact"
              className="mobile-menu__cta-btn"
              onClick={(e) => handleNavClick(e, "contact")}
            >
              <span>{t("nav.cta")}</span>
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>

            {/* Subtle Footer */}
            <div className="mobile-menu__footer">
              <span>Matthew Filbert Angelus</span>
              <span>{t("nav.location", "Bandung, Indonesia")}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
