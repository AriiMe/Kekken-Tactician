import { usePageData } from '../context/PageDataContext';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getTekkenTag2Essentials } from '../utils/apiClient';
import renderInputImage from '../utils/renderInputImage';
import { StanceContext } from '../context/StanceContext';
import { tekkenTag2StanceLabels } from '../data/tekkenTag2Notation';
import { getTag2TeamRoutes } from '../utils/tag2Teams';
import './Tekken7.css';
import './TekkenTag2.css';

const rosterPath = '/games/tekken-tag-2';

function Punishment({ title, rows }) {
  return <section className="t7-section"><h2>{title}</h2><dl className="t7-punishers">
    {rows.map((row, i) => <div key={i}><dt><strong>i{row.frames}</strong><small>vs −{row.frames} or worse</small></dt>
      <dd>{renderInputImage(row.input)}<small className="tag2-hit-level">{row.hitLevel}</small></dd></div>)}
  </dl></section>;
}
Punishment.propTypes = { title: PropTypes.string.isRequired, rows: PropTypes.arrayOf(PropTypes.shape({
  frames: PropTypes.number.isRequired, input: PropTypes.string.isRequired, hitLevel: PropTypes.string.isRequired,
})).isRequired };

function TagBasics() {
  return <details className="t7-key tag2-basics"><summary>Tag controls & bound — the essentials</summary>
    <div className="tag2-controls">
      <div><strong>Switch fighter</strong><p>{renderInputImage('tag')}</p><p>A raw tag brings in your partner. Give yourself space; the entry can be punished.</p></div>
      <div><strong>Direct Tag Assault</strong><p>{renderInputImage('1+2+tag')}</p><p>The universal attack starts a Tag Assault on hit.</p></div>
      <div><strong>Tag Crash</strong><p>{renderInputImage('2+tag')}</p><p>Use while grounded with your partner in Rage. This spends their Rage and your active fighter’s recoverable health.</p></div>
    </div>
    <p>{renderInputImage('bound')} <strong>Bound (B!)</strong> slams an airborne opponent down so you can extend the juggle. Use one bound per normal juggle.</p>
    <p><strong>Tag combo:</strong> tap TAG during a taggable launcher. Your partner takes over and stays in. <strong>Tag Assault:</strong> tap TAG as the bound move connects; your partner assists, then control returns. The assist costs their recoverable health and gives the opponent’s partner Rage.</p>
  </details>;
}

function InputKey() {
  return <details className="t7-key"><summary>Input key</summary><p>1 = left punch · 2 = right punch · 3 = left kick · 4 = right kick · {renderInputImage('tag')} = tag button (5).</p>
    <p>+ = together · ~ between inputs = immediately after · ~ before a direction = hold · : = strict timing. WS = while rising · FC = full crouch · CH = counter hit.</p>
    <p>{renderInputImage('bound')} = Bound (B!), Tag 2’s juggle extender · {renderInputImage('into')} = next combo step. Commas stay within a move or string.</p>
  </details>;
}

