import { useEffect, useRef, useState } from "react";

const hasIO = typeof window !== "undefined" && "IntersectionObserver" in window;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True saat elemen pertama kali masuk viewport (sekali saja). */
export function useInView(options = {}) {
  const { threshold = 0.12, rootMargin = "0px 0px -40px 0px" } = options;
  const ref = useRef(null);
  const [seen, setSeen] = useState(!hasIO);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasIO) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, seen];
}

/** Angka naik dari 0 ke target saat `active` true. */
export function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    if (prefersReducedMotion()) {
      setValue(target);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

/** Mengembalikan [active, setManualActive] untuk section yang sedang terlihat atau di-klik. */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);
  const key = ids.join("|");

  const setManualActive = (id) => {
    setActive(id);
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 900);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isClickingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // At top of page -> Home
      if (scrollY < 80) {
        setActive(ids[0]);
        return;
      }

      // At bottom of page -> Contact
      if (windowHeight + scrollY >= docHeight - 80) {
        setActive(ids[ids.length - 1]);
        return;
      }

      // Check section bounding rects
      const offsetMargin = 120;
      let currentId = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetMargin) {
            currentId = id;
          }
        }
      }

      setActive(currentId);
    };

    let rafId = 0;
    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = 0;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [active, setManualActive];
}

/** Posisi scroll Y (di-throttle lewat rAF). */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setY(window.scrollY);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return y;
}
