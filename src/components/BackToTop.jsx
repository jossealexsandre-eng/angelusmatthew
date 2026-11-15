import { ArrowUp } from "lucide-react";
import { prefersReducedMotion, useScrollY } from "../hooks.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function BackToTop() {
  const y = useScrollY();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className={`to-top ${y > 600 ? "is-visible" : ""}`}
      aria-label={t("backToTop.aria")}
      tabIndex={y > 600 ? 0 : -1}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "instant" : "smooth",
        })
      }
    >
      <ArrowUp size={19} />
    </button>
  );
}
