import { useState } from 'react';
import PropTypes from 'prop-types';
import GuideInput from './GuideInput';
import './GuideSupplement.css';

const labels = { startup: 'Startup', block: 'On block', hit: 'On hit', counterHit: 'Counter hit' };

export default function GuideSupplement({ guide, referenceOnly = false }) {
  const [query, setQuery] = useState('');
  if (!guide || !(guide.moves?.length || guide.techniques?.length || (!referenceOnly && (guide.combos?.length || Object.values(guide.punishers || {}).some(rows => rows.length))))) return null;
  const moves = (guide.moves || []).filter(move => `${move.name} ${move.input}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="guide-supplement">
    {guide.versionNote && <p className="guide-extra-version">{guide.versionNote}</p>}
    {!referenceOnly && guide.combos?.length > 0 && <section className="guide-extra-section">
      <h2>More Combos</h2><div className="guide-extra-combos">{guide.combos.map((combo, index) => <article key={index}>
        <h3>{combo.category || 'Combo'}</h3>
        {combo.launchers?.length > 0 && <><strong className="guide-extra-label">Launchers</strong><div className="guide-extra-launchers">{combo.launchers.map(input => <div className="guide-extra-input" key={input}>{<GuideInput input={input} />}</div>)}</div><strong className="guide-extra-label">Follow-up</strong></>}
        <div className="guide-extra-input">{<GuideInput input={combo.followUp || combo.input} />}</div>
        {combo.damage && <p>Damage: {combo.damage}</p>}{combo.notes && <p>{combo.notes}</p>}
      </article>)}</div>
    </section>}
    {!referenceOnly && Object.values(guide.punishers || {}).some(rows => rows.length) && <section className="guide-extra-section">
      <h2>Additional Punishers</h2><div className="guide-extra-punishment">{['standing', 'crouching'].map(position => <div key={position}>
        <h3>{position === 'standing' ? 'Standing' : 'While rising / crouching'}</h3>
        <dl>{(guide.punishers[position] || []).filter(row => row.frames <= 18 || row.launcher).map((row, index) => <div className="guide-extra-punisher" key={index}>
          <dt>i{row.frames}</dt><dd><div className="guide-extra-input">{<GuideInput input={row.input} />}</div>{row.notes && <p>{row.notes}</p>}</dd>
        </div>)}</dl>
      </div>)}</div>
    </section>}
    {guide.techniques?.length > 0 && <section id="guide-techniques" className="guide-extra-section">
      <h2>Techniques</h2>{guide.techniques.map((technique, index) => <article className="guide-extra-technique" key={index}><h3>{technique.title}</h3>{technique.input && <div className="guide-extra-input"><GuideInput input={technique.input} /></div>}<p>{technique.text}</p></article>)}
    </section>}
    {guide.moves?.length > 0 && <section id="guide-moves" className="guide-extra-section">
      <h2>Move List</h2>
      <label className="guide-extra-search">Find a move<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Move name or notation…" /></label>
      <p className="guide-extra-count" role="status">{moves.length} moves</p>
      <dl className="guide-extra-moves">{moves.map((move, index) => <div className="guide-extra-move" key={index}>
        <dt><strong>{move.name || move.input}</strong><div className="guide-extra-input">{<GuideInput input={move.input} />}</div></dt>
        <dd>{(move.damage || move.hitLevel) && <p>{move.damage && `Damage: ${move.damage}`}{move.damage && move.hitLevel && ' · '}{move.hitLevel}</p>}
          {move.frameData && <dl className="guide-extra-frames">{Object.entries(labels).filter(([key]) => move.frameData[key]).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{move.frameData[key]}</dd></div>)}</dl>}
          {move.notes && <p>{move.notes}</p>}
        </dd>
      </div>)}</dl>
    </section>}
  </div>;
}
GuideSupplement.propTypes = { guide: PropTypes.object, referenceOnly: PropTypes.bool };
