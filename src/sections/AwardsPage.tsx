import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { awardsData } from '../data/awardsData';

const AUTO_SCROLL_MS = 3500;
const SWIPE_THRESHOLD_PX = 50;
const total = awardsData.length;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Signed circular distance from the active card, e.g. -1 = left neighbour, 1 = right neighbour. */
function offsetFromActive(index: number, active: number): number {
  let offset = (((index - active) % total) + total) % total;
  if (offset > total / 2) offset -= total;
  return offset;
}

const pad = (value: number) => String(value).padStart(2, '0');

export function AwardsPage() {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const step = useCallback((delta: number) => setActive((current) => (current + delta + total) % total), []);

  // Auto-scroll; restarts after every move so a manual click gets a full interval.
  const isPaused = isHovered || isLightboxOpen;
  useEffect(() => {
    if (isPaused || total < 2 || prefersReducedMotion()) return;
    const timer = window.setTimeout(() => {
      if (!document.hidden) step(1);
    }, AUTO_SCROLL_MS);
    return () => window.clearTimeout(timer);
  }, [active, isPaused, step]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    lastTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    closeButtonRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, closeLightbox, step]);

  const handleCardClick = (index: number, trigger: HTMLElement) => {
    if (didSwipe.current) return;
    if (index !== active) {
      setActive(index);
      return;
    }
    lastTriggerRef.current = trigger;
    setIsLightboxOpen(true);
  };

  const activeAward = awardsData[active];

  return (
    <main className="awards-page" id="awards-page-view">
      <div className="awards-glow" aria-hidden="true" />

      <section
        className="awards-carousel"
        aria-roledescription="carousel"
        aria-label="Empire Group awards and certifications"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovered(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
      >
        <ul
          className="awards-stage"
          onPointerDown={(event) => {
            pointerStartX.current = event.clientX;
            didSwipe.current = false;
          }}
          onPointerUp={(event) => {
            if (pointerStartX.current === null) return;
            const deltaX = event.clientX - pointerStartX.current;
            pointerStartX.current = null;
            if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
              didSwipe.current = true;
              step(deltaX < 0 ? 1 : -1);
            }
          }}
        >
          {awardsData.map((award, index) => {
            const offset = offsetFromActive(index, active);
            const isVisible = Math.abs(offset) <= 1;
            return (
              <li
                key={award.id}
                className={`award-slide ${offset === 0 ? 'is-active' : isVisible ? 'is-side' : ''}`}
                style={{ '--pos': Math.max(-2, Math.min(2, offset)) } as React.CSSProperties}
                aria-hidden={!isVisible}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
              >
                <button
                  type="button"
                  className="award-card"
                  tabIndex={isVisible ? 0 : -1}
                  onClick={(event) => handleCardClick(index, event.currentTarget)}
                  aria-label={
                    offset === 0
                      ? `Open ${award.title} from ${award.organization}`
                      : `Show ${award.title}`
                  }
                >
                  <span className="award-card-media">
                    <img src={award.image} alt="" loading="lazy" decoding="async" draggable={false} />
                    <span className="award-card-shine" aria-hidden="true" />
                    <span className="award-card-zoom" aria-hidden="true">View certificate</span>
                  </span>
                  <span className="award-card-body">
                    <span className="award-card-top">
                      <span className="award-card-category">{award.category}</span>
                      <span className="award-card-year">{award.year}</span>
                    </span>
                    <span className="award-card-title">{award.title}</span>
                    <span className="award-card-org">{award.organization}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="awards-controls">
          <button type="button" className="awards-nav-button" onClick={() => step(-1)} aria-label="Previous award">
            ←
          </button>
          <div className="awards-progress">
            <span aria-live={isPaused ? 'polite' : 'off'}>
              {pad(active + 1)} / {pad(total)}
            </span>
            <span className="awards-progress-track" aria-hidden="true">
              <span
                className={`awards-progress-bar ${isPaused ? 'is-paused' : ''}`}
                key={active}
                style={{ animationDuration: `${AUTO_SCROLL_MS}ms` }}
              />
            </span>
          </div>
          <button type="button" className="awards-nav-button" onClick={() => step(1)} aria-label="Next award">
            →
          </button>
        </div>
      </section>

      {isLightboxOpen &&
        createPortal(
          <div
            className="award-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby="award-lightbox-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeLightbox();
            }}
          >
            <div className="award-lightbox-panel" key={activeAward.id}>
              <button
                type="button"
                className="award-lightbox-close"
                onClick={closeLightbox}
                ref={closeButtonRef}
                aria-label="Close certificate"
              >
                ×
              </button>

              <figure className="award-lightbox-media">
                <img src={activeAward.image} alt={`${activeAward.title} - ${activeAward.organization}`} />
              </figure>

              <div className="award-lightbox-details">
                <span className="award-card-category">{activeAward.category}</span>
                <h2 id="award-lightbox-title">{activeAward.title}</h2>
                <p className="award-lightbox-description">{activeAward.description}</p>

                <dl className="award-lightbox-meta">
                  <div>
                    <dt>Organization</dt>
                    <dd>{activeAward.organization}</dd>
                  </div>
                  <div>
                    <dt>Year / Recognition</dt>
                    <dd>{activeAward.year}</dd>
                  </div>
                  <div>
                    <dt>Project / Scope</dt>
                    <dd>{activeAward.projectOrScope}</dd>
                  </div>
                </dl>

                <span className="award-lightbox-badge">{activeAward.badge}</span>

                <div className="award-lightbox-nav">
                  <button type="button" onClick={() => step(-1)} aria-label="Previous award">
                    ←
                  </button>
                  <span>
                    {pad(active + 1)} / {pad(total)}
                  </span>
                  <button type="button" onClick={() => step(1)} aria-label="Next award">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}
