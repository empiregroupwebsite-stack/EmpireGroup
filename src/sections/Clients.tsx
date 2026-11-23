import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { completedProjectsData, type Project } from '../data/projectsData';
import { ongoingProjectsData, type OngoingProject } from '../data/ongoingProjectsData';
import { CLIENTS, matchesClient, type ClientItem } from '../data/clientsData';
import { ClientLogo } from '../components/ClientLogo';

interface ClientProject {
  name: string;
  developer: string;
  location: string;
  city: string;
  status: 'Completed' | 'Ongoing';
}

const clientLogos = CLIENTS;

const allProjects: ClientProject[] = [
  ...completedProjectsData.map((project: Project) => ({
    name: project.name,
    developer: project.developer,
    location: project.location,
    city: project.city,
    status: 'Completed' as const,
  })),
  ...ongoingProjectsData.map((project: OngoingProject) => ({
    name: project.name,
    developer: project.developer,
    location: project.location,
    city: project.city,
    status: 'Ongoing' as const,
  })),
];

function getClientProjects(client: ClientItem): ClientProject[] {
  return allProjects.filter((project) => matchesClient(client, `${project.developer} ${project.name}`));
}

const projectCounts = new Map(
  clientLogos.map((client) => [client.name, getClientProjects(client).length]),
);

export function Clients() {
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);

  const closeModal = useCallback(() => setSelectedClient(null), []);

  useEffect(() => {
    if (!selectedClient) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedClient, closeModal]);

  const selectedProjects = selectedClient ? getClientProjects(selectedClient) : [];

  return (
    <section className="clients-section" id="clients" aria-labelledby="clients-title">
      <div className="container">
        <div className="clients-heading" data-reveal>
          <p className="eyebrow">Relationships that move us forward</p>
          <h2 className="section-heading" id="clients-title">
            India&apos;s most respected real estate developers <em>trust us.</em>
          </h2>
          <p className="clients-subtitle">
            {clientLogos.length}+ developers, {allProjects.length} projects delivered and underway. Select a client to explore our work together.
          </p>
        </div>

        <ul className="clients-grid" aria-label="Trusted real estate clients" data-reveal>
          {clientLogos.map((client, index) => {
            const projectCount = projectCounts.get(client.name) ?? 0;
            return (
              <li key={client.name} style={{ '--i': index } as React.CSSProperties}>
                <button
                  type="button"
                  className={`client-card ${selectedClient?.name === client.name ? 'is-selected' : ''}`}
                  onClick={() => setSelectedClient(client)}
                  aria-label={`View ${client.name} details`}
                >
                  <span className="client-card-logo">
                    <ClientLogo client={client} />
                  </span>
                  <span className="client-card-name">{client.name}</span>
                  <span className="client-card-meta" aria-hidden="true">
                    {projectCount > 0 ? `${projectCount} ${projectCount === 1 ? 'project' : 'projects'}` : 'View details'}
                    <span className="client-card-arrow">→</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {selectedClient &&
          createPortal(

          <div
            className="client-detail-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-detail-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <div className="client-detail-modal">
              <button
                type="button"
                className="client-modal-close"
                onClick={closeModal}
                aria-label="Close client details"
              >
                ×
              </button>

              <aside className="client-detail-left">
                <span className="client-detail-eyebrow">Selected Client</span>
                <div className="client-detail-logo">
                  <ClientLogo client={selectedClient} />
                </div>
                <h3 id="client-detail-title">{selectedClient.name}</h3>
                <div className="client-detail-count">
                  <strong>{selectedProjects.length}</strong>
                  <span>{selectedProjects.length === 1 ? 'Associated Project' : 'Associated Projects'}</span>
                </div>

                <div className="client-quick-switcher">
                  <span className="quick-switch-label">Switch Client</span>
                  <div className="quick-switch-chips">
                    {clientLogos.map((client) => (
                      <button
                        type="button"
                        className={`quick-chip ${client.name === selectedClient.name ? 'active' : ''}`}
                        key={client.name}
                        onClick={() => setSelectedClient(client)}
                      >
                        {client.name}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="client-detail-right">
                <div className="client-projects-heading">
                  <div>
                    <span className="client-detail-eyebrow">Portfolio</span>
                    <h2>Associated <em>Projects</em></h2>
                  </div>
                  <span className="client-project-total">{selectedProjects.length}</span>
                </div>

                <div className="client-project-list">
                  {selectedProjects.length > 0 ? selectedProjects.map((project, index) => (
                    <article className="client-project-item" key={`${project.name}-${project.status}`}>
                      <span className="client-project-number">{String(index + 1).padStart(2, '0')}</span>
                      <div className="client-project-info">
                        <h3>{project.name}</h3>
                        <div className="client-project-meta">
                          <span className="client-project-location">{project.location}, {project.city}</span>
                          <span className={`client-project-badge ${project.status === 'Completed' ? 'is-completed' : 'is-ongoing'}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  )) : (
                    <div className="client-no-projects">
                      <span>Portfolio Record</span>
                      <h3>No matching projects are listed</h3>
                      <p>There are currently no project records associated with this client in the published project data.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
            document.body,
          )}
      </div>
    </section>
  );
}
