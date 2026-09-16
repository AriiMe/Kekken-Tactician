import PropTypes from 'prop-types';
import './CharacterPortrait.css';

export default function CharacterPortrait({ portrait, name, profile = false }) {
  return (
    <div className={`character-portrait${profile ? ' character-portrait--profile' : ''}`}
      style={{ '--portrait-focus': `${portrait.focus}%`, '--portrait-scale': portrait.scale, '--portrait-top': `${portrait.top}%` }}>
      <img src={portrait.src} alt={name} loading={profile ? 'eager' : 'lazy'} />
    </div>
  );
}
CharacterPortrait.propTypes = {
  portrait: PropTypes.shape({ src: PropTypes.string.isRequired, focus: PropTypes.number.isRequired, scale: PropTypes.number.isRequired, top: PropTypes.number.isRequired }).isRequired,
  name: PropTypes.string.isRequired,
  profile: PropTypes.bool,
};
