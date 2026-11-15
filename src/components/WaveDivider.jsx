export default function WaveDivider() {
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg
        className="wave-divider__canvas"
        viewBox="0 0 1440 45"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Single smooth, shallow, asymmetrical wave (#F4EFE5) */}
        <path
          d="M 0,22
             C 260,22 420,40 680,40
             C 920,40 1060,4 1220,4
             C 1315,4 1390,12 1440,16
             L 1440,45 L 0,45 Z"
          fill="#F4EFE5"
        />
      </svg>
    </div>
  );
}
