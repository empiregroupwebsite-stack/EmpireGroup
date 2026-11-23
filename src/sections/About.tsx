import { CityIllustration } from '../components/CityIllustration';

interface AboutSectionProps {
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

export function About({ onNavigateAbout, onNavigateContact }: AboutSectionProps) {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-visual" data-reveal="left">
          <CityIllustration />

          <div className="about-stamp">
            <strong>50+</strong>
            <span>Projects Delivered</span>
          </div>
        </div>

        <div className="about-copy" data-reveal data-reveal-delay="1">
          <p className="eyebrow">The Empire Group Standard</p>
          <h2 className="section-heading" id="about-title">
            Driven by quality and excellence <em>since 2002.</em>
          </h2>
          <p className="section-copy">
            Headquartered in Pune, Empire Group Infrastructure &amp; Developers is a client-focused construction company known for quality, safety, and timely execution. Our experienced civil engineering team delivers high-rise residential, commercial, township, and industrial projects across Maharashtra and India.
          </p>
          <p className="section-copy">
            We follow the principles of quality, consistency, compliance, safety, and environmental responsibility across every project we undertake.
          </p>
          <div className="about-metrics-mini">
            <div className="mini-metric">
              <strong>25+</strong>
              <span>Years in Industry</span>
            </div>
            <div className="mini-metric">
              <strong>50+</strong>
              <span>Projects Completed</span>
            </div>
            <div className="mini-metric">
              <strong>35M+</strong>
              <span>Sq. Ft. Delivered</span>
            </div>
          </div>

          <div className="about-actions-row">
            {onNavigateAbout && (
              <button
                type="button"
                className="button button--about-full"
                onClick={onNavigateAbout}
              >
                <span>Read Full Company Profile &amp; Heritage</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </button>
            )}
            <a
              className="text-link"
              href="#contact"
              onClick={(e) => {
                if (onNavigateContact) {
                  e.preventDefault();
                  onNavigateContact();
                }
              }}
            >
              Partner With Our Engineering Team <span className="arrow">↗</span>
            </a>
          </div>

          <p className="about-signoff">Turnkey EPC Contracting · High-Rise Specialization · Precision Delivery</p>
        </div>
      </div>
    </section>
  );
}