export function findTagPartner(primary, roster, search) {
  const slug = new URLSearchParams(search).get('partner');
  return primary && slug !== primary.slug ? roster?.find(fighter => fighter.slug === slug) || null : null;
}

export function tagPartnerSearch(search, slug) {
  const next = new URLSearchParams(search);
  next.delete('partner');
  if (slug) next.set('partner', slug);
  return next;
}

// Costume aliases keep their own identity while using the documented moveset.
// Mimics have no fixed moveset and must be assigned their current copied style.
export function resolveSharedTagGuide(fighter, roster) {
  let guide = fighter;
  const visited = new Set();
  while (guide?.sharedGuide && !visited.has(guide.slug)) {
    visited.add(guide.slug);
    const shared = roster.find(item => item.slug === guide.sharedGuide);
    if (!shared || visited.has(shared.slug)) break;
    guide = shared;
  }
  return guide;
}
