import { useState } from "react";
import { ArrowUpRight, FileDown, Mail, MessageSquare } from "lucide-react";
import { CONTACT } from "../data.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Reveal from "./Reveal.jsx";

function LinkedinIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useLanguage();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState(null);

  const validate = (v) => {
    if (!v.name.trim()) return { field: "name", msg: t("contact.valName") };
    if (!EMAIL_RE.test(v.email.trim())) return { field: "email", msg: t("contact.valEmail") };
    if (v.message.trim().length < 10) return { field: "message", msg: t("contact.valMsg") };
    return null;
  };

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const err = validate(values);
    setError(err);
    if (err) {
      e.currentTarget.elements.namedItem(err.field)?.focus();
      return;
    }

    const subject = encodeURIComponent(`Pesan dari Portfolio — ${values.name.trim()}`);
    const body = encodeURIComponent(
      `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setValues({ name: "", email: "", message: "" });
  };

  const contactMethods = [
    {
      id: "email",
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      ext: false,
      icon: Mail,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: CONTACT.whatsappLabel,
      href: `https://wa.me/${CONTACT.whatsappNumber}`,
      ext: true,
      icon: MessageSquare,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "Matthew Angelus",
      href: CONTACT.linkedinUrl,
      ext: true,
      icon: LinkedinIcon,
    },
    {
      id: "instagram",
      label: "Instagram",
      value: CONTACT.instagramLabel,
      href: CONTACT.instagramUrl,
      ext: true,
      icon: InstagramIcon,
    },
  ];

  const bad = (f) => (error?.field === f ? "is-invalid" : "");

  return (
    <section className="section section--light" id="contact">
      <div className="container contact">
        {/* Left Editorial Info */}
        <Reveal className="contact__info">
          <p className="eyebrow">{t("contact.eyebrow")}</p>
          <h2>{t("contact.heading")}</h2>
          <span className="divider" />
          <p>{t("contact.lead")}</p>

          <ul className="contact__list">
            {contactMethods.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.id} className="contact__item">
                  <span>{c.label}</span>
                  <a
                    href={c.href}
                    className="contact__link"
                    {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span>{c.value}</span>
                    <ArrowUpRight size={13} className="contact__link-arrow" />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Clean Download CV Box */}
          <div className="contact__cv">
            <span className="contact__cv-label">{t("contact.cvLabel", "BERKAS RESMI")}</span>
            <div className="contact__cv-action">
              <a
                href="/Matthew_Filbert_Angelus_CV.pdf"
                download="Matthew_Filbert_Angelus_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__cv-btn"
                aria-label={t("contact.downloadCv", "Download CV (PDF)")}
              >
                <FileDown size={14} strokeWidth={2} />
                <span>{t("contact.downloadCv", "Download CV (PDF)")}</span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Right Contact Form */}
        <Reveal as="form" className="form" delay={120} onSubmit={onSubmit} noValidate>
          <h3>{t("contact.formTitle")}</h3>

          <label>
            {t("contact.nameLabel")}
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder={t("contact.namePlaceholder")}
              value={values.name}
              onChange={onChange}
              className={bad("name")}
              aria-invalid={error?.field === "name"}
              required
            />
          </label>

          <label>
            {t("contact.emailLabel")}
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t("contact.emailPlaceholder")}
              value={values.email}
              onChange={onChange}
              className={bad("email")}
              aria-invalid={error?.field === "email"}
              required
            />
          </label>

          <label>
            {t("contact.messageLabel")}
            <textarea
              name="message"
              rows="5"
              placeholder={t("contact.messagePlaceholder")}
              value={values.message}
              onChange={onChange}
              className={bad("message")}
              aria-invalid={error?.field === "message"}
              required
            />
          </label>

          {error && (
            <p className="form__error" role="alert">
              {error.msg}
            </p>
          )}

          <button type="submit" className="btn btn--burgundy">
            {t("contact.submit")}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
