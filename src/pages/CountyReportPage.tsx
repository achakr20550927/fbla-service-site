import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Download,
  HeartHandshake,
  HeartPulse,
  Landmark,
  LockKeyhole,
  MapPin,
  MessageCircleWarning,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  countyProfiles,
  getCountyResources,
  formatRate,
  STATE_RATE,
  PLAN_URL,
  DATA_PERIOD,
  DASHBOARD_URL,
  CENSUS_POPULATION_URL,
  SAIPE_URL,
} from "../lib/data";
import { CountyTrendChart, DistributionBars } from "../components/Charts";

const number = new Intl.NumberFormat("en-US");
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const actionPathways = [
  {
    id: "crisis",
    label: "Urgent concern",
    eyebrow: "When safety may be at risk",
    title: "Get immediate support.",
    summary:
      "Use the fastest appropriate response when someone may harm themselves or another person.",
    steps: [
      "Call 911 when there is immediate danger or an active emergency.",
      "Call or text 988 for confidential crisis support and guidance.",
      "Stay with the person when it is safe to do so and reduce access to lethal means.",
    ],
  },
  {
    id: "storage",
    label: "Safe storage",
    eyebrow: "A practical prevention step",
    title: "Create time and distance from harm.",
    summary:
      "Secure storage can help prevent unauthorized access, theft, unintentional injury, and harm during a crisis.",
    steps: [
      "Store firearms locked and unloaded when they are not in use.",
      "Keep ammunition secured separately and control access to keys or combinations.",
      "Use a local lock-distribution program or verified safety-kit locator.",
    ],
  },
  {
    id: "recovery",
    label: "After violence",
    eyebrow: "Support for people and families",
    title: "Make recovery easier to reach.",
    summary:
      "Survivors, witnesses, families, and neighbors may need different combinations of medical, emotional, legal, and practical support.",
    steps: [
      "Connect with a trauma-informed counselor or survivor-support organization.",
      "Ask a hospital team about violence-intervention and follow-up services.",
      "Use 211 Maryland to locate food, housing, transportation, and family support.",
    ],
  },
  {
    id: "community",
    label: "Community action",
    eyebrow: "Longer-term prevention",
    title: "Turn local knowledge into coordinated action.",
    summary:
      "Schools, health departments, families, and community organizations can reinforce one another instead of working separately.",
    steps: [
      "Share verified crisis and safe-storage information in trusted community spaces.",
      "Partner with local health, youth, survivor, and violence-intervention organizations.",
      "Track participation, referrals, resources distributed, and changes in community knowledge.",
    ],
  },
] as const;

