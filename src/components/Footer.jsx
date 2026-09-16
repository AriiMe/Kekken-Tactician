import { FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { siteLinks } from "../data/siteLinks";
import "./Footer.css";

const footerLinks = [
  { label: "Game library", to: "/" },
  { label: "Tekken 8", to: "/games/tekken-8" },
  { label: "Request an update", to: "/update-request" },
  { label: "About", to: "/about" },
  { label: "Credits", to: "/credits" },
  { label: "FAQ", to: "/faqu" },
  { label: "Privacy", to: "/privacy-policy" },
];

const communityLinks = [
  { label: "Twitch", href: siteLinks.twitch, icon: FaTwitch },
  {
    label: "YouTube",
    href: siteLinks.youtube,
    icon: FaYoutube,
  },
  { label: "Discord", href: siteLinks.discord, icon: FaDiscord },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" aria-label="Tekktician home">
            <img src="/main-icon.png" alt="" />
            <span>
              TEKK<span>TICIAN</span>
            </span>
          </Link>
          <p>Formerly known as Tekken Tactician.</p>
          <p>Practical fighting-game knowledge, built with the community.</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__community">
          <p>Join the lab</p>
          <div>
            {communityLinks.map(({ label, href, icon: Icon }) => (
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
        </div>
      </div>

      <div className="site-footer__legal">
        <p>© {new Date().getFullYear()} TEKKTICIAN</p>
        <p>
          Unofficial community resource. Not affiliated with or endorsed by the game
          publishers. All game names, artwork and trademarks belong to their respective
          owners.
        </p>
      </div>
    </footer>
  );
}
