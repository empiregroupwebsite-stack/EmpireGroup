import { useState } from 'react';
import indiaMap from '@svg-maps/india';
import { completedProjectsData, type Project } from '../data/projectsData';
import { ongoingProjectsData, type OngoingProject } from '../data/ongoingProjectsData';

interface IndiaMapLocation {
  id: string;
  name: string;
  path: string;
}

const indiaLocations = indiaMap.locations as IndiaMapLocation[];

export function Hero() {
  const [selectedCity, setSelectedCity] = useState<'mumbai' | 'pune' | 'hyderabad'>('pune');

  type DisplayProject = (Project | OngoingProject) & { isOngoing: boolean };
  const projects: DisplayProject[] = [
    ...completedProjectsData.map((project) => ({ ...project, isOngoing: false })),
    ...ongoingProjectsData.map((project) => ({ ...project, isOngoing: true })),
  ];
  const cityProjects = projects.filter((project) => {
    const city = project.city.toLowerCase();
    if (selectedCity === 'mumbai') return city.includes('mumbai') || city.includes('thane');
    if (selectedCity === 'hyderabad') {
      return city.includes('hyderabad') || city.includes('vijayawada') || city.includes('andhra pradesh');
    }
    return city.includes('pune');
  });

  function selectCity(city: 'mumbai' | 'pune' | 'hyderabad') {
    setSelectedCity(city);
  }

  return (
    <section className="hero hero--interactive" id="home" aria-labelledby="hero-title">
      {/* Subtle architectural ambient lights */}
      <div className="hero-grid-ambient" aria-hidden="true" />
      <div className="hero-radial-glow hero-radial-glow--left" aria-hidden="true" />
      <div className="hero-radial-glow hero-radial-glow--right" aria-hidden="true" />

      <div className="container hero-container">
        <div className="hero-split-grid hero-split-grid--map-right">
          <div className="hero-copy-column">

            <h1 id="hero-title" className="hero-main-title">
              Engineering Landmarks.<br />
              <em>Shaping Horizons.</em>
            </h1>

            <div className="hero-cta-group">
              <a className="button button--hero-primary" href="#projects">
                <span>Explore Projects</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </a>
              <a className="hero-contact-pill" href="#contact">
                <span>Partner with Us</span>
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>

            {/* Credibility Stats: 50+ Projects & 25+ Years */}
            <div className="hero-stats-band" aria-label="Company Milestones">
              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  {completedProjectsData.length}<span>+</span>
                </div>
                <div className="hero-stat-label">
                  <strong>Completed Projects</strong>
                </div>
              </div>

              <div className="hero-stat-divider" aria-hidden="true" />

              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  7<span></span>
                </div>
                <div className="hero-stat-label">
                  <strong>Ongoing Projects</strong>
                </div>
              </div>

              <div className="hero-stat-divider" aria-hidden="true" />

              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  35<span>M+</span>
                </div>
                <div className="hero-stat-label">
                  <strong>Sq. Ft. Delivered</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-location-map" aria-label="Empire Group project locations in Mumbai, Pune and Hyderabad">
            <div className="hero-city-switcher" aria-label="Select project city">
              {(['mumbai', 'pune', 'hyderabad'] as const).map((city) => (
                <button
                  key={city}
                  type="button"
                  className={selectedCity === city ? 'is-active' : ''}
                  onClick={() => selectCity(city)}
                  aria-pressed={selectedCity === city}
                >
                  {city}
                </button>
              ))}
            </div>

            <svg
              className="hero-location-map__svg"
              viewBox="70 340 270 210"
              role="img"
              aria-labelledby="india-location-map-title india-location-map-desc"
            >
              <title id="india-location-map-title">India project locations</title>
              <desc id="india-location-map-desc">
                India map highlighting Maharashtra and Telangana with project pins in Mumbai, Pune and Hyderabad.
              </desc>
              <defs>
                <filter id="heroStateGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="heroPinGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <pattern id="heroGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M28 0H0V28" fill="none" stroke="#89a6c8" strokeWidth=".45" opacity=".12" />
                </pattern>
              </defs>

              <rect x="70" y="340" width="270" height="210" fill="url(#heroGrid)" opacity=".9" />

              <g className="hero-india-states">
                {indiaLocations.map((location) => (
                  <path
                    key={location.id}
                    d={location.path}
                    className={
                      location.id === 'mh'
                        ? 'hero-maharashtra'
                        : location.id === 'tg'
                          ? 'hero-telangana'
                          : 'hero-india-state'
                    }
                  >
                    <title>{location.name}</title>
                  </path>
                ))}
              </g>

              <text className="hero-state-name hero-state-name--maharashtra" x="178" y="386" textAnchor="middle">MAHARASHTRA</text>
              <text className="hero-state-name hero-state-name--telangana" x="238" y="472" textAnchor="middle">TELANGANA</text>

              <path className="hero-corridor" d="M137 402Q164 414 190 430T250 474" />

              <g
                className={`hero-map-location hero-map-location--mumbai ${selectedCity === 'mumbai' ? 'is-active' : ''}`}
                transform="translate(137 402)"
                role="button"
                tabIndex={0}
                aria-label="Show Mumbai projects"
                onClick={() => selectCity('mumbai')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') selectCity('mumbai');
                }}
              >
                <path className="hero-map-location__pin" d="M0-22c-9 0-16 7-16 16 0 12 16 27 16 27S16 6 16-6c0-9-7-16-16-16Z" />
                <circle cx="0" cy="-6" r="5" fill="#082b27" />
                <g className="hero-map-location__label" transform="translate(18 -13)">
                  <rect x="0" y="0" width="132" height="42" rx="21" />
                  <text x="66" y="27" textAnchor="middle">MUMBAI</text>
                </g>
              </g>

              <g
                className={`hero-map-location hero-map-location--pune ${selectedCity === 'pune' ? 'is-active' : ''}`}
                transform="translate(190 430)"
                role="button"
                tabIndex={0}
                aria-label="Show Pune projects"
                onClick={() => selectCity('pune')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') selectCity('pune');
                }}
              >
                <path className="hero-map-location__pin" d="M0-22c-9 0-16 7-16 16 0 12 16 27 16 27S16 6 16-6c0-9-7-16-16-16Z" />
                <circle cx="0" cy="-6" r="5" fill="#082b27" />
                <g className="hero-map-location__label" transform="translate(-130 -13)">
                  <rect x="0" y="0" width="112" height="42" rx="21" />
                  <text x="56" y="27" textAnchor="middle">PUNE</text>
                </g>
              </g>

              <g
                className={`hero-map-location hero-map-location--hyderabad ${selectedCity === 'hyderabad' ? 'is-active' : ''}`}
                transform="translate(250 474)"
                role="button"
                tabIndex={0}
                aria-label="Show Hyderabad projects"
                onClick={() => selectCity('hyderabad')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') selectCity('hyderabad');
                }}
              >
                <path className="hero-map-location__pin" d="M0-22c-9 0-16 7-16 16 0 12 16 27 16 27S16 6 16-6c0-9-7-16-16-16Z" />
                <circle cx="0" cy="-6" r="5" fill="#082b27" />
                <g className="hero-map-location__label" transform="translate(-170 -13)">
                  <rect x="0" y="0" width="152" height="42" rx="21" />
                  <text x="76" y="27" textAnchor="middle">HYDERABAD</text>
                </g>
              </g>
            </svg>

            <div className="hero-project-preview" aria-live="polite">
              <div className="hero-project-preview__header">
                <div>
                  <span>Selected location</span>
                  <strong>{selectedCity}</strong>
                </div>
                <a href="#projects">View portfolio <span>↗</span></a>
              </div>
              {cityProjects.length > 0 ? (
                <div className="hero-project-preview__list">
                  {cityProjects.slice(0, 5).map((project) => (
                    <div className="hero-project-preview__item" key={project.id}>
                      <span className={project.isOngoing ? 'is-ongoing' : ''}>
                        {project.isOngoing ? 'Ongoing' : 'Completed'}
                      </span>
                      <strong>{project.name}</strong>
                      <small>{project.location}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="hero-project-preview__empty">No projects added for this location yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
