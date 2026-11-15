import { useEffect } from "react";

// Update scroll effects once per frame without triggering React renders.
export default function ScrollMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      const distance = root.scrollHeight - height;
      root.style.setProperty("--page-progress", distance > 0 ? window.scrollY / distance : 0);
      document.querySelectorAll("[data-scroll-scene]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -height || rect.top > height * 2) return;
        const progress = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
        element.style.setProperty("--scene", preference.matches ? 0.5 : progress);
        const words = element.querySelectorAll("[data-word]");
        const reading = Math.max(0, Math.min(1, (height * 0.85 - rect.top) / (height * 0.65)));
        words.forEach((word, index) => word.classList.toggle("is-read", preference.matches || index / words.length < reading));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
      root.style.removeProperty("--page-progress");
    };
  }, []);
  return <div className="reading-progress" aria-hidden="true" />;
}

