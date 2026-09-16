import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Paper } from '@mui/material';
import CollapsableSection from '../components/CollapsableSection';
import renderInputImage from '../utils/renderInputImage';
import { getTekken1Guides } from '../utils/tekken1';
import './Tekken1.css';

const sectionTitles = {
  throws: 'Throws', chains: 'Throw Follow-Ups', moves: 'Move List',
  combos: 'Combo Routes', strings: '10 Hit Combos',
  unblockables: 'Unblockable Attacks', pounces: 'Ground Attacks',
};
const rowType = PropTypes.shape({
  name: PropTypes.string.isRequired, input: PropTypes.string.isRequired,
  notes: PropTypes.string,
});

function Portrait({ character, sheet }) {
  const [failed, setFailed] = useState(false);
  const { x, y, width, height } = character.portrait;
  return (
    <span className="t1-portrait" style={{ aspectRatio: `${width} / ${height}` }}>
      {failed ? <span className="t1-portrait-fallback">{character.name}</span> : (
        <img src={sheet.image} alt={`${character.name} — Tekken 1 portrait`}
          onError={() => setFailed(true)}
          style={{ width: `${sheet.width / width * 100}%`, maxWidth: 'none',
            left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
      )}
    </span>
  );
}
Portrait.propTypes = {
  character: PropTypes.shape({ name: PropTypes.string.isRequired,
    portrait: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number,
      width: PropTypes.number, height: PropTypes.number }).isRequired }).isRequired,
  sheet: PropTypes.shape({ image: PropTypes.string, width: PropTypes.number }).isRequired,
};

function MoveSection({ title, rows }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Paper className="t1-section">
      <CollapsableSection title={title} toggleState={collapsed}
        collapseFn={() => setCollapsed(value => !value)}>
        <dl className="t1-moves">
          {rows.map((row, index) => (
            <div className="t1-move" key={`${row.name}-${index}`}>
              <dt>{row.name}</dt>
              <dd>
                {row.input && <div className="t1-input">{renderInputImage(row.input)}</div>}
                {row.notes && <p>{row.notes}</p>}
              </dd>
            </div>
          ))}
        </dl>
      </CollapsableSection>
    </Paper>
  );
}
MoveSection.propTypes = { title: PropTypes.string.isRequired, rows: PropTypes.arrayOf(rowType).isRequired };

function NotationKey() {
  return (
    <Paper className="t1-notation">
      <h2>Input key</h2>
      <p><strong>1</strong> = LP / □ &nbsp; <strong>2</strong> = RP / △ &nbsp;
        <strong>3</strong> = LK / × &nbsp; <strong>4</strong> = RK / ○</p>
      <p>Left punch · Right punch · Left kick · Right kick</p>
      <p>f / b / d / u = forward / back / down / up. Diagonals combine letters.
        A comma means next input; + means together; ~ before a direction means hold; &gt; separates combo steps.
        FC means full crouch; n means return to neutral.
        Tap, crouch, release and timing instructions appear beside the move.</p>
      <p>Use the input display settings in the navigation to switch between icons and notation.</p>
    </Paper>
  );
}

export default function Tekken1() {
  const { characterSlug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    getTekken1Guides({ signal: controller.signal }).then(setData).catch(err => {
      if (err.name !== 'AbortError') setError('The Tekken 1 guides could not be loaded. Please try again.');
    });
    return () => controller.abort();
  }, [requestKey]);
  useEffect(() => { setSearch(''); }, [characterSlug]);

  const character = data?.characters.find(item => item.slug === characterSlug);
  const missing = Boolean(data && characterSlug && !character);
  const title = missing ? 'Character not found — Tekken 1' : character
    ? `${character.name} — Tekken 1 Moves & Combos` : 'Tekken 1 Character Guides';
  const description = character
    ? `${character.name}'s Tekken 1 throws, moves and combos in familiar 1/2/3/4 notation.`
    : 'Explore the original Tekken: 17 character move lists, throws, 10 hit combos and juggle routes.';
  const characterSectionTitles = { ...sectionTitles,
    ...(character?.sections.strings?.every(row => row.hits === 7) ? { strings: '7 Hit Combo' } : {}),
  };
  const canonical = `https://tekktician.com/games/tekken-1${character ? `/${character.slug}` : ''}`;
  const query = search.trim().toLowerCase();
  const visibleCharacters = data?.characters.filter(item => item.name.toLowerCase().includes(query)) || [];
  return (
    <main className="t1-page">
      <Helmet>
        <title>{title} | TEKKTICIAN</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} | TEKKTICIAN`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
        {missing && <meta name="robots" content="noindex" />}
      </Helmet>
      <nav className="t1-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Games</Link><span>/</span>
        {characterSlug ? <><Link to="/games/tekken-1">Tekken 1</Link><span>/</span><span>{character?.name || 'Character'}</span></> : <span>Tekken 1</span>}
      </nav>
      {error ? <div className="t1-status" role="alert"><h1>Couldn’t load the guides</h1><p>{error}</p>
        <button onClick={() => setRequestKey(key => key + 1)}>Try again</button></div>
        : !data ? <p className="t1-status" role="status">Loading Tekken 1 guides…</p>
        : missing ? <div className="t1-status"><h1>Character not found</h1><Link to="/games/tekken-1">Back to the Tekken 1 roster →</Link></div>
        : <>
          <header className={`t1-header${character ? ' t1-header--character' : ''}`}>
            {character && <Portrait character={character} sheet={data.portraits} />}
            <div><p className="t1-kicker">Tekken 1 · PlayStation archive</p>
              <h1>{character ? character.name : 'Back to the first fight.'}</h1>
              <p>{character ? 'Throws, moves and combos. The original game, in familiar notation.'
                : '17 fighters. Pick your character and get straight to the inputs.'}</p>
            </div>
          </header>
          <NotationKey />
          {character ? <>
            <nav className="t1-section-links" aria-label="Guide sections">
              {Object.entries(characterSectionTitles).filter(([key]) => character.sections[key]?.length).map(([key,title]) => <a key={key} href={`#t1-${key}`}>{title}</a>)}
            </nav>
            <div className="t1-guide" key={character.slug}>
              {Object.entries(characterSectionTitles).map(([key,title]) => character.sections[key]?.length ?
                <section id={`t1-${key}`} key={key} aria-label={title}><MoveSection title={title} rows={character.sections[key]} /></section> : null)}
            </div>
            {character.notes.length > 0 && <p className="t1-source-note">{character.notes.join(' ')}</p>}
            <Link className="t1-back" to="/games/tekken-1">← Choose another fighter</Link>
          </> : <>
            <label className="t1-search">Find a fighter
              <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search the roster…" />
            </label>
            <p className="t1-result-count" role="status">{visibleCharacters.length} {visibleCharacters.length === 1 ? 'fighter' : 'fighters'}</p>
            <div className="t1-roster">
              {visibleCharacters.map(item => <Link className="t1-card" key={item.slug}
                to={`/games/tekken-1/${item.slug}`} aria-label={`Open ${item.name} Tekken 1 guide`}>
                <Portrait character={item} sheet={data.portraits} /><h2>{item.name}</h2><span>Move list & guide ↗</span>
              </Link>)}
            </div>
            {!visibleCharacters.length && <p>No fighters match “{search}”. Try another name.</p>}
          </>}
          <footer className="t1-credits"><p>{data.source.label}. {data.source.note}</p>
            <p>{data.portraits.credit} <a href={data.portraits.sourceUrl} target="_blank" rel="noopener noreferrer">Portrait source ↗</a></p>
          </footer>
        </>}
    </main>
  );
}
