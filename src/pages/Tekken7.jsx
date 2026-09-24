import { usePageData } from '../context/PageDataContext';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getTekken7Essentials } from '../utils/apiClient';
import renderInputImage from '../utils/renderInputImage';
import { StanceContext } from '../context/StanceContext';
import { tekken7StanceLabels } from '../data/tekken7Notation';
import GuideSupplement from '../components/GuideSupplement';
import GuideInput from '../components/GuideInput';
import './Tekken7.css';

const isWallCombo = row => (row.category || '').split(' / ').some(category => /^(?:wall|wall ender|wall combos?|specific wall combos?|clean wallsplat)$/i.test(category));

function Punishment({ title, rows }) {
  return <section className="t7-section"><h2>{title}</h2><dl className="t7-punishers">
    {rows.map((row, i) => <div key={`${row.frames}-${i}`}><dt><strong>i{row.frames}</strong><small>vs −{row.frames} or worse</small></dt>
      <dd>{<GuideInput input={row.input} />}{row.notes && <p className="t7-small">{row.notes}</p>}</dd></div>)}
  </dl></section>;
}
Punishment.propTypes = { title: PropTypes.string.isRequired, rows: PropTypes.arrayOf(PropTypes.shape({
  frames: PropTypes.number.isRequired, input: PropTypes.string.isRequired,
})).isRequired };

