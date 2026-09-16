import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiBookOpen,
  FiCrosshair,
  FiLock,
  FiZap,
} from "react-icons/fi";
import { gameFilters, games, liveGames, upcomingGames } from "../data/games";
import "./GameLibrary.css";

const FEATURE_ITEMS = [
  { icon: FiZap, label: "Combo routes" },
  { icon: FiCrosshair, label: "Punishment" },
  { icon: FiBookOpen, label: "Matchup notes" },
];

function GameArtwork({ game }) {
  if (game.artworkType === "cover") {
    return (
      <img
        className="game-card__cover"
        src={game.artwork}
        alt=""
        loading={game.availability === "live" ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div className="game-card__logo-stage" aria-hidden="true">
      <span className="game-card__era-mark">{game.shortTitle}</span>
      <span className="game-card__grid" />
      <img
        className="game-card__logo"
        src={game.artwork}
        alt=""
        loading="lazy"
      />
    </div>
  );
}

GameArtwork.propTypes = {
  game: PropTypes.shape({
    artwork: PropTypes.string,
    artworkType: PropTypes.oneOf(["cover", "logo"]).isRequired,
    availability: PropTypes.oneOf(["live", "soon"]).isRequired,
    shortTitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

function GameCard({ game }) {
  const isLive = game.availability === "live";
  const content = (
    <>
      <div className="game-card__media">
        <GameArtwork game={game} />
        <span
          className={`game-card__status game-card__status--${game.availability}`}
        >
          {isLive ? (
            <>
              <span className="game-card__live-dot" /> Live
            </>
          ) : (
            <>
              <FiLock aria-hidden="true" /> Under Construction
            </>
          )}
        </span>
        {isLive && (
          <span className="game-card__open-icon" aria-hidden="true">
            <FiArrowUpRight />
          </span>
        )}
      </div>
      <div className="game-card__body">
        <div>
          <p className="game-card__series">
            {game.series === "tekken" ? "Iron Fist archive" : "Fighting game"}
          </p>
          <h3>{game.title}</h3>
        </div>
        <span className="game-card__year">{game.year}</span>
      </div>
      {isLive && game.description && (
        <p className="game-card__description">{game.description}</p>
      )}
    </>
  );

  const style = {
    "--game-accent": game.accent,
    "--game-surface": game.surface,
  };

  return (
    <article
      className={`game-card ${isLive ? "game-card--live" : "game-card--soon"}`}
      style={style}
      aria-disabled={isLive ? undefined : "true"}
    >
      {isLive ? (
        <Link
          className="game-card__link"
          to={game.route}
          aria-label={`Open ${game.title} guides`}
        >
          {content}
        </Link>
      ) : (
        <div className="game-card__link">{content}</div>
      )}
    </article>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    accent: PropTypes.string.isRequired,
    artwork: PropTypes.string,
    artworkType: PropTypes.oneOf(["cover", "logo"]).isRequired,
    availability: PropTypes.oneOf(["live", "soon"]).isRequired,
    description: PropTypes.string,
    route: PropTypes.string,
    series: PropTypes.oneOf(["tekken", "other"]).isRequired,
    shortTitle: PropTypes.string.isRequired,
    surface: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
  }).isRequired,
};

export default function GameLibrary() {
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleGames = useMemo(
    () =>
      activeFilter === "all"
        ? games
        : games.filter((game) => game.series === activeFilter),
    [activeFilter],
  );

  return (
    <main className="game-library">
      <Helmet>
        <title>TEKKTICIAN (formerly Tekken Tactician) — Combos &amp; Guides</title>
        <meta
          name="description"
          content="TEKKTICIAN, formerly known as Tekken Tactician: the same community project for Tekken 8 combos, punishment, matchup notes and fighting-game guides."
        />
        <link rel="canonical" href="https://tekktician.com/" />
        <meta property="og:url" content="https://tekktician.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="TEKKTICIAN (formerly Tekken Tactician) — Combos & Guides"
        />
        <meta
          property="og:description"
          content="TEKKTICIAN, formerly known as Tekken Tactician: the same community project for Tekken 8 combos, punishment, matchup notes and fighting-game guides."
        />
        <meta
          property="og:image"
          content="https://tekktician.com/game-art/tekken-8.jpg"
        />
        <meta
          property="og:image:alt"
          content="Official Tekken 8 title artwork on TEKKTICIAN"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="TEKKTICIAN (formerly Tekken Tactician) — Combos & Guides"
        />
        <meta
          name="twitter:description"
          content="TEKKTICIAN, formerly known as Tekken Tactician: the same community project for Tekken 8 combos, punishment, matchup notes and fighting-game guides."
        />
        <meta
          name="twitter:image"
          content="https://tekktician.com/game-art/tekken-8.jpg"
        />
      </Helmet>

      <section className="game-hero" aria-labelledby="game-hero-title">
        <div className="game-hero__copy">
          <p className="game-hero__eyebrow">
            <span /> Community-built fighting game knowledge
          </p>
          <h1 id="game-hero-title">
            Pick the game.
            <span>Build the gameplan.</span>
          </h1>
          <p className="game-hero__intro">
            TEKKTICIAN, formerly known as Tekken Tactician, is growing beyond
            one arena: practical combos,
            punishment, matchup knowledge and lab notes for the fighters you
            actually play.
          </p>
          <div className="game-hero__actions">
            <Link className="game-hero__primary" to="/games/tekken-8">
              Enter Tekken 8 <FiArrowUpRight aria-hidden="true" />
            </Link>
            <a className="game-hero__secondary" href="#game-roadmap">
              See the full lineup <FiArrowDown aria-hidden="true" />
            </a>
          </div>
          <dl className="game-hero__stats" aria-label="Library status">
            <div>
              <dt>{String(liveGames.length).padStart(2, "0")}</dt>
              <dd>Games live</dd>
            </div>
            <div>
              <dt>{String(upcomingGames.length).padStart(2, "0")}</dt>
              <dd>In the lab</dd>
            </div>
            <div>
              <dt>∞</dt>
              <dd>Ways to improve</dd>
            </div>
          </dl>
        </div>

        <div
          className="game-hero__feature"
          aria-label="Tekken 8 is available now"
        >
          <div className="game-hero__feature-art">
            <img
              src="/game-art/tekken-8.jpg"
              alt="Tekken 8 title art featuring Jin Kazama and Kazuya Mishima"
            />
            <span className="game-hero__available">
              <span /> Available now
            </span>
          </div>
          <div className="game-hero__feature-body">
            <div>
              <p>Current arena</p>
              <h2>Tekken 8</h2>
            </div>
            <ul>
              {FEATURE_ITEMS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon aria-hidden="true" /> {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="game-roadmap"
        id="game-roadmap"
        aria-labelledby="game-roadmap-title"
      >
        <div className="game-roadmap__header">
          <div>
            <p className="game-roadmap__kicker">The roster</p>
            <h2 id="game-roadmap-title">Choose your arena</h2>
            <p>
              Tekken 8 and Tekken 1 are ready. Every grey title is queued for a future guide
              release.
            </p>
          </div>
          <div className="game-filters" aria-label="Filter games">
            {gameFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={activeFilter === filter.id ? "is-active" : ""}
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="game-grid">
          {visibleGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section
        className="game-library__closing"
        aria-label="TEKKTICIAN mission"
      >
        <span>Learn the matchup</span>
        <span aria-hidden="true">•</span>
        <strong>Own the round</strong>
        <span aria-hidden="true">•</span>
        <span>Share the tech</span>
      </section>
    </main>
  );
}
