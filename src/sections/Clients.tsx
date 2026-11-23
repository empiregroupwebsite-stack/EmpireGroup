import { useCallback, useEffect, useState } from 'react';
import { completedProjectsData, type Project } from '../data/projectsData';
import { ongoingProjectsData, type OngoingProject } from '../data/ongoingProjectsData';

interface ClientItem {
  name: string;
  file: string;
}

interface ClientProject {
  name: string;
  developer: string;
  location: string;
  city: string;
  status: 'Completed' | 'Ongoing';
}

const clientLogos: readonly ClientItem[] = [
  { name: 'Amanora', file: 'amanora.png' },
  { name: 'Amit', file: 'amit.png' },
  { name: 'Honeywell', file: 'honeywell.png' },
  { name: 'Kolte Patil', file: 'koltpatil.png' },
  { name: 'Konark', file: 'konark.png' },
  { name: 'Kumar', file: 'kumar.png' },
  { name: 'Lodha', file: 'lodha.png' },
  { name: 'Magarpatta', file: 'magarpatta.png' },
  { name: 'Marvel', file: 'marvel.png' },
  { name: 'Naiknavare', file: 'naiknavare.png' },
  { name: 'Nanded City', file: 'nandedcity.png' },
  { name: 'Paranjape', file: 'paranjape.png' },
  { name: 'Puneville', file: 'puneville.png' },
  { name: 'Runwal Seagull', file: 'runwalseagul.png' },
  { name: 'Solitare', file: 'solitare.png' },
  { name: 'VTP', file: 'vtp.png' },
  { name: 'Xrbia', file: 'xrbia.png' },
];

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

function getClientProjects(clientName: string): ClientProject[] {
  const normalized = clientName.toLowerCase().trim();

  return allProjects.filter((project) => {
    const developer = project.developer.toLowerCase();
    const name = project.name.toLowerCase();
    const combined = `${developer} ${name}`;

    const aliases: Record<string, string[]> = {
      amanora: ['amanora', 'city corporation'],
      amit: ['amit'],
      honeywell: ['honeywell'],
      'kolte patil': ['kolte', 'kolte patil'],
      konark: ['konark'],
      kumar: ['kumar'],
      lodha: ['lodha'],
      magarpatta: ['magarpatta'],
      marvel: ['marvel'],
      naiknavare: ['naiknavare'],
      'nanded city': ['nanded'],
      paranjape: ['paranjape'],
      puneville: ['puneville', 'pharande'],
      'runwal seagull': ['runwal'],
      solitare: ['solitare', 'solitaire'],
      vtp: ['vtp'],
      xrbia: ['xrbia'],
    };

    return (aliases[normalized] ?? [normalized]).some((alias) => combined.includes(alias));
  });
}

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

  const selectedProjects = selectedClient ? getClientProjects(selectedClient.name) : [];

  return (
    <section className="clients-section" id="clients" aria-labelledby="clients-title">
      <div className="container">
        <div className="clients-heading" data-reveal>
          <p className="eyebrow">Relationships that move us forward</p>
          <h2 className="section-heading" id="clients-title">
            India&apos;s most respected real estate developers <em>trust us.</em>
          </h2>
        </div>

        <div className="client-logo-grid" aria-label="Trusted real estate clients">
          {clientLogos.map((client, index) => (
            <button
              type="button"
              className={`client-logo ${selectedClient?.name === client.name ? 'selected' : ''}`}
              key={client.name}
              style={{ '--client-delay': `${index * 55}ms` } as React.CSSProperties}
              onClick={() => setSelectedClient(client)}
            >
              <span className="client-logo-image">
                <span className="client-logo-fallback" aria-hidden="true">
                  {client.name.split(/\s+/).map((word) => word[0]).join('').slice(0, 3)}
                </span>
                <img
                  src={`https://www.empiireprojects.in/clients/${client.file}`}
                  alt={`${client.name} logo`}
                  loading="eager"
                  decoding="async"
                  onError={(event) => event.currentTarget.classList.add('is-broken')}
                />
              </span>
              <span className="client-logo-name">{client.name}</span>
            </button>
          ))}
        </div>

        {selectedClient && (
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
                  <img
                    src={`https://www.empiireprojects.in/clients/${selectedClient.file}`}
                    alt={`${selectedClient.name} logo`}
                  />
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
          </div>
        )}
      </div>
    </section>
  );
}
