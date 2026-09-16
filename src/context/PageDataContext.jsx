/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

export const PageDataContext = createContext(null);

// Only seed the initial URL. Client navigation must never reuse another guide's data.
export function usePageData() {
  const page = useContext(PageDataContext);
  const { pathname } = useLocation();
  return page?.path === pathname ? page.data : null;
}
