import PropTypes from 'prop-types';
import renderInputImage from '../utils/renderInputImage';
import { parseInputNotation } from '../utils/inputNotation';
import { needsArchiveText, normalizeArchiveHolds } from '../utils/archiveInput';

// Preserve source notation when an archive uses an unsupported command token.
// Partial icon conversion can change how a complex route is read.
export default function GuideInput({ input = '' }) {
  const normalized = normalizeArchiveHolds(input);
  return needsArchiveText(normalized) || parseInputNotation(normalized).some(token => token.kind === 'text')
    ? <span className="guide-source-input">{input}</span>
    : renderInputImage(normalized);
}
GuideInput.propTypes = { input: PropTypes.string };
