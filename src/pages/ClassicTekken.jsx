import { usePageData } from '../context/PageDataContext';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import CollapsableSection from '../components/CollapsableSection';
import renderInputImage from '../utils/renderInputImage';
import { getClassicTekkenGuides, gameTitles } from '../utils/classicTekken';
import { classicSectionTitles as sectionTitles, getClassicPunishers } from '../utils/classicGuideLayout';
import './Tekken1.css';

const rowType = PropTypes.shape({
  name: PropTypes.string.isRequired, input: PropTypes.string.isRequired,
  notes: PropTypes.string,
  launchers: PropTypes.arrayOf(PropTypes.string),
  alternateInputs: PropTypes.arrayOf(PropTypes.string),
  frameData: PropTypes.objectOf(PropTypes.string),
  edition: PropTypes.string,
  availability: PropTypes.string,
  versions: PropTypes.arrayOf(PropTypes.object),
});

const frameLabels = {
  startup: 'Startup', block: 'On block', hit: 'On hit',
  crouchingHit: 'Crouching hit', counterHit: 'Counter hit',
};

const editionLabels = { tekken5: 'Tekken 5', dr: 'DR', unverified: 'Version unverified' };

function EditionBadge({ edition, availability }) {
  const label = availability === 'dr-only' ? 'DR only' : editionLabels[edition];
  return label ? <span className={`t1-edition${availability === 'dr-only' ? ' t1-edition--dr' : ''}`}>{label}</span> : null;
}
EditionBadge.propTypes = { edition: PropTypes.string, availability: PropTypes.string };

function MoveFacts({ row }) {
  const frames = row.frameData || row.referenceFrameData;
  return <>
    {(row.damage || row.hitLevel) && <p>{row.damage && `Damage: ${row.damage}`}{row.damage && row.hitLevel && ' · '}{row.hitLevel}</p>}
    {row.frameScope && <p>{row.frameScope}</p>}
    {frames && <dl className="t1-frame-data" aria-label="Frame data">
      {Object.entries(frameLabels).filter(([key]) => frames[key]).map(([key, label]) =>
        <div key={key}><dt>{label}</dt><dd>{frames[key].split(/\s+/).map(value => value === 'x' ? '—' : value).join(' / ')}{key === 'startup' ? 'f' : ''}</dd></div>)}
    </dl>}
    {row.reportedDamage && <p>Guide damage: {row.reportedDamage}</p>}
    {row.breakInput && <p>Throw break: {renderInputImage(row.breakInput)}</p>}
    {row.unbreakable && <p>Unbreakable</p>}
    {row.notes && <p>{row.notes}</p>}
  </>;
}
MoveFacts.propTypes = { row: PropTypes.object.isRequired };

function Portrait({ character, sheet, gameTitle }) {
  const [failed, setFailed] = useState(false);
  const { x, y, width, height, image, fit, framing } = character.portrait || {};
  return (
    <span className="t1-portrait" style={{ aspectRatio: image || !width || !height ? '1' : `${width} / ${height}` }}>
      {failed || (!image && !sheet.image) ? <span className="t1-portrait-fallback">{character.name}</span> : (
        <img src={image || sheet.image} alt={`${character.name} — ${gameTitle} portrait`}
          onError={() => setFailed(true)}
          style={framing ? { width: `${100 / framing.size}%`, height: 'auto', maxWidth: 'none', left: `${-framing.x / framing.size}%`, top: `${-framing.y / framing.size}%` } : image ? { width: '100%', height: '100%', objectFit: fit || 'cover', objectPosition: character.portrait.position || 'center' } : { width: `${sheet.width / width * 100}%`, maxWidth: 'none',
            left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
      )}
    </span>
  );
}
Portrait.propTypes = {
  character: PropTypes.shape({ name: PropTypes.string.isRequired,
    portrait: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number, image: PropTypes.string, fit: PropTypes.string, position: PropTypes.string,
      width: PropTypes.number, height: PropTypes.number, framing: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number, size: PropTypes.number }) }).isRequired }).isRequired,
  sheet: PropTypes.shape({ image: PropTypes.string, width: PropTypes.number }).isRequired,
  gameTitle: PropTypes.string.isRequired,
};

