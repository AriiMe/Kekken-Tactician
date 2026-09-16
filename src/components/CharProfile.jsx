import "./CharProfile.css";
import PropTypes from "prop-types";
import CharacterPortrait from './CharacterPortrait';
import { getTekken8Portrait } from '../data/tekken8Portraits';

const CharProfile = ({ pic, name }) => {
  const portrait = getTekken8Portrait(pic);
  return (
    <div className="char-profile combo-section">
      <h1 id="char-name">{name}</h1>

      {portrait ? <CharacterPortrait portrait={portrait} name={name} profile /> : <img id="char-pic" src={pic} alt={name} />}
    </div>
  );
};

CharProfile.propTypes = {
  pic: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CharProfile;
