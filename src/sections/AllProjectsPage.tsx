import { completedProjectsData, getProjectImageUrl, type Project } from '../data/projectsData';

interface AllProjectsPageProps {
  onSelectProject: (project: Project) => void;
  onBackToHome: () => void;
}

export function AllProjectsPage(_props: AllProjectsPageProps) {
  return (
    <section className="simple-projects-page" aria-label="Completed projects">
      <div className="container simple-projects-grid">
        {completedProjectsData.map((project) => (
          <article className="simple-project-card" key={project.id}>
            <div className="simple-project-image">
              <img
                src={getProjectImageUrl(project.image)}
                alt={`${project.name} in ${project.location}`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = '/empire-group-project-2560x1440.jpg';
                }}
              />
            </div>
            <div className="simple-project-content">
              <h2>{project.name}</h2>
              <dl>
                <div>
                  <dt>Client</dt>
                  <dd>{project.developer}</dd>
                </div>
                <div>
                  <dt>Completion Year</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt>Project Area</dt>
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
