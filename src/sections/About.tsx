import { CityIllustration } from '../components/CityIllustration';
import { COMPANY_STATS } from '../data/companyStats';

interface AboutSectionProps {
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

export function About({ onNavigateAbout, onNavigateContact }: AboutSectionProps) {
  return (
    <section className="ehome-about" id="about" aria-labelledby="about-title">
      <div className="ehome-about__inner">
        <div className="ehome-about__copy" data-reveal data-reveal-delay="1">
          <p className="ehome-eyebrow">The Empire Group Standard</p>
          <h2 className="ehome-heading" id="about-title">
            Driven by quality and excellence <em>since 2002.</em>
          </h2>
          <p className="ehome-copy">
            Headquartered in Pune, Empire Group Infrastructure &amp; Developers is a client-focused construction company known for quality, safety, and timely execution. Our experienced civil engineering team delivers high-rise residential, commercial, township, and industrial projects across Maharashtra and India.
          </p>
          <p className="ehome-copy ehome-about__extra">
            We follow the principles of quality, consistency, compliance, safety, and environmental responsibility across every project we undertake.
          </p>

          <dl className="ehome-about__metrics">
            {COMPANY_STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}<span>{stat.unit}</span></dd>
              </div>
            ))}
          </dl>

          <div className="ehome-about__actions">
            {onNavigateAbout && (
              <button type="button" className="ehome-btn" onClick={onNavigateAbout}>
                Company Profile &amp; Heritage <span aria-hidden="true">↗</span>
              </button>
            )}
            <a
              className="ehome-link"
              href="#contact"
              onClick={(event) => {
                if (onNavigateContact) {
                  event.preventDefault();
                  onNavigateContact();
                }
              }}
            >
              Partner With Our Engineering Team <span aria-hidden="true">→</span>
            </a>
          </div>

          <p className="ehome-about__signoff">Turnkey EPC Contracting · High-Rise Specialization · Precision Delivery</p>
        </div>

        <div className="ehome-about__visual" data-reveal="left">
          <CityIllustration />
          <div className="ehome-about__stamp">
            <strong>50+</strong>
            <span>Projects Delivered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