export function CountyReportPage() {
  const { countyId } = useParams();
  const data = countyId ? countyProfiles[countyId] : null;
  const [status, setStatus] = useState("");
  const [view, setView] = useState<"annual" | "five-year">("annual");
  const [comparisonId, setComparisonId] = useState("");
  const [actionPath, setActionPath] =
    useState<(typeof actionPathways)[number]["id"]>("crisis");
  const available = useMemo(
    () => (data ? getCountyResources(data.id) : []),
    [data],
  );
  const defaultComparisonId = useMemo(() => {
    if (!data) return "";
    const choices = Object.values(countyProfiles).filter(
      (county) => county.id !== data.id && county.rate !== null,
    );
    if (data.rate === null) return choices[0]?.id ?? "";
    return (
      choices.sort(
        (a, b) =>
          Math.abs((a.rate ?? STATE_RATE) - data.rate!) -
          Math.abs((b.rate ?? STATE_RATE) - data.rate!),
      )[0]?.id ?? ""
    );
  }, [data]);

  if (!data)
    return (
      <div className="shell section-space empty-state">
        <h1>County not found.</h1>
        <Link className="button primary" to="/map">
          Browse all counties
        </Link>
      </div>
    );

  async function share() {
    try {
      if (navigator.share)
        await navigator.share({
          title: `${data!.name} · Silence the Violence`,
          url: location.href,
        });
      else {
        await navigator.clipboard.writeText(location.href);
        setStatus("Report link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setStatus(
        "Unable to share automatically. Copy the page address from your browser.",
      );
    }
  }

  const estimated =
    data.estimatedAnnualFatalities === null
      ? null
      : view === "annual"
        ? data.estimatedAnnualFatalities
        : data.estimatedAnnualFatalities * 5;
  const latestModel = data.modeledTrend.at(-1)!;
  const selectedComparison =
    countyProfiles[
      comparisonId && comparisonId !== data.id
        ? comparisonId
        : defaultComparisonId
    ];
  const selectedAction =
    actionPathways.find((path) => path.id === actionPath) ?? actionPathways[0];
  const jumpTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="report-page report-experience">
      <div className="report-hero">
        <div className="shell">
          <Link className="back-link no-print" to="/map">
            <ArrowLeft size={16} /> Maryland county map
          </Link>
          <div className="report-heading">
            <div className="page-heading">
              <p className="eyebrow light-eyebrow">
                COUNTY COMMUNITY PROFILE · {DATA_PERIOD}
              </p>
              <h1>{data.name}</h1>
              <p>
                A detailed planning view of firearm harm, community context,
                people, prevention, and local support.
              </p>
            </div>
            <div className="report-actions no-print">
              <button
                className="button ghost-light"
                onClick={() => window.print()}
              >
                <Download size={16} /> Print report
              </button>
              <button className="button ghost-light" onClick={share}>
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
          <p className="status-message light-status" role="status">
            {status}
          </p>
          <div className="report-scoreboard">
            <article className="score-primary">
              <span>Published firearm fatality rate</span>
              <strong>{formatRate(data.rate)}</strong>
              <small>
                {data.rate === null
                  ? "MDH suppressed the value"
                  : "per 100,000 people"}
              </small>
            </article>
            <article>
              <span>State comparison</span>
              <strong>
                {data.comparisonToState === null
                  ? "—"
                  : `${Math.abs(data.comparisonToState)}%`}
              </strong>
              <small>{data.outlook}</small>
            </article>
            <article>
              <span>Published rank</span>
              <strong>
                {data.publishedRank ? `#${data.publishedRank}` : "—"}
              </strong>
              <small>
                {data.publishedRank ? "of 18 reported rates" : "not ranked"}
              </small>
            </article>
            <article>
              <span>People who live here</span>
              <strong>{number.format(data.population)}</strong>
              <small>2024 Census estimate</small>
            </article>
          </div>
        </div>
      </div>

      <nav className="report-jump-nav no-print" aria-label="Report sections">
        <div className="shell">
          <button onClick={() => jumpTo("overview")}>Overview</button>
          <button onClick={() => jumpTo("compare")}>Compare</button>
          <button onClick={() => jumpTo("patterns")}>Patterns</button>
          <button onClick={() => jumpTo("people")}>People</button>
          <button onClick={() => jumpTo("prevention")}>Prevention</button>
          <button onClick={() => jumpTo("action-plan")}>Take action</button>
          <button onClick={() => jumpTo("support")}>Local support</button>
          <button onClick={() => jumpTo("methodology")}>Methodology</button>
        </div>
      </nav>

      <div className="shell report-body">
        <main>
          <section id="overview" className="report-section">
            <div className="section-intro compact-intro">
              <div>
                <p className="eyebrow">01 / AT A GLANCE</p>
                <h2>One county, several ways to understand the story.</h2>
              </div>
              <p>
                The published rate is the anchor. Census measures add community
                context, while clearly marked models show how richer dashboard
                sections could work.
              </p>
            </div>
            <div className="metric-grid">
              <article className="metric-card highlight-card">
                <MapPin size={19} />
                <span>Estimated fatalities</span>
                <strong>
                  {estimated === null
                    ? "Unavailable"
                    : number.format(estimated)}
                </strong>
                <div className="period-switch" aria-label="Estimate period">
                  <button
                    className={view === "annual" ? "active" : ""}
                    onClick={() => setView("annual")}
                  >
                    Annual
                  </button>
                  <button
                    className={view === "five-year" ? "active" : ""}
                    onClick={() => setView("five-year")}
                  >
                    Five-year
                  </button>
                </div>
                <small>
                  Derived from published rate × 2024 population; planning
                  estimate, not an observed count.
                </small>
              </article>
              <article className="metric-card">
                <Landmark size={19} />
                <span>Median household income</span>
                <strong>{money.format(data.medianHouseholdIncome)}</strong>
                <small>2024 Census SAIPE estimate</small>
              </article>
              <article className="metric-card">
                <Users size={19} />
                <span>People below poverty</span>
                <strong>{data.povertyRate.toFixed(1)}%</strong>
                <small>2024 Census SAIPE estimate</small>
              </article>
              <article className="metric-card">
                <HeartHandshake size={19} />
                <span>Support options</span>
                <strong>{available.length}</strong>
                <small>Local and statewide entries</small>
              </article>
            </div>
            {data.rate !== null && (
              <div className="comparison-stage">
                <div>
                  <span>{data.name}</span>
                  <strong>{data.rate.toFixed(1)}</strong>
                  <i>
                    <b
                      style={{
                        width: `${Math.min(100, (data.rate / 48) * 100)}%`,
                      }}
                    />
                  </i>
                </div>
                <div className="state-comparison">
                  <span>Maryland</span>
                  <strong>{STATE_RATE.toFixed(1)}</strong>
                  <i>
                    <b style={{ width: `${(STATE_RATE / 48) * 100}%` }} />
                  </i>
                </div>
              </div>
            )}
          </section>

          <section id="compare" className="report-section">
            <div className="section-intro compact-intro">
              <div>
                <p className="eyebrow">01B / COUNTY CONTEXT</p>
                <h2>Compare the published picture.</h2>
              </div>
              <p>
                Put the county beside Maryland and another jurisdiction using
                the same published rate period and the same Census context
                measures.
              </p>
            </div>
            <div className="comparison-workbench">
              <div className="compare-toolbar">
                <div>
                  <span className="chart-label">INTERACTIVE COMPARISON</span>
                  <h3>{data.name} in context</h3>
                </div>
                <label>
                  Compare with
                  <select
                    value={selectedComparison?.id ?? ""}
                    onChange={(event) => setComparisonId(event.target.value)}
                  >
                    {Object.values(countyProfiles)
                      .filter((county) => county.id !== data.id)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((county) => (
                        <option key={county.id} value={county.id}>
                          {county.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <div className="compare-rate-grid">
                {[
                  { name: data.name, rate: data.rate, tone: "county" },
                  {
                    name: selectedComparison?.name ?? "Comparison county",
                    rate: selectedComparison?.rate ?? null,
                    tone: "peer",
                  },
                  { name: "Maryland", rate: STATE_RATE, tone: "state" },
                ].map((item) => (
                  <article key={item.name} className={`tone-${item.tone}`}>
                    <span>{item.name}</span>
                    <strong>{formatRate(item.rate)}</strong>
                    <small>firearm deaths per 100,000 · {DATA_PERIOD}</small>
                    <i>
                      <b
                        style={{
                          width: `${Math.min(100, ((item.rate ?? 0) / 48) * 100)}%`,
                        }}
                      />
                    </i>
                  </article>
                ))}
              </div>
              {selectedComparison && (
                <div className="compare-table-wrap">
                  <table className="compare-table">
                    <caption>
                      Community context for {data.name} and{" "}
                      {selectedComparison.name}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Measure</th>
                        <th scope="col">{data.name}</th>
                        <th scope="col">{selectedComparison.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Published fatality rate</th>
                        <td>{formatRate(data.rate)}</td>
                        <td>{formatRate(selectedComparison.rate)}</td>
                      </tr>
                      <tr>
                        <th scope="row">2024 population estimate</th>
                        <td>{number.format(data.population)}</td>
                        <td>{number.format(selectedComparison.population)}</td>
                      </tr>
                      <tr>
                        <th scope="row">People below poverty</th>
                        <td>{data.povertyRate.toFixed(1)}%</td>
                        <td>{selectedComparison.povertyRate.toFixed(1)}%</td>
                      </tr>
                      <tr>
                        <th scope="row">Median household income</th>
                        <td>{money.format(data.medianHouseholdIncome)}</td>
                        <td>
                          {money.format(
                            selectedComparison.medianHouseholdIncome,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <Link
                    className="text-link compare-report-link"
                    to={`/report/${selectedComparison.id}`}
                  >
                    Open {selectedComparison.name} report
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
              <p className="comparison-context-note">
                Community measures provide context; this comparison does not
                establish that income or poverty caused a difference in firearm
                harm.
              </p>
            </div>
          </section>

          <section id="patterns" className="report-section">
            <div className="section-intro compact-intro">
              <div>
                <p className="eyebrow">02 / PATTERNS</p>
                <h2>Trend and intent.</h2>
              </div>
              <p>
                This preview restores the old site’s trend and incident
                categories while keeping modeled content visibly separate from
                published facts.
              </p>
            </div>
            <CountyTrendChart data={data.modeledTrend} county={data.name} />
            <div
              className="burden-grid"
              aria-label="Modeled county burden summary"
            >
              <article>
                <span>2024 firearm deaths</span>
                <strong>≈ {latestModel.fatalityCount}</strong>
                <small>modeled count</small>
              </article>
              <article>
                <span>2024 nonfatal injuries</span>
                <strong>≈ {latestModel.nonfatalCount}</strong>
                <small>modeled count</small>
              </article>
              <article>
                <span>Modeled peak year</span>
                <strong>{data.peakYear}</strong>
                <small>highest total rate</small>
              </article>
              <article>
                <span>Above state pattern</span>
                <strong>{data.yearsAboveState}/5</strong>
                <small>comparable years, 2019–2023</small>
              </article>
            </div>
            <div className="intent-card">
              <div className="intent-copy">
                <span className="chart-label">MODELED PREVIEW</span>
                <h3>Intent profile</h3>
                <p>
                  Illustrative distribution for interface planning. These
                  percentages are not county observations.
                </p>
                <a href={DASHBOARD_URL} target="_blank" rel="noreferrer">
                  Open MDH dashboard <ArrowUpRight size={15} />
                </a>
              </div>
              <div className="intent-list">
                {data.intentMix.map((item) => (
                  <div key={item.label}>
                    <span>
                      <i style={{ background: item.color }} />
                      {item.label}
                    </span>
                    <b
                      style={{
                        width: `${item.percentage}%`,
                        background: item.color,
                      }}
                    />
                    <strong>{item.percentage}%</strong>
                    <small>
                      {item.estimated === null ? "—" : `≈ ${item.estimated}`}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="people" className="report-section">
            <div className="section-intro compact-intro">
              <div>
                <p className="eyebrow">03 / PEOPLE</p>
                <h2>Who may be most affected.</h2>
              </div>
              <p>
                Demographic panels are design placeholders modeled from broad
                patterns. They must be replaced with county exports before being
                described as findings.
              </p>
            </div>
            <div className="model-notice">
              <Sparkles size={18} />
              <div>
                <strong>Preview data</strong>
                <span>
                  Age, race and sex values demonstrate the complete experience;
                  they are labeled throughout and excluded from published
                  comparisons.
                </span>
              </div>
            </div>
            <div className="distribution-grid">
              <DistributionBars title="Age spectrum" data={data.agePattern} />
              <DistributionBars
                title="Race and ethnicity"
                data={data.racePattern}
                tone="green"
              />
              <DistributionBars
                title="Sex"
                data={data.sexPattern}
                tone="gold"
              />
            </div>
          </section>

          <section
            id="prevention"
            className="report-section prevention-section"
          >
            <div className="section-intro compact-intro">
              <div>
                <p className="eyebrow">04 / PREVENTION</p>
                <h2>From information to action.</h2>
              </div>
              <p>
                A planning profile works best when it helps people choose a
                useful next step.
              </p>
            </div>
            <div className="focus-ribbon">
              <span>Suggested focus areas</span>
              {data.focusAreas.map((focus) => (
                <b key={focus}>
                  <Check size={14} />
                  {focus}
                </b>
              ))}
            </div>
            <div className="recommendation-grid">
              {data.recommendations.map((item, index) => (
                <article key={item.title}>
                  <span>0{index + 1}</span>
                  <ShieldCheck size={24} />
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="action-plan" className="report-section action-section">
            <div className="section-intro compact-intro">
              <div>
                <p className="eyebrow">05 / PRACTICAL NEXT STEPS</p>
                <h2>Choose the situation that fits.</h2>
              </div>
              <p>
                Different circumstances require different responses. Start with
                the closest match and move directly to a useful action.
              </p>
            </div>

            <div
              className="prevention-continuum"
              aria-label="Prevention continuum"
            >
              <article>
                <span>01 · Before harm</span>
                <LockKeyhole size={22} />
                <h3>Prevention & assessment</h3>
                <p>
                  Strengthen protective factors through secure storage, youth
                  support, education, and careful use of local data.
                </p>
              </article>
              <article>
                <span>02 · When risk rises</span>
                <MessageCircleWarning size={22} />
                <h3>Intervention & response</h3>
                <p>
                  Connect people to crisis care, trusted messengers, conflict
                  interruption, and time-sensitive safety options.
                </p>
              </article>
              <article>
                <span>03 · After harm</span>
                <HeartPulse size={22} />
                <h3>Resilience & healing</h3>
                <p>
                  Support survivors, families, witnesses, and neighborhoods with
                  trauma-informed care and practical recovery services.
                </p>
              </article>
            </div>

            <div className="action-explorer">
              <div
                className="action-tabs"
                role="tablist"
                aria-label="Choose a next step"
              >
                {actionPathways.map((path) => (
                  <button
                    key={path.id}
                    type="button"
                    role="tab"
                    aria-selected={actionPath === path.id}
                    className={actionPath === path.id ? "active" : ""}
                    onClick={() => setActionPath(path.id)}
                  >
                    {path.label}
                  </button>
                ))}
              </div>
              <div className="action-detail" role="tabpanel" aria-live="polite">
                <div>
                  <p className="eyebrow">{selectedAction.eyebrow}</p>
                  <h3>{selectedAction.title}</h3>
                  <p>{selectedAction.summary}</p>
                </div>
                <ol>
                  {selectedAction.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <div className="action-links">
                  {selectedAction.id === "crisis" && (
                    <>
                      <a className="button primary" href="tel:988">
                        Call 988
                      </a>
                      <a className="button secondary" href="sms:988">
                        Text 988
                      </a>
                    </>
                  )}
                  {selectedAction.id === "storage" && (
                    <a
                      className="button primary"
                      href="https://projectchildsafe.org/get-a-safety-kit/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Find a safety kit <ArrowUpRight size={15} />
                    </a>
                  )}
                  {(selectedAction.id === "recovery" ||
                    selectedAction.id === "community") && (
                    <Link
                      className="button primary"
                      to={`/resources?county=${data.id}`}
                    >
                      Explore verified support <ArrowUpRight size={15} />
                    </Link>
                  )}
                  <a
                    className="text-link"
                    href={
                      selectedAction.id === "community"
                        ? PLAN_URL
                        : DASHBOARD_URL
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedAction.id === "community"
                      ? "Read Maryland’s prevention plan"
                      : "Explore Maryland guidance"}
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="methodology" className="report-section methodology-card">
            <BookOpen size={25} />
            <div>
              <p className="eyebrow">DATA NOTES</p>
              <h2>Know what is published and what is modeled.</h2>
              <p>
                <strong>Published:</strong> MDH five-year firearm fatality rate
                and statewide trend. <strong>Official estimates:</strong> Census
                2024 population, poverty, and household income.{" "}
                <strong>Modeled preview:</strong> annual counts, county trend,
                intent, and demographic distributions.
              </p>
              <div className="method-links">
                <a
                  href={`${PLAN_URL}#page=13`}
                  target="_blank"
                  rel="noreferrer"
                >
                  MDH state plan <ArrowUpRight size={14} />
                </a>
                <a
                  href={CENSUS_POPULATION_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Census population file <ArrowUpRight size={14} />
                </a>
                <a href={SAIPE_URL} target="_blank" rel="noreferrer">
                  Census SAIPE file <ArrowUpRight size={14} />
                </a>
                <Link to="/sources">
                  Full methodology <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <aside id="support" className="report-sidebar rich-sidebar">
          <div className="sidebar-sticky">
            <p className="eyebrow">SUPPORT YOU CAN REACH</p>
            <h2>Help is closer than it feels.</h2>
            <p>
              Provider-sourced local listings and statewide services available
              to Maryland residents.
            </p>
            {available.slice(0, 4).map((resource) => (
              <article key={resource.id} className="sidebar-resource">
                <span className="eyebrow">{resource.category}</span>
                <h3>{resource.name}</h3>
                <p>{resource.availability}</p>
                <div>
                  {resource.sms && (
                    <a href={`sms:${resource.sms}`}>Text {resource.sms}</a>
                  )}
                  {resource.phone && (
                    <a href={`tel:${resource.phone.replace(/[^\d+]/g, "")}`}>
                      {resource.phone}
                    </a>
                  )}
                  <a href={resource.website} target="_blank" rel="noreferrer">
                    Provider <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            ))}
            <Link
              className="button primary wide-button"
              to={`/resources?county=${data.id}`}
            >
              View all support <ArrowUpRight size={16} />
            </Link>
            <div className="urgent-card">
              <strong>Need help now?</strong>
              <span>
                Call or text 988 for free, confidential crisis support.
              </span>
              <a href="tel:988">Call 988</a>
            </div>
          </div>
        </aside>
      </div>
      <p className="print-only">
        Silence the Violence · Centennial High School FBLA · {PLAN_URL}
      </p>
    </div>
  );
}
