import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ResourceGuide } from "./ResourceGuide";
const links = [
  ["/", "Home"],
  ["/map", "County data"],
  ["/resources", "Find support"],
  ["/about", "Our project"],
];
export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
          document.getElementById("main-content")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <div className="support-strip">
        <div className="shell">
          <span>You don’t have to face a crisis alone.</span>
          <a href="tel:988">
            Call 988 <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <span className="strip-divider">/</span>
          <span>
            Immediate danger? <a href="tel:911">Call 911</a>
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Link
            to="/"
            className="wordmark"
            aria-label="Silence the Violence home"
          >
            <span className="wordmark-symbol" aria-hidden="true">
              st<span>v</span>
              <i />
            </span>
            <span>
              Silence the Violence<small>CENTENNIAL FBLA · MARYLAND</small>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive || (to === "/map" && pathname.startsWith("/report/"))
                    ? "active"
                    : ""
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Link className="header-contact" to="/about#contact">
            Get involved <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav shell"
            aria-label="Mobile navigation"
          >
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                end={to === "/"}
                to={to}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/about#contact" onClick={() => setOpen(false)}>
              Get involved
            </Link>
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="shell footer-main">
          <div>
            <Link className="footer-brand" to="/">
              Silence the Violence<span>.</span>
            </Link>
            <p>
              A student-led commitment to safer
              <br />
              Maryland communities.
            </p>
            <span className="eyebrow">CENTENNIAL HIGH SCHOOL FBLA</span>
          </div>
          <div>
            <h2>Explore</h2>
            <Link to="/map">County data</Link>
            <Link to="/resources">Support directory</Link>
            <Link to="/sources">Sources & methodology</Link>
          </div>
          <div>
            <h2>Connect</h2>
            <a href="mailto:silencetheviolenceec@gmail.com">
              Email our team <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.instagram.com/silencetheviolenceec/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram <ArrowUpRight size={14} />
            </a>
            <Link to="/about#contact">Get involved</Link>
          </div>
          <div>
            <h2>Someone to talk to</h2>
            <a className="footer-phone" href="tel:988">
              988
            </a>
            <p>
              Suicide & Crisis Lifeline
              <br />
              Free support, 24/7.
            </p>
            <a href="https://988lifeline.org/" target="_blank" rel="noreferrer">
              Call, text, or chat <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>
            © {new Date().getFullYear()} Silence the Violence · Centennial FBLA
          </span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
      <ResourceGuide />
    </>
  );
}
