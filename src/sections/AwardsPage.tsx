import { awardsData } from '../data/awardsData';

interface AwardsPageProps {
  onBackToHome: () => void;
  onNavigateContact?: () => void;
}

export function AwardsPage({ onBackToHome }: AwardsPageProps) {
  return (
    <main className="awards-page" id="awards-page-view">
      <header className="certifications-header">
        <div className="container">
          <button
            type="button"
            className="back-home-button"
            onClick={onBackToHome}
            aria-label="Return to homepage"
          >
            <span aria-hidden="true">←</span> Back to Home
          </button>
          <p className="eyebrow">Professional Recognition</p>
          <h1>Awards &amp; <em>Certifications</em></h1>
        </div>
      </header>

      <section className="certifications-list" aria-label="Empire Group awards and certifications">
        <div className="container">
          {awardsData.map((award, index) => (
            <article
              className={`certificate-row ${index % 2 === 1 ? 'certificate-row--reverse' : ''}`}
              key={award.id}
            >
              <div className="certificate-image-wrap">
                <img
                  src={award.image}
                  alt={`${award.title} - ${award.organization}`}
                  className="certificate-image"
                  loading="lazy"
                />
              </div>

              <div className="certificate-details">
                <span className="certificate-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="certificate-category">{award.category}</p>
                <h2>{award.title}</h2>
                <div className="certificate-meta">
                  <div>
                    <span>Organization</span>
                    <strong>{award.organization}</strong>
                  </div>
                  <div>
                    <span>Year / Recognition</span>
                    <strong>{award.year}</strong>
                  </div>
                  <div>
                    <span>Project / Scope</span>
                    <strong>{award.projectOrScope}</strong>
                  </div>
                </div>
                <p className="certificate-description">{award.description}</p>
                <span className="certificate-badge">{award.badge}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
