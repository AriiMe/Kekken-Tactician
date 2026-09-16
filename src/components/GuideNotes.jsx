import { useState } from "react";
import PropTypes from "prop-types";
import CollapsableSection from "./CollapsableSection";
import renderInputImage from "../utils/renderInputImage";

export default function GuideNotes({ guide }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="combo-section">
      <CollapsableSection
        title="Guide Notes"
        toggleState={isCollapsed}
        collapseFn={() => setIsCollapsed((value) => !value)}
      >
        <div style={{ padding: "0 16px 16px", lineHeight: 1.7 }}>
          <p>{guide.notes}</p>
          {guide.stances?.length > 0 && (
            <dl>
              {guide.stances.map((stance, index) => (
                <div key={`${stance.name}-${index}`} style={{ marginBottom: 8 }}>
                  <dt style={{ display: "inline", fontWeight: 700 }}>{stance.name}: </dt>
                  <dd style={{ display: "inline", margin: 0 }}>{renderInputImage(stance.input)}</dd>
                </div>
              ))}
            </dl>
          )}
          <p style={{ fontSize: ".85rem", color: "#bbb", marginBottom: 0 }}>
            Source version: {guide.versionLabel}. Adapted for TEKKTICIAN from{" "}
            <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer">
              {guide.sourceTitle}
            </a>.
          </p>
        </div>
      </CollapsableSection>
    </div>
  );
}

GuideNotes.propTypes = {
  guide: PropTypes.shape({
    notes: PropTypes.string.isRequired,
    versionLabel: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    sourceTitle: PropTypes.string.isRequired,
    stances: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
    })),
  }).isRequired,
};