function MoveSection({ title, rows, combo = false }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Paper className={`t1-section${combo ? ' t1-section--combos' : ''}`}>
      <CollapsableSection title={title} toggleState={collapsed}
        collapseFn={() => setCollapsed(value => !value)}>
        <dl className="t1-moves">
          {rows.map((row, index) => (
            <div className="t1-move" key={`${row.name}-${index}`}>
              <dt>{row.abbreviation ? `${row.abbreviation} — ${row.name}` : row.name}<EditionBadge edition={row.edition} availability={row.availability} /></dt>
              <dd>
                {row.partners?.length > 0 && <p>Partner: {row.partners.join(' / ')}</p>}
                {row.launchers?.length > 0 && <>
                  <span className="t1-combo-label">{row.launchers.length > 1 ? 'Launcher (choose one)' : 'Launcher'}</span>
                  <ul className="t1-launchers">
                    {row.launchers.map(launcher => <li className="t1-input" key={launcher}>{renderInputImage(launcher)}</li>)}
                  </ul>
                  <span className="t1-combo-label">Follow-up</span>
                </>}
                {row.input && <div className="t1-input">{renderInputImage(row.input)}</div>}
                {row.alternateInputs?.map(input => <div className="t1-input" key={input}><span className="t1-combo-label">Or</span>{renderInputImage(input)}</div>)}
                {row.startupFrames && <p>{row.startupFrames} frames{row.position ? ` · ${row.position}` : ''}</p>}
                <MoveFacts row={row} />
                {row.versions?.map(version => <div className="t1-version" key={version.edition}>
                  <strong className="t1-combo-label">{editionLabels[version.edition]}</strong>
                  {version.name && version.name !== row.name && <p>{version.name}</p>}
                  {version.input && <div className="t1-input">{renderInputImage(version.input)}</div>}
                  {version.alternateInputs?.map(input => <div className="t1-input" key={input}><span className="t1-combo-label">Or</span>{renderInputImage(input)}</div>)}
                  <MoveFacts row={version} />
                </div>)}
                {row.taggable && <p>Tag available: append {renderInputImage('~5')}{row.tagClass ? ` · Class ${row.tagClass}` : ''}.{row.tagCondition ? ` ${row.tagCondition}` : ''}{row.tagClass === 5 ? ' No guaranteed follow-up in general.' : ''}</p>}
              </dd>
            </div>
          ))}
        </dl>
      </CollapsableSection>
    </Paper>
  );
}
MoveSection.propTypes = { title: PropTypes.string.isRequired, rows: PropTypes.arrayOf(rowType).isRequired, combo: PropTypes.bool };

function Punishment({ rows }) {
  const hasFrames = rows.standing.length + rows.crouching.length > 0;
  return <section id="t1-punishers" aria-label="Punishers">
    {hasFrames ? <>
      <div className="t1-punishment">
        {Object.entries(rows).map(([position, moves]) => <Paper className="t1-punishment-panel" key={position}>
          <h2>{position === 'standing' ? 'Standing Punishers' : 'While Rising / Crouching Punishers'}</h2>
          <dl>{[...new Set(moves.map(row => row.frames))].map(frames => <div className="t1-punisher" key={frames}>
            <dt><strong>i{frames}</strong><small>{moves.some(row => row.frames === frames && row.reference) ? 'Tag reference' : 'Startup'}</small></dt>
            <dd className="t1-punisher-options">{moves.filter(row => row.frames === frames).map((row, index) => <div key={index}>
              <div className="t1-input">{renderInputImage(row.input)}</div>
              <EditionBadge edition={row.edition} availability={row.availability} />
              {row.launcher && <span className="t1-edition">Launcher</span>}
              {row.motion && <small className="t1-combo-label">+ command entry</small>}
            </div>)}</dd>
          </div>)}</dl>
          {!moves.length && <p className="t1-source-note">No startup data available for this position.</p>}
        </Paper>)}
      </div>
      <p className="t1-source-note">Startup reference: check range and recovery position. String entries show only the opening hit; follow-ups are in the move list. Motion launchers need additional command-entry time. Stance-only attacks are excluded.</p>
    </> : <Paper className="t1-punishment-panel"><h2>Punishers</h2><p className="t1-source-note">Startup data is not available for this character yet.</p></Paper>}
  </section>;
}
Punishment.propTypes = { rows: PropTypes.shape({ standing: PropTypes.array.isRequired, crouching: PropTypes.array.isRequired }).isRequired };

function NotationKey() {
  return (
    <Paper className="t1-notation">
      <h2>Input key</h2>
      <p><strong>1</strong> = LP / □ &nbsp; <strong>2</strong> = RP / △ &nbsp;
        <strong>3</strong> = LK / × &nbsp; <strong>4</strong> = RK / ○</p>
      <p>Left punch · Right punch · Left kick · Right kick</p>
      <p>f / b / d / u = forward / back / down / up. Diagonals combine letters.
        A comma means next input; + means together; ~ before a direction means hold; {renderInputImage('into')} separates combo steps.
        ~ between buttons means press them in quick succession.
        FC means full crouch; WS means attack while rising from crouch; CH means counter hit; n means return to neutral.
        Tap, crouch, release and timing instructions appear beside the move.</p>
      <p>Use the input display settings in the navigation to switch between icons and notation.</p>
    </Paper>
  );
}

