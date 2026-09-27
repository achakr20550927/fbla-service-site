import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Download, Share2 } from "lucide-react";
import {
  countyData,
  getCountyResources,
  formatRate,
  STATE_RATE,
  PLAN_URL,
  DATA_PERIOD,
  DASHBOARD_URL,
} from "../lib/data";
import { StateTrendChart } from "../components/Charts";
export function CountyReportPage() {
  const { countyId } = useParams();
  const data = countyId ? countyData[countyId] : null;
  const [status, setStatus] = useState("");
  if (!data)
    return (
      <div className="shell section-space empty-state">
        <h1>County not found.</h1>
        <Link className="button primary" to="/map">
          Browse all counties
        </Link>
      </div>
    );
  const available = getCountyResources(data.id);
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
  return (
    <div className="shell section-space report-page">
      <Link className="back-link no-print" to="/map">
        <ArrowLeft size={16} />
        All counties
      </Link>
      <div className="report-heading">
        <div className="page-heading">
          <p className="eyebrow">COUNTY DATA & LOCAL SUPPORT</p>
          <h1>{data.name}</h1>
          <p>
            Published data for your community, with resources to help you take
            the next step.
          </p>
        </div>
        <div className="report-actions no-print">
          <button className="button secondary" onClick={() => window.print()}>
            <Download size={16} />
            Print / save PDF
          </button>
          <button className="button secondary" onClick={share}>
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>
      <p className="status-message" role="status">
        {status}
      </p>
      <div className="report-grid">
        <div>
          <section className="county-stat-panel">
            <p className="eyebrow">FIREARM FATALITY RATE · {DATA_PERIOD}</p>
            <div
              className={`report-rate ${data.rate === null ? "suppressed-value" : ""}`}
            >
              {formatRate(data.rate)}
              {data.rate !== null && <span>per 100,000 people</span>}
            </div>
            <p>
              {data.rate === null
                ? "The published source suppresses this county’s rate. No estimated value is substituted."
                : "A five-year rate reported in the Maryland Department of Health’s June 2025 state plan."}
            </p>
            {data.rate !== null && (
              <div
                className="comparison-bars"
                aria-label={`${data.name}: ${data.rate}; Maryland: ${STATE_RATE} per 100,000`}
              >
                <div>
                  <span>{data.name}</span>
                  <i style={{ width: `${(data.rate / 50) * 100}%` }} />
                  <strong>{data.rate.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Maryland</span>
                  <i
                    className="state-bar"
                    style={{ width: `${(STATE_RATE / 50) * 100}%` }}
                  />
                  <strong>{STATE_RATE}</strong>
                </div>
              </div>
            )}
            <a
              className="text-link"
              href={`${PLAN_URL}#page=13`}
              target="_blank"
              rel="noreferrer"
            >
              Read the source report <ArrowUpRight size={15} />
            </a>
          </section>
          <section className="reading-note">
            <h2>What this means</h2>
            <p>
              Rates make it possible to compare communities of different sizes.
              This figure covers firearm deaths across all intents, including
              homicide and suicide. It is not a count of shootings or a
              prediction of personal risk.
            </p>
            <p>
              The report suppresses rates with fatality counts under 20. A
              suppressed rate is not zero. This site does not estimate missing
              counts, demographic breakdowns, or county trends.
            </p>
            <Link to="/sources">Read the complete methodology</Link>
          </section>
          <StateTrendChart />
        </div>
        <aside className="report-sidebar">
          <p className="eyebrow">SUPPORT YOU CAN REACH</p>
          <h2>Here for your community.</h2>
          <p>
            Local listings and statewide services available to Maryland
            residents.
          </p>
          {available.map((r) => (
            <article key={r.id} className="sidebar-resource">
              <span className="eyebrow">{r.category}</span>
              <h3>{r.name}</h3>
              <p>{r.availability}</p>
              {r.sms && <a href={`sms:${r.sms}`}>Text {r.sms}</a>}
              {r.phone && (
                <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>{r.phone}</a>
              )}
              <a href={r.website} target="_blank" rel="noreferrer">
                Visit provider <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
          <Link
            className="button secondary"
            to={`/resources?county=${data.id}`}
          >
            View directory <ArrowUpRight size={16} />
          </Link>
        </aside>
      </div>
      <div className="source-banner">
        <div>
          <h3>Looking for newer or more detailed data?</h3>
          <p>
            MDH’s dashboard includes additional years, demographics, and
            county-level views.
          </p>
        </div>
        <a
          className="text-link"
          href={DASHBOARD_URL}
          target="_blank"
          rel="noreferrer"
        >
          Open official dashboard <ArrowUpRight size={17} />
        </a>
      </div>
      <p className="print-only">
        Silence the Violence · Centennial High School FBLA. County source:{" "}
        {PLAN_URL}
      </p>
    </div>
  );
}
