import { useState } from "react";
import { useInView } from "../hooks.js";

/** Pembungkus animasi fade-up saat masuk viewport. */
export default function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, seen] = useInView();
  const [settled, setSettled] = useState(false);

  // Delay stagger hanya dipakai untuk animasi masuk, lalu dilepas
  // supaya efek hover tidak ikut tertunda.
  const style = delay && !settled ? { transitionDelay: `${Math.min(delay, 360)}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={`reveal ${seen ? "is-visible" : ""} ${className}`.trim()}
      style={style}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "opacity") setSettled(true);
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
