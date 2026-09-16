import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
const useScrollEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const scrollImmediately = (position) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(position);
  root.style.scrollBehavior = previousBehavior;
};

export default function ScrollToTop() {
  const { hash, key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());

  useScrollEffect(() => {
    const rememberPosition = () => {
      positions.current.set(key, { left: window.scrollX, top: window.scrollY });
    };

    window.addEventListener("scroll", rememberPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", rememberPosition);
    };
  }, [key]);

  useScrollEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return;
    }

    const savedPosition = navigationType === "POP" && positions.current.get(key);
    scrollImmediately(savedPosition || { left: 0, top: 0 });
  }, [hash, key, navigationType, pathname]);

  return null;
}
