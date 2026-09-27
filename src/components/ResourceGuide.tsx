import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { resources, normalizeSearch } from "../lib/data";
export function ResourceGuide() {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  const matches = resources.filter((r) =>
    normalizeSearch(
      `${r.name} ${r.category} ${r.description} ${r.location}`,
    ).includes(normalizeSearch(query)),
  );
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <button
        ref={trigger}
        className="guide-trigger no-print"
        onClick={() => setOpen(true)}
      >
        Find a resource <ArrowUpRight size={15} />
      </button>
      <dialog
        ref={dialog}
        className="resource-dialog"
        aria-labelledby="guide-title"
        onCancel={close}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="guide-inner">
          <div className="guide-heading">
            <div>
              <p className="eyebrow">A PLACE TO START</p>
              <h2 id="guide-title">Find a resource.</h2>
            </div>
            <button
              className="plain-icon"
              aria-label="Close resource guide"
              onClick={close}
            >
              <X />
            </button>
          </div>
          <p>
            Search our sourced directory. For a crisis,{" "}
            <a href="tel:988">call 988</a>. For immediate danger,{" "}
            <a href="tel:911">call 911</a>.
          </p>
          <label htmlFor="guide-search">What kind of support?</label>
          <input
            id="guide-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try crisis, storage, or Howard"
          />
          <p className="fine-print" role="status">
            {matches.length} matching resources
          </p>
          <div className="guide-results">
            {matches.map((r) => (
              <div key={r.id}>
                <strong>{r.name}</strong>
                <p>{r.description}</p>
                <a href={r.website} target="_blank" rel="noreferrer">
                  Visit provider <ArrowUpRight size={14} />
                </a>
                {r.sms && <a href={`sms:${r.sms}`}>Text {r.sms}</a>}
                {r.phone && (
                  <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}>
                    {r.phone}
                  </a>
                )}
              </div>
            ))}
            {!matches.length && (
              <p>
                No matches. Try “crisis,” “storage,” or browse the directory.
              </p>
            )}
          </div>
          <Link className="text-link" to="/resources" onClick={close}>
            Open the full directory <ArrowUpRight size={16} />
          </Link>
          <p className="fine-print">
            Searches stay in your browser. This is a directory guide, not a
            crisis counseling service.
          </p>
        </div>
      </dialog>
    </>
  );
}
