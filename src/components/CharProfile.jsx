import "./CharProfile.css";
import PropTypes from "prop-types";

const CharProfile = ({ pic, name }) => {
  return (
    <div className="char-profile combo-section">
      <h1 id="char-name">{name}</h1>

      <img id="char-pic" src={pic} alt={name} />
    </div>
  );
};

CharProfile.propTypes = {
  pic: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CharProfile;