export default function ClassicTekken({ gameId }) {
  const gameTitle = gameTitles[gameId];
  const rosterPath = `/games/${gameId}`;
  const { characterSlug } = useParams();
  const pageData = usePageData();
  const [initialData] = useState(() => { const seed = pageData; return seed?.gameId === gameId ? seed : null; });
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setError('');

    getClassicTekkenGuides(gameId, { signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setData(result);
    }).catch(err => {
      if (!initialData && err.name !== 'AbortError' && !controller.signal.aborted) setError(`The ${gameTitle} guides could not be loaded. Please try again.`);
    });
    return () => controller.abort();
  }, [gameId, gameTitle, requestKey, initialData]);
  useEffect(() => { setSearch(''); }, [characterSlug]);

  const character = data?.characters.find(item => item.slug === characterSlug);
  const missing = Boolean(data && characterSlug && !character);
  const characterSectionTitles = { ...sectionTitles,
    ...(gameId === 'tekken-5' ? { strings: 'Preset Strings' } : {}),
    ...(character?.sections.strings?.every(row => row.hits === 7) ? { strings: '7 Hit Combo' } : {}),
  };
  const punishment = getClassicPunishers(character);
  const query = search.trim().toLowerCase();
  const visibleCharacters = data?.characters.filter(item => item.name.toLowerCase().includes(query)) || [];
  return (
    <main className="t1-page">
      <nav className="t1-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Games</Link><span>/</span>
        {characterSlug ? <><Link to={rosterPath}>{gameTitle}</Link><span>/</span><span>{character?.name || 'Character'}</span></> : <span>{gameTitle}</span>}
      </nav>
      {error ? <div className="t1-status" role="alert"><h1>Couldn’t load the guides</h1><p>{error}</p>
        <button onClick={() => setRequestKey(key => key + 1)}>Try again</button></div>
        : !data ? <p className="t1-status" role="status">Loading {gameTitle} guides…</p>
        : missing ? <div className="t1-status"><h1>Character not found</h1><Link to={rosterPath}>Back to the {gameTitle} roster →</Link></div>
        : <>
          <header className={`t1-header${character ? ' t1-header--character' : ''}`}>
            {character && <Portrait key={character.slug} character={character} sheet={data.portraits} gameTitle={gameTitle} />}
            <div><p className="t1-kicker">{gameTitle} · {data.edition} archive</p>
              <h1>{character ? character.name : `${gameTitle} Combos & Character Guides`}</h1>
              {character?.availability && <EditionBadge availability={character.availability} />}
              <p>{character ? 'Throws, moves and combos, in familiar notation.'
                : `${data.characters.length} fighters. Pick your character and get straight to the inputs.`}</p>
            </div>
          </header>
          {!character && <NotationKey />}
          {!character && data.mechanics?.length > 0 && <Paper className="t1-notation">
            <h2>{gameTitle} essentials</h2>
            {data.mechanics.map(item => <p key={item.title}><strong>{item.title}:</strong> {item.text}</p>)}
          </Paper>}
          {character ? <>
            {data.versionNote && <p className="t1-source-note">{data.versionNote}</p>}
            {Object.values(character.sections).flat().some(row => row.referenceFrameData) && <p className="t1-source-note">Frame values shown below are Tag Tournament references, not verified Tekken 3 measurements.</p>}
            <nav className="t1-section-links" aria-label="Guide sections">
              {Object.entries(characterSectionTitles).filter(([key]) => key === 'punishers' || character.sections[key]?.length).map(([key,title]) => <a key={key} href={`#t1-${key}`}>{title}</a>)}
            </nav>
            <div className="t1-guide" key={character.slug}>
              {Object.entries(characterSectionTitles).map(([key,title]) => key === 'punishers' ? <Punishment key={key} rows={punishment} /> : character.sections[key]?.length ?
                <section id={`t1-${key}`} key={key} aria-label={title}>
                  {key === 'combos' && data.comboNote && <p className="t1-source-note">{data.comboNote}</p>}
                  <MoveSection title={title} rows={character.sections[key]} combo={['combos', 'wallCombos', 'teamCombos'].includes(key)} />
                </section> : null)}
            </div>
            {character.sharedGuide && <Link className="t1-back" to={`${rosterPath}/${character.sharedGuide}`}>Open shared moves &amp; combos</Link>}
            {character.notes?.length > 0 && <p className="t1-source-note">{character.notes.join(' ')}</p>}
            <Link className="t1-back" to={rosterPath}>← Choose another fighter</Link>
          </> : <>
            <label className="t1-search">Find a fighter
              <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search the roster…" />
            </label>
            <p className="t1-result-count" role="status">{visibleCharacters.length} {visibleCharacters.length === 1 ? 'fighter' : 'fighters'}</p>
            <div className="t1-roster">
              {visibleCharacters.map(item => <Link className="t1-card" key={item.slug}
                to={`${rosterPath}/${item.slug}`} aria-label={`Open ${item.name} ${gameTitle} guide`}>
                <Portrait character={item} sheet={data.portraits} gameTitle={gameTitle} /><h2>{item.name} <EditionBadge availability={item.availability} /></h2><span>Moves & combos</span>
              </Link>)}
            </div>
            {!visibleCharacters.length && <p>No fighters match “{search}”. Try another name.</p>}
          </>}
          <footer className="t1-credits"><p>{data.source.label}. {data.source.note}</p>
            {data.portraits.sourceUrl && <p>{data.portraits.credit} <a href={data.portraits.sourceUrl} target="_blank" rel="noopener noreferrer">Portrait source</a></p>}
          </footer>
        </>}
    </main>
  );
}
ClassicTekken.propTypes = { gameId: PropTypes.oneOf(Object.keys(gameTitles)).isRequired };
