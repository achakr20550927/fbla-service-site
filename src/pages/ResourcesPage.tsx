import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowUpRight, Phone } from "lucide-react";
import { counties, resources, REVIEWED, normalizeSearch } from "../lib/data";
export function ResourcesPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "",
    county = params.get("county") || "",
    type = params.get("type") || "";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }
  const filtered = resources.filter(
    (r) =>
      (!county || !r.countyIds.length || r.countyIds.includes(county)) &&
      (!type || r.category === type) &&
      normalizeSearch(
        `${r.name} ${r.description} ${r.category} ${r.location}`,
      ).includes(normalizeSearch(search)),
  );
  return (
    <div className="shell section-space">
      <div className="page-heading">
        <p className="eyebrow">THE SUPPORT DIRECTORY</p>
        <h1>A little help finding help.</h1>
        <p>
          Reach a person, find local services, or take a practical step toward
          safer storage. Every listing links to the organization providing the
          service.
        </p>
      </div>
      <div className="crisis-banner">
        <div>
          <strong>Need someone now?</strong>
          <span>
            Call or text 988 for crisis support. Call 911 for immediate danger.
          </span>
        </div>
        <div>
          <a href="tel:988">Call 988</a>
          <a href="sms:988">Text 988</a>
          <a href="https://988lifeline.org/" target="_blank" rel="noreferrer">
            Online support <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="directory-layout">
        <aside className="directory-filters">
          <h2>Find your support</h2>
          <label htmlFor="resource-search">Search</label>
          <div className="search-field">
            <Search size={17} aria-hidden="true" />
            <input
              id="resource-search"
              value={search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Service or organization"
            />
          </div>
          <label htmlFor="resource-county">County</label>
          <select
            id="resource-county"
            value={county}
            onChange={(e) => update("county", e.target.value)}
          >
            <option value="">All counties</option>
            {counties.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label htmlFor="resource-type">Type of support</label>
          <select
            id="resource-type"
            value={type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="">All services</option>
            {Array.from(new Set(resources.map((r) => r.category))).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {(search || county || type) && (
            <button className="text-button" onClick={() => setParams({})}>
              Clear filters
            </button>
          )}
          <p className="fine-print">
            County results always include statewide services. Provider pages
            reviewed {REVIEWED}. Availability can change; check before visiting.
          </p>
          <Link className="text-link" to="/sources">
            How we select resources <ArrowUpRight size={14} />
          </Link>
        </aside>
        <section className="resource-results" aria-label="Support services">
          <div className="results-heading">
            <span role="status">
              {filtered.length}{" "}
              {filtered.length === 1 ? "resource" : "resources"} found
            </span>
            <span>DIRECT FROM PROVIDERS</span>
          </div>
          {filtered.map((r) => (
            <article className="resource-entry" key={r.id}>
              <div className="resource-meta">
                <span>{r.category}</span>
                <span>{r.location}</span>
              </div>
              <h2>{r.name}</h2>
              <p>{r.description}</p>
              <div className="resource-availability">{r.availability}</div>
              <div className="resource-actions">
                {r.sms && (
                  <a className="button secondary" href={`sms:${r.sms}`}>
                    Text {r.sms}
                  </a>
                )}
                {r.phone && (
                  <a
                    className="button secondary"
                    href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
                  >
                    <Phone size={15} />
                    {r.phone}
                  </a>
                )}
                <a
                  className="text-link"
                  href={r.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit organization <ArrowUpRight size={16} />
                </a>
              </div>
              <details>
                <summary>Service details & source</summary>
                <p>{r.details}</p>
                <p className="fine-print">
                  Provider: {r.org}.{" "}
                  <a href={r.source} target="_blank" rel="noreferrer">
                    Official source
                  </a>{" "}
                  · Reviewed {REVIEWED}.
                </p>
              </details>
            </article>
          ))}
          {!filtered.length && (
            <div className="empty-state">
              <h2>No matching resources.</h2>
              <p>Try a broader search or clear your filters.</p>
              <button
                className="button secondary"
                onClick={() => setParams({})}
              >
                Show all resources
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="source-banner">
        <div>
          <h3>Can’t find what you need?</h3>
          <p>
            211 Maryland can connect you with a broader network of local
            services.
          </p>
        </div>
        <a
          className="text-link"
          href="https://search.211md.org/"
          target="_blank"
          rel="noreferrer"
        >
          Search 211 Maryland <ArrowUpRight size={17} />
        </a>
      </div>
    </div>
  );
}
