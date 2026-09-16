import { useState } from 'react';
import PropTypes from 'prop-types';
import CollapsableSection from './CollapsableSection';
import renderInputImage from '../utils/renderInputImage';

export default function BeginnerCombos({ combos }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!combos?.length) return null;
  return <div className="combo-section"><CollapsableSection title="Easy Combos" toggleState={collapsed} collapseFn={() => setCollapsed(v => !v)}>
    <dl className="easy-combos">{combos.map((combo, i) => <div key={i}>
      <dt>{combo.launchers.map(input => <span key={input}>{renderInputImage(input)}</span>)}</dt>
      <dd>{renderInputImage(combo.followUp)}</dd>
    </div>)}</dl>
  </CollapsableSection></div>;
}
BeginnerCombos.propTypes = { combos: PropTypes.arrayOf(PropTypes.shape({
  launchers: PropTypes.arrayOf(PropTypes.string).isRequired,
  followUp: PropTypes.string.isRequired,
})) };
