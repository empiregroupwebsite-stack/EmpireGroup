import { DeveloperLogo } from '../components/ClientLogo';
import { completedProjectsData, getProjectImageUrl, type Project } from '../data/projectsData';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

const FEATURED_PROJECTS = completedProjectsData.slice(0, 3);
const FALLBACK_IMAGE = '/empire-group-project-2560x1440.jpg';

function placeLabel(project: Project) {
  const city = project.city.split(',')[0].trim();
  return project.location.trim() === city ? city : `${project.location}, ${city}`;
}

export function Projects({ onSelectProject, onViewAllProjects }: ProjectsProps) {
  return (
    <section className="ehome-projects" id="projects" aria-labelledby="projects-title">
      <div className="ehome-projects__inner">
        <header className="ehome-projects__head" data-reveal>
          <div>
            <p className="ehome-eyebrow">Proven Track Record · Pune &amp; Beyond</p>
            <h2 className="ehome-heading" id="projects-title">
              Our Completed <em>Projects.</em>
            </h2>
          </div>
          <div className="ehome-projects__intro">
            <p className="ehome-copy">
              A selected portfolio of landmark developments delivered with India&rsquo;s leading real estate builders,
              engineered for endurance, seismic resilience and architectural distinction.
            </p>
            <button type="button" className="ehome-btn" onClick={onViewAllProjects}>
              Open Full Projects <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        <div className="ehome-projects__grid">
          {FEATURED_PROJECTS.map((project, index) => {
            const hasYear = /^\d{4}/.test(project.year);
            return (
              <button
                type="button"
                key={project.id}
                className="ehome-pcard"
                data-reveal
                data-reveal-delay={index + 1}
                onClick={() => onSelectProject(project)}
                aria-label={`View full details for ${project.name}`}
              >
                <span className="ehome-pcard__media">
                  <img
                    src={getProjectImageUrl(project.image)}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <span className="ehome-pcard__num">#{String(index + 1).padStart(2, '0')}</span>
                  <span className="ehome-pcard__tag">{project.category}</span>
                  <DeveloperLogo developer={project.developer} className="ehome-pcard__logo" />
                </span>

                <span className="ehome-pcard__body">
                  <span className="ehome-pcard__dev">{project.developer}</span>
                  <strong className="ehome-pcard__name">{project.name}</strong>
                  <span className="ehome-pcard__loc">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {placeLabel(project)}
                  </span>
                  <span className="ehome-pcard__specs">
                    <span>
                      <small>Completed</small>
                      <b>{hasYear ? project.year : 'Delivered'}</b>
                    </span>
                    <span>
                      <small>Built-up Area</small>
                      <b>{project.builtUpArea}</b>
                    </span>
                  </span>
                  <span className="ehome-pcard__cta">
                    Explore Details <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
