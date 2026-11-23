
import { equipmentsData } from '../data/equipmentsData';

interface EquipmentsPageProps {
  onBackToHome: () => void;
  onNavigateContact?: () => void;
}

export function EquipmentsPage({
  onBackToHome,
}: EquipmentsPageProps) {
  return (
    <div className="equipments-page" id="equipments-page-view">

      <section className="equipments-main-section">
        <div className="container">

          {/* Page Header */}
          <div className="equipments-page-header">
            <button
              type="button"
              className="back-home-button"
              onClick={onBackToHome}
            >
              <span>←</span> Back to Home
            </button>

            <div className="equipments-heading">

            </div>
          </div>

          {/* Equipment Gallery */}
          <div className="equipments-grid">
            {equipmentsData.map((item) => (
              <article
                className="equipment-card"
                key={item.id}
              >
                <div className="equipment-media">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                </div>

                <div className="equipment-body">
                  {item.brands && item.brands.length > 0 && (
                    <span className="equipment-brand">
                      {item.brands.join(' / ')}
                    </span>
                  )}
                  <h3 className="equipment-name">
                    {item.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
