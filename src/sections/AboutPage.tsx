import { Fragment } from 'react';
import { COMPANY_STATS } from '../data/companyStats';

const CORE_VALUES = [
  {
    title: 'Engineering Excellence',
    text: 'Precision, quality, technical expertise, and continuous improvement.',
  },
  {
    title: 'Trust & Integrity',
    text: 'Building lasting relationships through honesty, transparency, and accountability.',
  },
  {
    title: 'Growth & Ambition',
    text: 'Growing responsibly, expanding capabilities, and achieving new milestones.',
  },
  {
    title: 'Commitment & Ownership',
    text: 'Taking ownership of every project, every commitment, and every result.',
  },
];

export function AboutPage({
  onBackToHome: _onBackToHome,
}: {
  onBackToHome: () => void;
  onNavigateContact?: () => void;
}) {
  return (
    <div className="about-page empire-about-page" id="about-page-view">

      <main>
        <section className="empire-about-company" aria-labelledby="about-company-title">
          <div className="container">
            <div className="empire-about-heading" data-reveal>
              <p className="eyebrow">About EmpireGroup</p>
              <h1 className="section-heading" id="about-company-title">
                Building with purpose. <em>Delivering with excellence.</em>
              </h1>
            </div>
            <div className="empire-introduction" data-reveal>
              <p>
                EmpireGroup is a construction and infrastructure company committed to quality, reliability,
                and professional project execution.
              </p>
              <p>
                We approach every assignment with technical discipline, responsible management, and attention
                to detail from planning through completion.
              </p>
              <p>
                Our teams work closely with clients to deliver durable developments and dependable results.
              </p>
              <p>
                We build enduring relationships through transparency, consistent performance, and excellence
                at every stage.
              </p>
            </div>

            <div className="empire-scale-strip" aria-label="EmpireGroup scale" data-reveal>
              {COMPANY_STATS.map((stat, index) => (
                <Fragment key={stat.label}>
                  {index > 0 && <div className="empire-scale-divider" aria-hidden="true" />}
                  <div className="empire-scale-item">
                    <strong>{stat.value}{stat.unit}</strong>
                    <span>{stat.label}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="empire-core-values" aria-labelledby="core-values-title">
          <div className="container">
            <div className="empire-about-heading" data-reveal>
              <p className="eyebrow">What Drives Us</p>
              <h2 className="section-heading" id="core-values-title">
                Our Core <em>Values.</em>
              </h2>
            </div>
            <ol className="empire-values-grid">
              {CORE_VALUES.map((value, index) => (
                <li className="empire-value-card" key={value.title} data-reveal data-reveal-delay={index + 1}>
                  <span className="empire-value-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="empire-vision-mission" aria-label="Vision and mission">
          <div className="container empire-vision-mission-grid">
            <article className="empire-purpose-card" data-reveal>
              <p className="eyebrow">Our Vision</p>
              <h2>
                To become one of India&rsquo;s Top 5 most trusted and respected construction and infrastructure
                companies, recognized for engineering excellence, innovation and sustainable growth.
              </h2>
            </article>

            <article className="empire-purpose-card" data-reveal>
              <p className="eyebrow">Our Mission</p>
              <h2>
                To deliver world-class construction and infrastructure solutions through engineering excellence,
                advanced technology, quality workmanship and continuous innovation.
              </h2>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
