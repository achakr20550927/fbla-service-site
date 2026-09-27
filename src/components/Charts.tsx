import { stateTrend, PLAN_URL } from "../lib/data";

type TrendPoint = {
  year: number;
  total: number;
  homicide: number;
  suicide: number;
};

export function CountyTrendChart({
  data,
  county,
}: {
  data: TrendPoint[];
  county: string;
}) {
  const width = 760;
  const height = 300;
  const left = 46;
  const bottom = 254;
  const maximum = Math.max(...data.map((item) => item.total), 10) * 1.12;
  const x = (index: number) =>
    left + index * ((width - 88) / (data.length - 1));
  const y = (value: number) => bottom - (value / maximum) * 205;
  const points = data
    .map((item, index) => `${x(index)},${y(item.total)}`)
    .join(" ");
  return (
    <figure className="trend-chart county-trend-card">
      <figcaption>
        <div>
          <span className="chart-label">MODELED PREVIEW</span>
          <h3>Five-year pattern</h3>
        </div>
        <strong>{data.at(-1)?.total.toFixed(1)}</strong>
      </figcaption>
      <p>
        Interface-preview trend scaled from Maryland’s published pattern.
        Replace with county dashboard exports before publication.
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Modeled five-year firearm fatality pattern for ${county}`}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const value = maximum * step;
          return (
            <g key={step}>
              <line
                x1={left}
                x2={width - 34}
                y1={y(value)}
                y2={y(value)}
                stroke="#dbe4e8"
              />
              <text x="34" y={y(value) + 4} textAnchor="end">
                {value.toFixed(0)}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26769a" stopOpacity=".28" />
            <stop offset="100%" stopColor="#26769a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${x(0)},${bottom} ${points} ${x(data.length - 1)},${bottom}`}
          fill="url(#area-fill)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#1b6386"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((item, index) => (
          <g key={item.year}>
            <circle
              cx={x(index)}
              cy={y(item.total)}
              r="5"
              fill="#fff"
              stroke="#1b6386"
              strokeWidth="3"
            >
              <title>
                {item.year}: {item.total.toFixed(1)} per 100,000
              </title>
            </circle>
            <text x={x(index)} y="286" textAnchor="middle">
              {item.year}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

export function DistributionBars({
  title,
  data,
  tone = "blue",
}: {
  title: string;
  data: { label: string; percentage: number }[];
  tone?: "blue" | "green" | "gold";
}) {
  return (
    <section className={`distribution-card tone-${tone}`}>
      <div className="distribution-heading">
        <h3>{title}</h3>
        <span>Modeled</span>
      </div>
      <div className="distribution-list">
        {data.map((item) => (
          <div key={item.label} className="distribution-row">
            <div>
              <span>{item.label}</span>
              <strong>{item.percentage}%</strong>
            </div>
            <i>
              <b style={{ width: `${item.percentage}%` }} />
            </i>
          </div>
        ))}
      </div>
    </section>
  );
}
export function StateTrendChart() {
  const width = 720,
    height = 270,
    left = 40,
    bottom = 230;
  const x = (i: number) => left + i * 158;
  const y = (v: number) => bottom - (v / 18) * 200;
  const series = [
    { key: "total" as const, label: "All firearm deaths", color: "#a94b28" },
    { key: "homicide" as const, label: "Homicide", color: "#3c5351" },
    { key: "suicide" as const, label: "Suicide", color: "#9a762e" },
  ];
  return (
    <figure className="trend-chart">
      <figcaption>
        <h3>Maryland over time</h3>
        <p>
          Annual firearm fatality rates per 100,000 people, 2019–2023. Statewide
          figures, not county trends.
        </p>
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Maryland firearm death rates increased to 15.23 in 2021, then declined to 12.31 in 2023. Full values are in the table below."
      >
        {[0, 5, 10, 15].map((v) => (
          <g key={v}>
            <line x1={left} x2="680" y1={y(v)} y2={y(v)} stroke="#e5e5df" />
            <text x="20" y={y(v) + 4} textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        {series.map((s) => (
          <g key={s.key}>
            <polyline
              points={stateTrend
                .map((d, i) => `${x(i)},${y(d[s.key])}`)
                .join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
            />
            {stateTrend.map((d, i) => (
              <circle
                key={d.year}
                cx={x(i)}
                cy={y(d[s.key])}
                r="4"
                fill={s.color}
              >
                <title>
                  {d.year} {s.label}: {d[s.key]}
                </title>
              </circle>
            ))}
          </g>
        ))}
        {stateTrend.map((d, i) => (
          <text key={d.year} x={x(i)} y="258" textAnchor="middle">
            {d.year}
          </text>
        ))}
      </svg>
      <div className="chart-legend">
        {series.map((s) => (
          <span key={s.key}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <details className="chart-values">
        <summary>View the data table</summary>
        <div className="table-scroll">
          <table>
            <caption>Maryland firearm fatality rates per 100,000</caption>
            <thead>
              <tr>
                <th scope="col">Year</th>
                {series.map((s) => (
                  <th scope="col" key={s.key}>
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stateTrend.map((d) => (
                <tr key={d.year}>
                  <th scope="row">{d.year}</th>
                  {series.map((s) => (
                    <td key={s.key}>{d[s.key].toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className="fine-print">
        Source:{" "}
        <a href={`${PLAN_URL}#page=15`} target="_blank" rel="noreferrer">
          MDH preliminary state plan, printed page 12
        </a>
        . Categories shown do not necessarily sum to all firearm deaths.
      </p>
    </figure>
  );
}
