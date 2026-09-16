export const SITE_URL = 'https://www.tekktician.com';
export const absoluteUrl = path => new URL(path, SITE_URL).href;
export const characterPath = character => `/character/combos/${character.name.toLowerCase().replace(/\s+/g, '-')}-combos/${character.id || character._id}`;
export const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');

export function structuredData(page) {
  const url = absoluteUrl(page.path);
  const website = { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'TEKKTICIAN', alternateName: 'Tekken Tactician', inLanguage: 'en' };
  const webpage = { '@type': page.collection ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description, isPartOf: { '@id': website['@id'] }, inLanguage: 'en' };
  if (page.game) webpage.about = { '@type': 'VideoGame', name: page.game };
  const graph = [website, webpage];
  if (page.breadcrumbs?.length) {
    webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: page.breadcrumbs.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })) });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