function TeamCombos({ character, characters }) {
  const [partner, setPartner] = useState('all');
  const routes = getTag2TeamRoutes(characters, character.slug);
  const fighter = slug => characters.find(c => c.slug === slug);
  const partners = [...new Set(routes.map(r => r.teammate))].map(fighter).sort((a,b) => a.name.localeCompare(b.name));
  const visible = routes.filter(r => partner === 'all' || r.teammate === partner);
  if (!routes.length) return null;
  return <section className="t7-section" id="tag2-team"><div className="tag2-team-heading"><div><h2>Team Combos</h2><p className="t7-small">{routes.length} routes · {partners.length} partners. Both starting orders included.</p></div>
    <label className="tag2-partner-select">Choose partner<select value={partner} onChange={e => setPartner(e.target.value)}><option value="all">All partners</option>{partners.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label></div>
    <p className="t7-small" role="status">{visible.length} {visible.length === 1 ? 'combo' : 'combos'}{partner !== 'all' && ` with ${fighter(partner).name}`}</p>
    {visible.map((combo,i) => <details className="tag2-team" key={`${partner}-${combo.id}`} open={i === 0}>
      <summary><img src={fighter(combo.teammate).image} width="44" height="47" alt="" loading="lazy" /><span className="tag2-team-title"><strong>{fighter(combo.teammate).name}</strong><small>{fighter(combo.lead).name} starts · {combo.type}{combo.requirement && <em>{combo.requirement}</em>}</small></span><span className="tag2-starter"><small>Starter</small>{renderInputImage(combo.steps[0].input.split(' into ')[0])}</span><span className="tag2-expand" aria-hidden="true">+</span></summary>
      <div className="tag2-team-body"><ol>{combo.steps.map((step,j) => <li className={step.fighter === combo.lead ? 'tag2-lead-step' : 'tag2-assist-step'} key={j}><strong>{fighter(step.fighter).name}{step.role && <small>{step.role}</small>}</strong><div className="t7-input">{renderInputImage(step.input)}</div></li>)}</ol>{combo.notes && <p className="t7-small">{combo.notes}</p>}
        <Link className="tag2-partner-guide" to={`${rosterPath}/${combo.teammate}`}>{fighter(combo.teammate).name} guide</Link></div>
    </details>)}
  </section>;
}
TeamCombos.propTypes = { character: PropTypes.object.isRequired, characters: PropTypes.array.isRequired };

export default function TekkenTag2() {
  const { characterSlug } = useParams();
  const { hash } = useLocation();
  const [initialData] = useState(usePageData());
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    getTekkenTag2Essentials({ signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setData(result);
    }).catch(err => {
      if (!initialData && err.name !== 'AbortError' && !controller.signal.aborted) setError('The Tag 2 guides could not be loaded. Please try again.');
    });
    return () => controller.abort();
  }, [retry, initialData]);
  const character = data?.characters.find(c => c.slug === characterSlug);
  useEffect(() => {
    if (character && /^#tag2-(combos|punish|moves|team)$/.test(hash)) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [character, hash]);
  const missing = Boolean(data && characterSlug && !character);
  const visible = data?.characters.filter(c => c.name.toLowerCase().includes(search.trim().toLowerCase()));
  const teamRoutes = character ? getTag2TeamRoutes(data.characters, character.slug) : [];
  const labels = { ...Object.fromEntries((data?.characters || []).flatMap(c => c.stances).map(s => [s.abbreviation,s.name])), ...tekkenTag2StanceLabels };
  return <StanceContext.Provider value={labels}><main className="t7-page tag2-page">
    <nav className="t7-breadcrumb" aria-label="Breadcrumb"><Link to="/">Games</Link><span>/</span>
      {characterSlug ? <><Link to={rosterPath}>Tekken Tag 2</Link><span>/</span><span>{character?.name || 'Character'}</span></> : <span>Tekken Tag 2</span>}
    </nav>
    {error ? <div className="t7-status" role="alert"><h1>Couldn’t load the guides</h1><p>{error}</p><button onClick={() => setRetry(n => n + 1)}>Try again</button></div>
      : !data ? <p className="t7-status" role="status">Loading Tag 2 guides…</p>
      : missing ? <div className="t7-status"><h1>Character not found</h1><Link to={rosterPath}>Back to the roster →</Link></div>
      : <><header className="t7-header"><div><p className="t7-kicker">Tekken Tag Tournament 2 · Essentials</p><h1>{character?.name || 'Tekken Tag Tournament 2 Combos & Guides'}</h1>
        <p>{character ? 'Launch. Bound. Tag.' : `59 fighters. ${data.characters.reduce((total,c) => total+c.teamCombos.length,0)} team routes. Find your duo.`}</p></div>
        {character && <img className="tag2-portrait" src={character.image} alt={character.name} width="100" height="106" />}
      </header>
      {!character ? <><label className="t7-search">Find your fighter<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search characters…" /></label>
        <div className="tag2-roster">{visible.map(c => <Link className="tag2-fighter" key={c.slug} to={`${rosterPath}/${c.slug}`}>
          <div className="tag2-card-art"><img src={c.image} alt="" loading="lazy" width="100" height="106" /></div><span>{c.name}</span><small className="tag2-guide-label">{c.mimic ? c.slug === 'mokujin' ? 'Mimic guide' : 'Custom moveset' : 'Combos & guide'}</small>
        </Link>)}</div>{!visible.length && <p role="status">No fighters match that search.</p>}<div className="tag2-roster-help"><TagBasics /><InputKey /></div></>
        : <><nav className="t7-sections" aria-label="Guide sections">
          {!character.mimic && <><a href="#tag2-combos">Combos</a><a href="#tag2-punish">Punishers</a><a href="#tag2-moves">Bound & tag</a></>}
          {teamRoutes.length > 0 && <a href="#tag2-team">Team combos ({teamRoutes.length})</a>}
        </nav><div className="t7-guide" key={character.slug}>
          {character.mimic ? <section className="t7-section"><h2>{character.slug === 'mokujin' ? 'Use the copied fighting style' : 'Build around your equipped moves'}</h2><p>{character.mimic}</p><Link to={rosterPath}>Find the original fighter’s guide →</Link></section>
            : <><section className="t7-section" id="tag2-combos"><h2>Main Combos</h2><div className="t7-combos">
              {character.combos.map((combo, index) => <article className="t7-combo" key={index}>
                <h3>Launcher</h3><div className="t7-launchers">{combo.launchers.map(input => <div key={input}>{renderInputImage(input)}</div>)}</div>
                <h3>Follow-up</h3><div className="t7-input">{renderInputImage(combo.followUp)}</div>{combo.notes && <p>{combo.notes}</p>}
              </article>)}
            </div></section>
            <div id="tag2-punish"><div className="t7-punishment"><Punishment title="Standing Punishers" rows={character.punishers.standing} /><Punishment title="While Rising Punishers" rows={character.punishers.crouching} /></div>
              <p className="t7-small">A few useful picks. i10 = 10-frame startup; punish −10 or worse if the move reaches. Highs can miss a crouching recovery. Later contact frames and pushback can change what connects.</p></div>
            <div className="t7-punishment" id="tag2-moves"><section className="t7-section"><h2>Bound Moves</h2><p className="t7-small">Use on an airborne opponent. Tap TAG as the bound connects for a Tag Assault.</p>
              <ul className="tag2-moves">{character.boundMoves.map(m => <li key={m.input}>{renderInputImage(`${m.input} bound`)}</li>)}</ul></section>
              <section className="t7-section"><h2>Tag Launchers</h2><p className="t7-small">Tap TAG during the move when it launches. Your partner takes over; counter-hit and crouch requirements still apply.</p>
                <ul className="tag2-moves">{character.tagLaunchers.map(m => <li key={m.input}>{renderInputImage(m.input)}</li>)}</ul></section></div>
          </>}
          <TeamCombos key={character.slug} character={character} characters={data.characters} />
          {character.stances.length > 0 && <details className="t7-key"><summary>Stances & entry inputs</summary><dl className="tag2-stances">{character.stances.map(s => <div key={s.abbreviation}><dt>{s.abbreviation}</dt><dd><strong>{s.name}</strong><div className="t7-input">{renderInputImage(s.input)}</div>{s.notes && <small>{s.notes}</small>}</dd></div>)}</dl></details>}
        </div><Link className="t7-back" to={rosterPath}>← All Tag 2 fighters</Link></>}
      </>}
  </main></StanceContext.Provider>;
}
