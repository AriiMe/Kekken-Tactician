import { useContext, useEffect, useRef, useState } from "react";
import { FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";
import { FiMenu, FiSettings, FiX } from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ColorModeContext } from "../context/ColorModeContext";
import { DisplayModeContext } from "../context/DisplayModeContext";
import { siteLinks } from "../data/siteLinks";
import "./NavBar.css";

const navItems = [
  { label: "Games", to: "/", end: true },
  { label: "Tekken 8", to: "/games/tekken-8" },
  { label: "Combo Maker", to: "/combo-generator" },
  { label: "Anti Guide", to: "/anti-guide" },
  { label: "Roulette", to: "/strat-roulette" },
];

const socialLinks = [
  {
    label: "Twitch",
    href: siteLinks.twitch,
    icon: FaTwitch,
  },
  {
    label: "YouTube",
    href: siteLinks.youtube,
    icon: FaYoutube,
  },
  {
    label: "Discord",
    href: siteLinks.discord,
    icon: FaDiscord,
  },
];

function PreferenceControls() {
  const { displayMode, setDisplayMode } = useContext(DisplayModeContext);
  const { colorMode, setColorMode } = useContext(ColorModeContext);

  return (
    <div className="nav-preferences">
      <div className="nav-preferences__heading">
        <span>Input display</span>
        <small>Tekken guides</small>
      </div>
      <div className="nav-preferences__row">
        <span>
          <strong>Input icons</strong>
          <small>Swap notation text for command icons</small>
        </span>
        <button
          type="button"
          className="nav-switch"
          role="switch"
          aria-label="Use input icons"
          aria-checked={displayMode === "icons"}
          onClick={() =>
            setDisplayMode(displayMode === "icons" ? "notations" : "icons")
          }
        >
          <span />
        </button>
      </div>
      <div className="nav-preferences__row">
        <span>
          <strong>Colored inputs</strong>
          <small>Use controller colors for attack buttons</small>
        </span>
        <button
          type="button"
          className="nav-switch"
          role="switch"
          aria-label="Use colored input icons"
          aria-checked={colorMode}
          onClick={() => setColorMode(!colorMode)}
        >
          <span />
        </button>
      </div>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="site-nav__socials" aria-label="Community links">
      {socialLinks.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const preferencesRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setPreferencesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        preferencesOpen &&
        preferencesRef.current &&
        !preferencesRef.current.contains(event.target)
      ) {
        setPreferencesOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreferencesOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [preferencesOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" to="/" aria-label="Tekktician game library">
          <img src="/main-icon.png" alt="" />
          <span className="site-brand__wordmark">
            TEKK<span>TICIAN</span>
          </span>
        </Link>

        <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <div className="site-header__preferences" ref={preferencesRef}>
            <button
              type="button"
              className="site-header__settings"
              aria-label="Open input display settings"
              aria-expanded={preferencesOpen}
              aria-controls="desktop-input-preferences"
              onClick={() => setPreferencesOpen((open) => !open)}
            >
              <FiSettings aria-hidden="true" />
              <span>Display</span>
            </button>
            {preferencesOpen && (
              <div id="desktop-input-preferences" className="site-header__popover">
                <PreferenceControls />
              </div>
            )}
          </div>

          <button
            type="button"
            className="site-header__menu-button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`site-nav__mobile-panel ${mobileOpen ? "is-open" : ""}`}
        hidden={!mobileOpen}
      >
        <nav className="site-nav site-nav--mobile" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <PreferenceControls />
        <SocialLinks />
      </div>
    </header>
  );
}
