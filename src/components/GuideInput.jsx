import PropTypes from 'prop-types';
import renderInputImage from '../utils/renderInputImage';
import { parseInputNotation } from '../utils/inputNotation';

// Preserve source notation when an archive uses an unsupported command token.
// Partial icon conversion can change how a complex route is read.
export default function GuideInput({ input = '' }) {
  return parseInputNotation(input).some(token => token.kind === 'text')
    ? <span className="guide-source-input">{input}</span>
    : renderInputImage(input);
}
GuideInput.propTypes = { input: PropTypes.string };
