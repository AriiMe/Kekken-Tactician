import { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './TagPairView.css';

const fighterType = PropTypes.shape({ slug: PropTypes.string.isRequired, name: PropTypes.string.isRequired, image: PropTypes.string });
const fighterId = fighter => `tag-fighter-${fighter.slug}`;
const viewLabels = { both: 'Combos & punishers', combos: 'Combos', punishers: 'Punishers' };
function scrollOffset(controls) {
  if (!controls || getComputedStyle(controls).position !== 'sticky') return 100;
  return (parseFloat(getComputedStyle(controls).top) || 0) + controls.getBoundingClientRect().height + 12;
}

function FighterPanels({ primary, partner, renderFighter }) {
  const [activeSlug, setActiveSlug] = useState(primary.slug);
  const [anchorTarget, setAnchorTarget] = useState('');
  const [view, setView] = useState('both');
  const panels = useRef({});
  const controls = useRef(null);
  const positions = useRef({});
  const restoreScroll = useRef(false);

  useEffect(() => {
    function revealAnchor(hash = window.location.hash) {
      const selected = [primary, partner].find(fighter => hash.startsWith(`#${fighterId(fighter)}-`));
      if (selected) {
        restoreScroll.current = false;
        const section = hash.endsWith('-punishers') ? 'punishers' : hash.endsWith('-combos') ? 'combos' : null;
        if (section) setView(current => current === 'both' || current === section ? current : section);
        setAnchorTarget(hash.slice(1));
        setActiveSlug(selected.slug);
      }
    }
    const onHashChange = () => revealAnchor();
    const onAnchorClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = event.target.closest?.('a')?.getAttribute('href');
      if (hash?.startsWith('#')) revealAnchor(hash);
    };
    revealAnchor();
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onAnchorClick);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onAnchorClick);
    };
  }, [primary, partner]);

  useEffect(() => {
    // A mobile target cannot be scrolled into view until its hidden panel opens.
    if (anchorTarget) {
      const target = document.getElementById(anchorTarget);
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - scrollOffset(controls.current), behavior: 'instant' });
      return;
    }
    if (!restoreScroll.current) return;
    restoreScroll.current = false;
    const panel = panels.current[activeSlug];
    if (panel) window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - scrollOffset(controls.current) + (positions.current[`${activeSlug}:${view}`] || 0), behavior: 'instant' });
  }, [activeSlug, anchorTarget, view]);

  function switchFighter(slug) {
    if (slug === activeSlug) return;
    const panel = panels.current[activeSlug];
    if (panel) positions.current[`${activeSlug}:${view}`] = Math.max(0, scrollOffset(controls.current) - panel.getBoundingClientRect().top);
    restoreScroll.current = true;
    setAnchorTarget('');
    setActiveSlug(slug);
  }

  function switchView(nextView) {
    if (nextView === view) return;
    restoreScroll.current = false;
    setAnchorTarget('');
    setView(nextView);
  }

  return <>
    <div className="tag-pair-controls">
      <div className="tag-pair-filter" role="group" aria-label="Show guide sections">
        {Object.entries(viewLabels).map(([value, label]) => <button type="button" key={value} aria-pressed={view === value}
          onClick={() => switchView(value)}>{label}</button>)}
      </div>
    </div>
    <div className="tag-pair-switch" ref={controls} aria-label="Choose the visible fighter">
      {[primary, partner].map(fighter => <button type="button" key={fighter.slug} aria-pressed={activeSlug === fighter.slug}
        aria-controls={fighterId(fighter)} onClick={() => switchFighter(fighter.slug)}>{fighter.name}</button>)}
    </div>
    <div className="tag-pair-columns">
      {[primary, partner].map(fighter => <section key={fighter.slug} id={fighterId(fighter)}
        ref={node => { panels.current[fighter.slug] = node; }}
        className={`tag-pair-panel${activeSlug === fighter.slug ? ' tag-pair-panel--active' : ''}`}
        aria-labelledby={`${fighterId(fighter)}-name`}>
        <header className="tag-pair-heading">
          {fighter.image && <img src={fighter.image} alt="" loading="lazy" />}
          <h2 id={`${fighterId(fighter)}-name`}>{fighter.name}</h2>
        </header>
        {renderFighter(fighter, { idPrefix: fighterId(fighter), view })}
      </section>)}
    </div>
  </>;
}
FighterPanels.propTypes = { primary: fighterType.isRequired, partner: fighterType.isRequired, renderFighter: PropTypes.func.isRequired };

export default function TagPairView({ primary, partner, roster, onPartnerChange, renderFighter }) {
  const selectId = useId();
  return <section id="tag-pair" className="tag-pair" aria-label="Two-fighter guide">
    <div className="tag-pair-picker">
      <label htmlFor={selectId}>{partner ? 'Second fighter' : 'Add a second fighter'}</label>
      <div><select id={selectId} value={partner?.slug || ''} onChange={event => onPartnerChange(event.target.value)}>
        <option value="">Choose a fighter…</option>
        {roster.filter(fighter => fighter.slug !== primary.slug).map(fighter => <option key={fighter.slug} value={fighter.slug}>{fighter.name}</option>)}
      </select>{partner && <button type="button" onClick={() => onPartnerChange('')}>Remove</button>}</div>
    </div>
    {partner && <FighterPanels key={`${primary.slug}-${partner.slug}`} primary={primary} partner={partner} renderFighter={renderFighter} />}
  </section>;
}
TagPairView.propTypes = {
  primary: fighterType.isRequired, partner: fighterType,
  roster: PropTypes.arrayOf(fighterType).isRequired,
  onPartnerChange: PropTypes.func.isRequired, renderFighter: PropTypes.func.isRequired,
};
