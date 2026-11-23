import { equipmentsData, machineryData } from '../data/equipmentsData';

const pad = (value: number) => String(value).padStart(2, '0');

export function EquipmentsPage() {
  return (
    <section className="efleet" id="equipments-page-view" aria-labelledby="efleet-title">
      <div className="efleet__inner">
        <header className="efleet__head">
          <div>
            <p className="ehome-eyebrow">Plant &amp; Machinery</p>
            <h1 className="ehome-heading" id="efleet-title">
              Our Equipment <em>Fleet.</em>
            </h1>
          </div>
          <p className="efleet__summary">
            <strong>{pad(equipmentsData.length)}</strong> Equipment
            <span aria-hidden="true">·</span>
            <strong>{pad(machineryData.length)}</strong> Machinery
          </p>
        </header>

        <div className="efleet__group efleet__group--equipment">
          <h2 className="efleet__label">Equipment</h2>
          <ul className="efleet__grid">
            {equipmentsData.map((item, index) => (
              <li className="efleet-card" key={item.id} style={{ '--i': index } as React.CSSProperties}>
                <div className="efleet-card__media">
                  <img src={item.image} alt={item.name} loading={index < 4 ? 'eager' : 'lazy'} />
                  <span className="efleet-card__num">{pad(index + 1)}</span>
                </div>
                <div className="efleet-card__body">
                  <h3 className="efleet-card__name">{item.name}</h3>
                  <p className="efleet-card__use">{item.use}</p>
                  {item.brands && item.brands.length > 0 && (
                    <p className="efleet-card__brands">{item.brands.join(' · ')}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="efleet__group efleet__group--machinery">
          <h2 className="efleet__label">Machinery</h2>
          <ul className="efleet__machines">
            {machineryData.map((item, index) => (
              <li className="efleet-machine" key={item.id} style={{ '--i': index + equipmentsData.length } as React.CSSProperties}>
                <span className="efleet-machine__media">
                  <img src={item.image} alt={item.name} loading="lazy" title={item.credit} />
                </span>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.use}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="efleet__credits">
            Machinery photos via Wikimedia Commons:{' '}
            {machineryData.map((item) => item.credit.replace('Photo: ', '').replace(', via Wikimedia Commons', '')).join(' · ')}
          </p>
        </div>
      </div>
    </section>
  );
}
