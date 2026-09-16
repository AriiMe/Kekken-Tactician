import { useState } from "react";
import { Link } from "react-router-dom";
import "./PrivacyNotice.css";

const STORAGE_KEY = "privacyNoticeAccepted";

const hasDismissedNotice = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export default function PrivacyNotice() {
  const [isVisible, setIsVisible] = useState(() => !hasDismissedNotice());

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // The notice can still be dismissed for this page view when storage is blocked.
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="privacy-notice" aria-labelledby="privacy-notice-title">
      <div>
        <p id="privacy-notice-title">Privacy notice</p>
        <span>
          We use privacy-focused analytics to understand site performance and remember your display preferences on this device.
        </span>
      </div>
      <div className="privacy-notice__actions">
        <Link to="/privacy-policy">Read policy</Link>
        <button type="button" onClick={dismiss}>
          Dismiss
        </button>
      </div>
    </aside>
  );
}
