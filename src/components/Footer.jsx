import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "../data.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wordmark" aria-hidden="true">
          Matthew.
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {PROFILE.fullName}</p>
          <p>{t("footer.tagline")}</p>
          <a href="#home">
            {t("footer.backToTop")} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
