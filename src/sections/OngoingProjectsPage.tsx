import { DeveloperLogo } from '../components/ClientLogo';
import { ongoingProjectsData } from '../data/ongoingProjectsData';

interface OngoingProjectsPageProps {
  onBackToHome: () => void;
  onNavigateContact?: () => void;
}

export function OngoingProjectsPage(_props: OngoingProjectsPageProps) {
  return (
    <section className="simple-projects-page" aria-label="Ongoing projects">
      <div className="container simple-projects-grid">
        {ongoingProjectsData.length === 0 ? (
          <p className="section-copy">No ongoing projects have been added.</p>
        ) : ongoingProjectsData.map((project) => (
          <article className="simple-project-card" key={project.id}>
            <div className="simple-project-image">
              <img
                src={project.image}
                alt={`${project.name} in ${project.location}`}
                loading="lazy"
              />
            </div>
            <div className="simple-project-content">
              <h2>{project.name}</h2>
              <dl>
                <div>
                  <dt>Client</dt>
<<<<<<< Updated upstream
                  <dd className="simple-project-client">
                    <DeveloperLogo developer={project.developer} />
                    {project.developer}
=======
                  <dd>
                    {project.developerLogo ? (
                      <img
                        className="simple-project-developer-logo"
                        src={project.developerLogo}
                        alt={`${project.developer} logo`}
                      />
                    ) : project.developer}
>>>>>>> Stashed changes
                  </dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{project.targetHandover}</dd>
                </div>
                <div>
                  <dt>Built-up Area</dt>
                  <dd>{project.builtUpArea}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{project.location}, {project.city}</dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
