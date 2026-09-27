import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Layers, Map as MapIcon, Search } from "lucide-react";
import { CountyMap } from "../components/CountyMap";
import {
  counties,
  DATA_PERIOD,
  PLAN_URL,
  formatRate,
  normalizeSearch,
} from "../lib/data";
import { getCountyByZipcode } from "../lib/zipcodes";
export function MapPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("query") || "";
  const [sort, setSort] = useState("name");
  const [dimensional, setDimensional] = useState(true);
  const initialSearch = useRef(query);
  useEffect(() => {
    if (initialSearch.current)
      document.getElementById("county-list-title")?.scrollIntoView();
  }, []);
  const zip = /^\d{5}$/.test(query.trim());
  const zipCounty = zip ? getCountyByZipcode(query.trim()) : null;
  const matches = useMemo(
    () =>
      counties
        .filter((c) =>
          zip
            ? c.id === zipCounty
            : normalizeSearch(c.name).includes(normalizeSearch(query)),
        )
        .sort((a, b) =>
          sort === "rate"
            ? (b.rate ?? -1) - (a.rate ?? -1)
            : a.name.localeCompare(b.name),
        ),
    [query, sort, zip, zipCounty],
  );
  return (
    <div className="shell section-space">
      <div className="page-heading">
        <p className="eyebrow">MARYLAND · COUNTY EXPLORER</p>
        <h1>Understand your community.</h1>
        <p>
          Explore published firearm fatality rates across Maryland’s 24
          jurisdictions. Start with the map or find your county below.
        </p>
      </div>
      <div className="data-note">
        <strong>{DATA_PERIOD} reporting period</strong>
        <span>
          Five-year firearm fatality rates per 100,000 people. Published by MDH
          in June 2025.
        </span>
        <a href={`${PLAN_URL}#page=13`} target="_blank" rel="noreferrer">
          View original report <ArrowUpRight size={15} />
        </a>
      </div>
      <section
        className="map-explorer-stage"
        aria-label="Interactive Maryland map"
      >
        <div className="map-view-toolbar">
          <div>
            <span>Interactive map</span>
            <strong>
              {dimensional ? "Dimensional view" : "Flat data view"}
            </strong>
          </div>
          <div role="group" aria-label="Choose map view">
            <button
              className={!dimensional ? "active" : ""}
              onClick={() => setDimensional(false)}
            >
              <MapIcon size={15} /> Flat
            </button>
            <button
              className={dimensional ? "active" : ""}
              onClick={() => setDimensional(true)}
            >
              <Layers size={15} /> Dimensional
            </button>
          </div>
        </div>
        <CountyMap dimensional={dimensional} />
        {dimensional && (
          <p className="dimension-note">
            Dimensional height and shadow are visual aids. Color still
            represents the published rate; select any county for its full
            report.
          </p>
        )}
      </section>
      <section
        className="county-list-section"
        aria-labelledby="county-list-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR COUNTY</p>
            <h2 id="county-list-title">Local context, clearly explained.</h2>
          </div>
        </div>
        <div className="filter-toolbar">
          <div className="search-field">
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="county-search">
              Search counties or ZIP codes
            </label>
            <input
              id="county-search"
              value={query}
              onChange={(e) =>
                setParams(e.target.value ? { query: e.target.value } : {}, {
                  replace: true,
                })
              }
              placeholder="County name or ZIP code"
            />
          </div>
          <label className="select-field">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">County name</option>
              <option value="rate">Highest published rate</option>
            </select>
          </label>
        </div>
        {zip && zipCounty && (
          <p className="notice">
            ZIP lookup suggests {counties.find((c) => c.id === zipCounty)?.name}
            . Postal areas may cross county lines; confirm your county before
            using the report.
          </p>
        )}
        <p className="fine-print" role="status">
          {matches.length} {matches.length === 1 ? "county" : "counties"} shown
        </p>
        <div className="county-list">
          {matches.map((c) => (
            <Link key={c.id} to={`/report/${c.id}`} className="county-row">
              <span>{c.name}</span>
              <span className={c.rate === null ? "muted" : "county-value"}>
                {formatRate(c.rate)}
                {c.rate !== null && <small> / 100k</small>}
                <ArrowUpRight size={17} />
              </span>
            </Link>
          ))}
        </div>
        {!matches.length && (
          <div className="empty-state">
            <h3>No county found</h3>
            <p>
              {zip
                ? "This ZIP code is not in our lookup. Search by county name instead."
                : "Try a county name such as Howard or Baltimore."}
            </p>
            <button className="button secondary" onClick={() => setParams({})}>
              Show all counties
            </button>
          </div>
        )}
        <div className="reading-note">
          <h3>Read the data with care.</h3>
          <p>
            “Suppressed” means the source does not publish a rate because of
            small counts and reliability concerns. It does not mean zero deaths.
            These historical rates describe communities, not an individual’s
            safety or current conditions.
          </p>
          <Link className="text-link" to="/sources">
            Sources & methodology <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </div>
  );
}
function ArrowRightIcon() {
  return <ArrowUpRight size={16} aria-hidden="true" />;
}
