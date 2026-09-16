import { useState } from 'react';
import PropTypes from 'prop-types';
import CollapsableSection from './CollapsableSection';
import renderInputImage from '../utils/renderInputImage';

export default function Stances({ stances }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  if (!stances.length) return null;
  return (
    <div className="combo-section">
      <CollapsableSection title="Stances" toggleState={isCollapsed} collapseFn={() => setIsCollapsed(value => !value)}>
        <dl className="stance-list">
          {stances.map(stance => (
            <div key={stance.name} className="stance-list__row">
              <dt>{stance.abbreviation || '—'}</dt>
              <dd className="stance-list__name">{stance.name}</dd>
              <dd className="stance-list__entry">
                <span className="stance-list__input" aria-label={`Enter ${stance.name}: ${stance.input}`}>{renderInputImage(stance.input)}</span>
                {stance.notes && <small>{stance.notes}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </CollapsableSection>
    </div>
  );
}

Stances.propTypes = { stances: PropTypes.arrayOf(PropTypes.shape({
  abbreviation: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired,
  notes: PropTypes.string,
})).isRequired };
