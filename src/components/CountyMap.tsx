import { useId, useState } from "react";
import { Link } from "react-router-dom";
import boundaries from "../data/boundaries.json";
import { countyData, formatRate, rateColor } from "../lib/data";
export function CountyMap({
  compact = false,
  dimensional = false,
}: {
  compact?: boolean;
  dimensional?: boolean;
}) {
  const [active, setActive] = useState<string | null>(null);
  const uid = useId();
  return (
    <div
      className={`county-map ${compact ? "compact-map" : ""} ${dimensional ? "dimensional-map" : ""}`}
    >
      <svg
        viewBox={boundaries.viewBox}
        aria-labelledby={`${uid}-title ${uid}-desc`}
      >
        <title id={`${uid}-title`}>
          Maryland county firearm fatality rates
        </title>
        <desc id={`${uid}-desc`}>
          Published five-year rates for 2019 to 2023. Select a county to read
          its report. The county list below the full map provides the same
          information.
        </desc>
        {boundaries.counties.map((c) => (
          <a
            key={c.id}
            href={`#/report/${c.id}`}
            aria-label={`${countyData[c.id].name}: ${formatRate(countyData[c.id].rate)}${countyData[c.id].rate === null ? "" : " deaths per 100,000"}. View county report.`}
            onFocus={() => setActive(c.id)}
            onBlur={() => setActive(null)}
            onMouseEnter={() => setActive(c.id)}
            onMouseLeave={() => setActive(null)}
          >
            <path
              d={c.path}
              fill={rateColor(countyData[c.id].rate)}
              className={
                active === c.id ? "county-shape selected" : "county-shape"
              }
            >
              <title>
                {countyData[c.id].name} · {formatRate(countyData[c.id].rate)}
              </title>
            </path>
          </a>
        ))}
      </svg>
      <div className="map-readout" aria-live="polite">
        {active ? (
          <>
            <strong>{countyData[active].name}</strong>
            <span>
              {formatRate(countyData[active].rate)}
              {countyData[active].rate !== null ? " per 100,000" : ""}
            </span>
          </>
        ) : (
          <>
            <strong>Every county. Every community.</strong>
            <span>Select a county to explore</span>
          </>
        )}
      </div>
      {!compact && (
        <>
          <div className="map-legend" aria-label="Map color legend">
            {[
              ["#b8d9c3", "Up to 8"],
              ["#79b0bb", "8.1–16"],
              ["#2d7898", "16.1–24"],
              ["#123f61", "Over 24"],
              ["#dce6eb", "Suppressed"],
            ].map(([color, label]) => (
              <span key={label}>
                <i style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
          <p className="fine-print">
            Deaths per 100,000 people, 2019–2023. Colors group published rates;
            they are not personal risk ratings. Boundaries: State of Maryland /
            MD iMAP. <Link to="/sources">Methodology</Link>
          </p>
        </>
      )}
    </div>
  );
}
