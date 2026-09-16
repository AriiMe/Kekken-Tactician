import { useState } from 'react';
import PropTypes from 'prop-types';
import CollapsableSection from './CollapsableSection';

export default function Stances({ stances }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  if (!stances.length) return null;
  return (
    <div className="combo-section">
      <CollapsableSection title="Stances" toggleState={isCollapsed} collapseFn={() => setIsCollapsed(value => !value)}>
        <dl className="stance-list">
          {stances.map(stance => (
            <div key={stance.name} className="stance-list__row">
              {stance.abbreviation && <dt>{stance.abbreviation}</dt>}
              <dd>{stance.name}</dd>
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
})).isRequired };