export default function Tekken7() {
  const { characterSlug } = useParams();
  const [initialData] = useState(usePageData());
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    getTekken7Essentials({ signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setData(result);
    }).catch(err => {
      if (!initialData && err.name !== 'AbortError' && !controller.signal.aborted) setError('The Tekken 7 guides could not be loaded. Please try again.');
    });
    return () => controller.abort();
  }, [retry, initialData]);
  const character = data?.characters.find(c => c.slug === characterSlug);
  const supplement = character?.supplement;
  const combos = character ? [...character.combos, ...(supplement?.combos || []).filter(row => !isWallCombo(row))] : [];
  const punishers = character ? Object.fromEntries(['standing', 'crouching'].map(position => [position,
    [...character.punishers[position], ...(supplement?.punishers?.[position] || []).filter(row => row.frames <= 18 || row.launcher)].sort((a, b) => a.frames - b.frames),
  ])) : null;
  const missing = Boolean(data && characterSlug && !character);
  const stanceLabels = character ? Object.entries(tekken7StanceLabels).filter(([token]) =>
    new RegExp(`\\b${token}\\b`).test(JSON.stringify([combos, character.wallCombos, punishers, supplement]))) : [];
  return <StanceContext.Provider value={tekken7StanceLabels}><main className="t7-page">
    <nav className="t7-breadcrumb" aria-label="Breadcrumb"><Link to="/">Games</Link><span>/</span>
      {characterSlug ? <><Link to="/games/tekken-7">Tekken 7</Link><span>/</span><span>{character?.name || 'Character'}</span></> : <span>Tekken 7</span>}
    </nav>
    {error ? <div className="t7-status" role="alert"><h1>Couldn’t load the guides</h1><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Try again</button></div>
      : !data ? <p className="t7-status" role="status">Loading Tekken 7 guides…</p>
      : missing ? <div className="t7-status"><h1>Character not found</h1><Link to="/games/tekken-7">Back to the roster →</Link></div>
      : <><header className="t7-header"><div><p className="t7-kicker">Tekken 7 · Essentials</p><h1>{character?.name || 'Tekken 7 Combos & Character Guides'}</h1>
        <p>{character ? 'Punish. Break. Launch.' : `${data.characters.length} fighters. Punishers, throw breaks and combos—straight to the inputs.`}</p></div>
        {character && <img className="t7-header-art" src={character.image} alt={`${character.name} official Tekken 7 artwork`} />}
      </header>
      {!character ? <><label className="t7-search">Find your fighter<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search characters…" /></label>
        <div className="t7-roster">{data.characters.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase())).map(c =>
          <Link className="t7-fighter" key={c.slug} to={`/games/tekken-7/${c.slug}`}><img src={c.image} alt="" loading="lazy" width="506" height="108" /><span>{c.name}<small>View guide</small></span></Link>)}</div>
        {!data.characters.some(c => c.name.toLowerCase().includes(search.trim().toLowerCase())) && <p role="status">No fighters match that search.</p>}</>
        : <><nav className="t7-sections" aria-label="Guide sections"><a href="#t7-combos">Combos</a><a href="#t7-punish">Punishers</a><a href="#t7-throws">Throws</a><a href="#t7-wall">Wall combos</a>{supplement?.techniques?.length > 0 && <a href="#guide-techniques">Techniques</a>}{supplement?.moves?.length > 0 && <a href="#guide-moves">Move list</a>}</nav>
          <div className="t7-guide" key={character.slug}>
            <section className="t7-section" id="t7-combos"><h2>Main Combos</h2>
              <div className="t7-combos">{combos.map((combo, index) => <article className="t7-combo" key={index}>
                {combo.category && <p className="t7-small">{combo.category}</p>}
                <h3>Launcher{combo.launchers.length > 1 ? 's' : ''}</h3><div className="t7-launchers">{combo.launchers.map(input => <div key={input}>{<GuideInput input={input} />}</div>)}</div>
                <h3>Follow-up</h3><div className="t7-input">{<GuideInput input={combo.followUp} />}</div>{combo.damage && <p>Damage: {combo.damage}</p>}{combo.notes && <p>{combo.notes}</p>}
              </article>)}</div>
            </section>
            <div id="t7-punish"><div className="t7-punishment"><Punishment title="Standing Punishers" rows={punishers.standing} /><Punishment title="While Rising Punishers" rows={punishers.crouching} /></div>
              <p className="t7-small">i10 means 10-frame startup. Punish at the listed disadvantage or worse, provided the move reaches. Motion inputs and stance transitions also require their input timing.</p></div>
            <section className="t7-section" id="t7-throws"><h2>Important Throws</h2><div className="t7-throws">{character.throws.map((throwMove, i) => <article key={i}>
              <h3>{throwMove.name}</h3><div className="t7-input">{renderInputImage(throwMove.input)}</div>
              <div className="t7-break"><strong>Break</strong>{throwMove.break === '1 or 2' ? <>{renderInputImage('1')}<span>or</span>{renderInputImage('2')}</> : renderInputImage(throwMove.break)}</div>
              {throwMove.notes && <p>{throwMove.notes}</p>}</article>)}</div></section>
            <section className="t7-section" id="t7-wall"><h2>Wall Combos</h2>{[...character.wallCombos, ...(supplement?.combos || []).filter(isWallCombo).map(row => ({ ...row, input: row.followUp }))].map((combo, i) => <div className="t7-wall" key={i}>
              {combo.category && <p className="t7-small">{combo.category}</p>}
              {combo.launchers?.length > 0 && <><h3>Starter</h3><div className="t7-launchers">{combo.launchers.map(input => <div key={input}><GuideInput input={input} /></div>)}</div><h3>Follow-up</h3></>}
              <div className="t7-input"><GuideInput input={combo.input} /></div>{combo.damage && <p>Damage: {combo.damage}</p>}{combo.notes && <p>{combo.notes}</p>}</div>)}</section>
            <details className="t7-key"><summary>Input key & stance abbreviations</summary><p>1 = left punch · 2 = right punch · 3 = left kick · 4 = right kick. + means together; ~ before a direction means hold; ~ between buttons means a quick slide input; : marks strict timing.</p>
              <p>WS = while rising · FC = full crouch · CH = counter hit · {renderInputImage('screw')} = Tekken 7’s screw/spin extender · {renderInputImage('into')} = next combo step. Notes in parentheses describe timing or conditions.</p>
              <dl>{stanceLabels.map(([abbreviation, name]) => <div key={abbreviation}><dt>{abbreviation}</dt><dd>{name}</dd></div>)}</dl>
            </details>
            <GuideSupplement guide={supplement} referenceOnly />
          </div><Link className="t7-back" to="/games/tekken-7">← All Tekken 7 fighters</Link></>}
      </>}
  </main></StanceContext.Provider>;
}
