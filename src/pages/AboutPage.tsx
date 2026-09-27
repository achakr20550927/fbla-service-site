import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
export function AboutPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === "#contact")
      document.getElementById("contact")?.scrollIntoView();
  }, [hash]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "1bc9a5dc-8855-4f8f-90f6-c09e269bcf91",
          name: data.get("name"),
          email: data.get("email"),
          subject: `Silence the Violence: ${data.get("subject")}`,
          message: data.get("message"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Message not sent");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }
  return (
    <>
      <section className="shell section-space about-intro">
        <div className="page-heading">
          <p className="eyebrow">OUR PROJECT</p>
          <h1>
            A safer future is
            <br />a shared responsibility.
          </h1>
          <p>
            Silence the Violence is a community-service project by Centennial
            High School FBLA in Howard County, Maryland.
          </p>
        </div>
        <div className="about-manifesto">
          <span className="eyebrow">WHY WE’RE HERE</span>
          <h2>
            We believe information
            <br />
            should bring people
            <br />
            <em>closer to help.</em>
          </h2>
          <p>
            Gun violence affects people, families, and communities. As students,
            we want to make it easier for our neighbors to understand the issue
            and find organizations that can help.
          </p>
        </div>
      </section>
      <section className="project-section">
        <div className="shell project-grid">
          <div>
            <p className="eyebrow">OUR APPROACH</p>
            <h2>
              Clear information.
              <br />
              Practical next steps.
            </h2>
          </div>
          <div className="principle-list">
            <article>
              <span>01</span>
              <div>
                <h3>Start with evidence</h3>
                <p>
                  Use published public-health data, name the source, and explain
                  the reporting period and limitations.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Make support easier to reach</h3>
                <p>
                  Connect people to provider websites and working phone numbers,
                  with plain-language descriptions.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Keep the community at the center</h3>
                <p>
                  Treat every statistic as a person’s life, and every visitor as
                  someone who deserves useful, respectful information.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="shell section-space">
        <div className="source-banner">
          <div>
            <h2>Transparency is part of the work.</h2>
            <p>
              Our data is a dated snapshot of published research. We show what
              is known and leave suppressed figures unpublished.
            </p>
          </div>
          <Link className="text-link" to="/sources">
            Explore our sources <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="shell contact-section" id="contact">
        <div>
          <p className="eyebrow">GET INVOLVED</p>
          <h2>
            Let’s start
            <br />a conversation.
          </h2>
          <p>
            Have a question, a resource correction, or an idea for working
            together? We’d like to hear from you.
          </p>
          <a
            className="text-link email-link"
            href="mailto:silencetheviolenceec@gmail.com"
          >
            silencetheviolenceec@gmail.com <ArrowUpRight size={16} />
          </a>
          <p className="fine-print">
            This inbox is not monitored for emergencies. For immediate danger
            call 911; for crisis support call or text 988.
          </p>
        </div>
        <form className="contact-form" onSubmit={send}>
          <div className="form-row">
            <div>
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={200}
                required
              />
            </div>
          </div>
          <label htmlFor="contact-subject">What’s on your mind?</label>
          <select id="contact-subject" name="subject">
            <option>General question</option>
            <option>Volunteer or collaborate</option>
            <option>Resource or data correction</option>
            <option>Project updates</option>
          </select>
          <label htmlFor="contact-message">Your message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={4000}
            required
          />
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <p className="fine-print">
            Your message is sent through Web3Forms to our project team. Please
            do not include sensitive personal information.{" "}
            <Link to="/privacy">Privacy details</Link>.
          </p>
          <button
            className="button primary"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
            <ArrowUpRight size={17} />
          </button>
          <p
            role="status"
            className={status === "error" ? "error-text" : "status-message"}
          >
            {status === "success"
              ? "Your message was sent. Thank you for getting in touch."
              : status === "error"
                ? "Your message could not be sent. Please try again or email our team directly."
                : ""}
          </p>
        </form>
      </section>
    </>
  );
}
