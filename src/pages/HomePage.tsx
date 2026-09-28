import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { CountyMap } from "../components/CountyMap";
import { SNAPSHOT_URL, resources } from "../lib/data";
export function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function search(e: FormEvent) {
    e.preventDefault();
    navigate(
      `/map${query.trim() ? `?query=${encodeURIComponent(query.trim())}` : ""}`,
    );
  }
  return (
    <>
      <section className="shell home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="short-rule" />A SAFER MARYLAND STARTS WITH US
          </p>
          <h1>
            Know Your Area.
            <br />
            <em>Stay Protected.</em>
          </h1>
          <p className="hero-description">
            Understanding gun violence is a first step toward preventing it.
            Find reliable data, local support, and practical ways to help your
            community.
          </p>
          <form className="hero-search" onSubmit={search}>
            <label className="sr-only" htmlFor="home-search">
              County name or ZIP code
            </label>
            <Search size={20} aria-hidden="true" />
            <input
              id="home-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Your county or ZIP code"
            />
            <button aria-label="Find your county" type="submit">
              <ArrowRight size={21} />
            </button>
          </form>
          <div className="hero-links">
            <Link className="text-link" to="/resources">
              Find support near you <ArrowUpRight size={17} />
            </Link>
            <span>Free to use. Here for everyone.</span>
          </div>
        </div>
        <div className="hero-map-panel">
          <div className="panel-kicker">
            <span>THE MARYLAND PICTURE</span>
            <span>01 / EXPLORE</span>
          </div>
          <CountyMap compact />
          <div className="hero-map-caption">
            <span>
              23 counties. One independent city.
              <br />
              <strong>One shared responsibility.</strong>
            </span>
            <Link to="/map" aria-label="Explore Maryland county data">
              <ArrowUpRight size={25} />
            </Link>
          </div>
        </div>
      </section>
      <div className="shell project-byline">
        <span>A COMMUNITY SERVICE PROJECT BY</span>
        <strong>Centennial High School FBLA</strong>
        <Link to="/about">
          Meet the purpose behind the project <ArrowRight size={15} />
        </Link>
      </div>
      <section className="snapshot-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE CONTEXT</p>
              <h2>
                Behind every number,
                <br />a person. A family. A community.
              </h2>
            </div>
            <p>
              Public health data helps us understand the scale of firearm
              harm—and where support is needed.
            </p>
          </div>
          <div className="snapshot-grid">
            <div className="stat">
              <span className="stat-number">671</span>
              <h3>Lives lost to firearms</h3>
              <p>Maryland firearm fatalities in 2024.</p>
              <a href={SNAPSHOT_URL} target="_blank" rel="noreferrer">
                Maryland Department of Health <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="stat">
              <span className="stat-number">780</span>
              <h3>Emergency department visits</h3>
              <p>Nonfatal firearm injuries in Maryland, 2024.</p>
              <a href={SNAPSHOT_URL} target="_blank" rel="noreferrer">
                Maryland Department of Health <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="stat stat-action">
              <span className="stat-number">
                A place
                <br />
                to start.
              </span>
              <h3>Help is within reach</h3>
              <p>
                Explore {resources.length} sourced services and support
                locators.
              </p>
              <Link to="/resources">
                Find the right support <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <p className="fine-print">
            Statewide snapshot from MDH’s dashboard announcement. County
            comparisons use a separate 2019–2023 reporting period.{" "}
            <Link to="/sources">See sources and definitions.</Link>
          </p>
        </div>
      </section>
      <section className="shell section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">TAKE THE NEXT STEP</p>
            <h2>
              Knowledge becomes meaningful
              <br />
              when it leads to action.
            </h2>
          </div>
          <Link className="text-link" to="/resources">
            View all resources <ArrowRight size={17} />
          </Link>
        </div>
        <div className="action-grid">
          {[
            [
              "01",
              "Understand your county",
              "Explore published firearm fatality rates and understand what the data can—and cannot—tell us.",
              "Explore county data",
              "/map",
            ],
            [
              "02",
              "Find someone to talk to",
              "Connect with crisis counselors, survivor services, and community support organizations.",
              "Find local support",
              "/resources",
            ],
            [
              "03",
              "Make storage safer",
              "Find safety-kit partners and learn about Howard County’s free gun-lock program.",
              "Explore safe storage",
              "/resources?type=Safe%20storage",
            ],
          ].map(([n, title, body, label, to]) => (
            <article key={n} className="action-item">
              <span className="item-number">{n}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link to={to}>
                {label}
                <ArrowUpRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="project-section">
        <div className="shell project-grid">
          <div className="project-statement">
            <p className="eyebrow">STUDENT-LED. COMMUNITY-FOCUSED.</p>
            <h2>
              Our community.
              <br />
              Our responsibility.
            </h2>
            <div className="editorial-line" />
          </div>
          <div>
            <p className="large-copy">
              We’re students at Centennial High School who believe that clear
              information and real connections can help build a safer Maryland.
            </p>
            <p>
              This project brings public data and support services into one
              accessible place. It’s an invitation to learn, start a
              conversation, and take part.
            </p>
            <Link className="text-link" to="/about">
              Read about our project <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="shell closing-cta">
        <div>
          <p className="eyebrow">YOU CAN MAKE A DIFFERENCE</p>
          <h2>Start with a conversation.</h2>
        </div>
        <Link className="button primary" to="/about#contact">
          Get involved <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
