interface Leader {
  name: string;
  designation: string;
  initials: string;
}

const leaders: Leader[] = [
  { name: 'Nadeem Momin', designation: 'Director', initials: 'NM' },
  { name: 'Suraj Wadia', designation: 'Finance & Accounts', initials: 'SW' },
  { name: 'Manohar Peddi', designation: 'Contract & Billing', initials: 'MP' },
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
        <section className="empire-leadership" aria-labelledby="leadership-title">
          <div className="container">
            <div className="empire-about-heading" data-reveal>
              <p className="eyebrow">Company Leadership</p>
              <h1 className="section-heading" id="leadership-title">
                Leadership built on <em>experience.</em>
              </h1>
            </div>

            <div className="empire-leadership-grid">
              {leaders.map((leader) => (
                <article className="empire-leader-card" key={leader.name} data-reveal>
                  <div className="empire-leader-portrait" aria-label={`${leader.name}, ${leader.designation}`}>
                    <span>{leader.initials}</span>
                  </div>
                  <div className="empire-leader-info">
                    <h2>{leader.name}</h2>
                    <p>{leader.designation}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="empire-scale-strip" aria-label="EmpireGroup scale" data-reveal>
              <div className="empire-scale-item">
                <strong>25+</strong>
                <span>Years Legacy</span>
              </div>
              <div className="empire-scale-divider" aria-hidden="true" />
              <div className="empire-scale-item">
                <strong>50+</strong>
                <span>Projects</span>
              </div>
              <div className="empire-scale-divider" aria-hidden="true" />
              <div className="empire-scale-item">
                <strong>100%</strong>
                <span>Quality Consistency</span>
              </div>
              <div className="empire-scale-divider" aria-hidden="true" />
              <div className="empire-scale-item">
                <strong>100+</strong>
                <span>Satisfied Clients</span>
              </div>
            </div>
          </div>
        </section>

        <section className="empire-about-company" aria-labelledby="about-company-title">
          <div className="container">
            <div className="empire-about-heading" data-reveal>
              <p className="eyebrow">About EmpireGroup</p>
              <h2 className="section-heading" id="about-company-title">
                Building with purpose. <em>Delivering with excellence.</em>
              </h2>
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
          </div>
        </section>

        <section className="empire-vision-mission" aria-label="Vision and mission">
          <div className="container empire-vision-mission-grid">
            <article className="empire-purpose-card" data-reveal>
              <p className="eyebrow">Our Vision</p>
              <h2>To become a trusted and respected name in construction and infrastructure.</h2>
              <p>
                We envision sustainable growth through responsible practices, exceptional project delivery,
                and partnerships founded on confidence and professionalism.
              </p>
            </article>

            <article className="empire-purpose-card" data-reveal>
              <p className="eyebrow">Our Mission</p>
              <h2>To deliver quality construction with efficient, professional execution.</h2>
              <p>
                We are committed to consistent standards, practical innovation, on-time delivery, and long-term
                client relationships built through trust and accountability.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
