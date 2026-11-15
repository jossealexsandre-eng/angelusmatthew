import Reveal from "./Reveal.jsx";

export default function SectionHead({ title, accent, lead }) {
  return (
    <Reveal className="section__head">
      <div className="section__heading-row">
        <h2>{[title, accent].filter(Boolean).join(" ")}</h2>
        {lead && <p className="section__lead">{lead}</p>}
      </div>
    </Reveal>
  );
}
