import { stateTrend, PLAN_URL } from "../lib/data";
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
