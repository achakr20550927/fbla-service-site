import { Link } from "react-router-dom";
import {
  DATA_PERIOD,
  PLAN_URL,
  SNAPSHOT_URL,
  DASHBOARD_URL,
  REVIEWED,
} from "../lib/data";
import boundaries from "../data/boundaries.json";
export function SourcesPage() {
  return (
    <div className="shell section-space prose-page">
      <p className="eyebrow">SOURCES & METHODOLOGY</p>
      <h1>Information you can trace.</h1>
      <p className="lead">
        The data on this site is a published snapshot, not a live feed. Every
        figure has a source and a reporting period.
      </p>
      <h2>County comparisons: {DATA_PERIOD}</h2>
      <p>
        County rates are transcribed from the map on printed page 10 (PDF page
        13) of the Maryland Department of Health’s{" "}
        <a href={`${PLAN_URL}#page=13`} target="_blank" rel="noreferrer">
          Preliminary State Plan for a Public Health Approach to Reducing
          Firearm Violence
        </a>
        , issued June 27, 2025. The report identifies CDC WISQARS, accessed
        April 2025, as its general data source; the county section also cites
        CDC WONDER.
      </p>
      <p>
        These are the published five-year firearm fatality rates per 100,000
        people. We reproduce the values as displayed, without deriving annual
        counts or demographic estimates. The statewide five-year comparison rate
        is 13.4, reported on printed page 9.
      </p>
      <h2>Suppression and interpretation</h2>
      <p>
        The report explains that jurisdiction rates with fatality counts under
        20 are suppressed to protect privacy and avoid unreliable estimates. We
        preserve these as “Suppressed”; they are never treated as zero. Six
        jurisdictions have suppressed overall rates in this source.
      </p>
      <p>
        Color bands are display groupings, not validated risk categories. County
        rates describe historical population outcomes. They do not establish an
        individual’s risk or current neighborhood safety. A county with a lower
        rate can still have people who need support.
      </p>
      <h2>Statewide trend: 2019–2023</h2>
      <p>
        The annual total, homicide, and suicide rates in the statewide chart are
        transcribed from printed page 12 (PDF page 15) of the same report. They
        are explicitly labeled as Maryland-wide figures. The selected intent
        categories may not add up to the total.
      </p>
      <h2>Statewide snapshot: 2024</h2>
      <p>
        The homepage’s 671 firearm fatalities and 780 nonfatal firearm-injury
        emergency department visits come from{" "}
        <a href={SNAPSHOT_URL} target="_blank" rel="noreferrer">
          MDH’s announcement of its prevention plan and firearm data dashboard
        </a>
        . These describe different outcomes and must not be added together as a
        count of unique people or compared directly with the five-year county
        rates.
      </p>
      <p>
        For additional reporting years and demographic detail, visit the{" "}
        <a href={DASHBOARD_URL} target="_blank" rel="noreferrer">
          official MDH dashboard
        </a>
        . The data on this site does not refresh automatically.
      </p>
      <h2>Geography and ZIP lookup</h2>
      <p>
        County geometry comes from{" "}
        <a href={boundaries.source} target="_blank" rel="noreferrer">
          State of Maryland MD iMAP generalized county boundaries
        </a>
        , with attribution to MD iMAP, SHA, and DoIT. Paths are simplified for
        display; they are not for surveying or navigation.
      </p>
      <p>
        ZIP search uses the project’s existing lookup as a convenience, not an
        authoritative boundary crosswalk. ZIP areas may cross county lines, and
        some ZIP codes are not mapped. Confirm the suggested county or choose
        from the complete county list.
      </p>
      <h2>Support directory</h2>
      <p>
        Listings link to official provider pages reviewed {REVIEWED}. Each entry
        identifies its provider and source. A listing does not imply a formal
        partnership, a guarantee of availability, or an independent evaluation
        of the program. Statewide listings appear in every county filter.
      </p>
      <p>
        Placeholder police contacts, unsupported effectiveness labels, and
        unverified resource totals have been removed. Contact providers for
        current service hours, eligibility, and availability.
      </p>
      <h2>Corrections</h2>
      <p>
        See something that needs updating?{" "}
        <Link to="/about#contact">Contact the project team</Link> with the page
        and a supporting source.
      </p>
      <p className="fine-print">Source review: {REVIEWED}.</p>
    </div>
  );
}
export function PrivacyPage() {
  return (
    <div className="shell section-space prose-page">
      <p className="eyebrow">PRIVACY</p>
      <h1>Your information.</h1>
      <p className="lead">
        This notice explains how the current website handles information you
        choose to provide.
      </p>
      <h2>Browsing and searches</h2>
      <p>
        County and resource searches run in your browser. Search terms may
        appear in the page URL and browser history. The site does not request
        your precise location or require an account. The application code does
        not include analytics or advertising trackers. The hosting provider may
        process standard request information, such as IP addresses and server
        logs, under its own policies.
      </p>
      <h2>Contacting the team</h2>
      <p>
        The contact form sends your name, email address, selected subject, and
        message through{" "}
        <a
          href="https://web3forms.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Web3Forms
        </a>{" "}
        to the project team. The team uses this information to respond to your
        request. Do not send medical details or other sensitive personal
        information. You can also use your own email application to contact us.
      </p>
      <h2>Resource guide</h2>
      <p>
        The resource guide searches the same directory shown on this site. It
        does not send your search text to an AI provider or store a
        conversation. Its search state clears when the page is reloaded.
      </p>
      <h2>External services</h2>
      <p>
        Provider websites, social media links, phone calls, texts, and email use
        services outside this site. Their own privacy practices apply when you
        use them.
      </p>
      <h2>Questions or deletion requests</h2>
      <p>
        Email{" "}
        <a href="mailto:silencetheviolenceec@gmail.com">
          silencetheviolenceec@gmail.com
        </a>{" "}
        with privacy questions or a request concerning information you have sent
        to the team.
      </p>
      <p className="fine-print">Updated {REVIEWED}.</p>
    </div>
  );
}
export function TermsPage() {
  return (
    <div className="shell section-space prose-page">
      <p className="eyebrow">TERMS OF USE</p>
      <h1>Using this resource.</h1>
      <p className="lead">
        Silence the Violence is a student-led educational and community-service
        project.
      </p>
      <h2>Purpose and limits</h2>
      <p>
        The site shares public data and links to support organizations. It does
        not provide emergency response, clinical care, legal advice, or an
        assessment of your personal safety. For immediate danger, call 911. For
        crisis support, call or text 988.
      </p>
      <h2>Data and availability</h2>
      <p>
        Figures reflect the reporting periods stated on each page. They may be
        revised by their publishers. Resource details can change; confirm
        current information with the provider. Read our{" "}
        <Link to="/sources">sources and methodology</Link> before interpreting
        comparisons.
      </p>
      <h2>Third-party organizations</h2>
      <p>
        External links are provided to help visitors find information and
        support. Organizations operate independently; inclusion does not imply a
        partnership or endorsement of every service or statement they provide.
      </p>
      <h2>Sharing and corrections</h2>
      <p>
        When sharing reports, preserve the data period, source attribution, and
        suppression notes. Please <Link to="/about#contact">contact us</Link> if
        you find an error or an inaccessible resource.
      </p>
      <p className="fine-print">Updated {REVIEWED}.</p>
    </div>
  );
}
export function NotFoundPage() {
  return (
    <div className="shell section-space empty-state">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>Let’s get you back on track.</h1>
      <p>The page you’re looking for isn’t here.</p>
      <Link className="button primary" to="/">
        Return home
      </Link>
    </div>
  );
}
