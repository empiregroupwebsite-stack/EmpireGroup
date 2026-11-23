import { equipmentsData } from '../data/equipmentsData';

export function EquipmentsPage() {
  return (
    <section className="efleet" id="equipments-page-view" aria-label="Equipment fleet">
      <ul className="efleet__grid">
        {equipmentsData.map((item, index) => (
          <li className="efleet-card" key={item.id} style={{ '--i': index } as React.CSSProperties}>
            <img src={item.image} alt={item.name} loading={index < 4 ? 'eager' : 'lazy'} />
            <div className="efleet-card__body">
              {item.brands && item.brands.length > 0 && (
                <span className="efleet-card__brand">{item.brands.join(' · ')}</span>
              )}
              <h3 className="efleet-card__name">{item.name}</h3>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
