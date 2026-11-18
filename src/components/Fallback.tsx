export default function Fallback({ reason }: { reason: string }) {
  return (
    <div className="fallback">
      <svg
        viewBox="0 0 1000 700"
        role="img"
        aria-label="Line drawing of a forest atelier with an arched window and a sketchbook"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M80 650V230Q80 20 200 0M920 650V230Q920 20 800 0M100 620H900M200 600V210Q500 -80 800 210V600M320 460V230Q500 20 680 230V460ZM500 120V460M320 310H680M250 530H750M290 530V620M710 530V620M400 520L490 480L590 505L500 550Z M490 480V525M500 550V525L590 505" />
          <path d="M120 600Q40 400 160 350Q250 450 120 600M840 600Q740 400 860 350Q950 450 840 600" />
          <circle cx="500" cy="310" r="105" strokeDasharray="3 9" />
        </g>
      </svg>
      <p>{reason} All exhibitions and professional information remain available below.</p>
    </div>
  );
}
