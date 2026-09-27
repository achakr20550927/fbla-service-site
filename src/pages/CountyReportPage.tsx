import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Download,
  HeartHandshake,
  Landmark,
  MapPin,
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

export function CountyReportPage() {
  const { countyId } = useParams();
  const data = countyId ? countyProfiles[countyId] : null;
  const [status, setStatus] = useState("");
  const [view, setView] = useState<"annual" | "five-year">("annual");
  const available = useMemo(
    () => (data ? getCountyResources(data.id) : []),
    [data],
  );

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
          <a href="#overview">Overview</a>
          <a href="#patterns">Patterns</a>
          <a href="#people">People</a>
          <a href="#prevention">Prevention</a>
          <a href="#support">Local support</a>
          <a href="#methodology">Methodology</a>
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
