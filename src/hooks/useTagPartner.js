import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { findTagPartner, tagPartnerSearch } from '../utils/tagPairing';

export default function useTagPartner({ primary, roster, enabled = true }) {
  const [search, setSearch] = useSearchParams();
  const partner = enabled ? findTagPartner(primary, roster, search) : null;

  useEffect(() => {
    if (enabled && primary && roster && search.has('partner') && !partner) {
      setSearch(tagPartnerSearch(search, ''), { replace: true });
    }
  }, [enabled, primary, roster, search, partner, setSearch]);

  function setPartnerSlug(slug) {
    if (!enabled || !primary) return;
    const valid = slug !== primary.slug && roster?.some(fighter => fighter.slug === slug);
    setSearch(tagPartnerSearch(search, valid ? slug : ''));
  }

  return { partner, setPartnerSlug };
}
