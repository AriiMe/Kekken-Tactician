// A route belongs to both fighters, regardless of who starts it.
export function getTag2TeamRoutes(characters, slug) {
  return characters.flatMap(lead => (lead.teamCombos || [])
    .filter(combo => lead.slug === slug || combo.partner === slug)
    .map((combo, index) => ({
      ...combo,
      id: combo.id || `${lead.slug}-${index}`,
      lead: lead.slug,
      teammate: lead.slug === slug ? combo.partner : lead.slug,
    }))).sort((a,b) => Number(b.lead === slug) - Number(a.lead === slug));
}
