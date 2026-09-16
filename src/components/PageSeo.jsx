import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import catalog from '../data/seoCatalog.json';
import { absoluteUrl, safeJson, structuredData } from '../utils/seo';

export default function PageSeo() {
  const { pathname } = useLocation();
  const page = catalog.find(item => item.path === pathname) || {
    path: pathname, title: 'Page not found | TEKKTICIAN',
    description: 'Find Tekken combos, character guides and practice tools in the TEKKTICIAN game library.', noindex: true,
  };
  const image = absoluteUrl(page.image || '/game-art/tekken-8.jpg');
  return <Helmet>
    <title>{page.title}</title>
    <meta name="description" content={page.description} />
    <meta name="robots" content={page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
    <link rel="canonical" href={absoluteUrl(page.path)} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="TEKKTICIAN" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content={page.title} />
    <meta property="og:description" content={page.description} />
    <meta property="og:url" content={absoluteUrl(page.path)} />
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={`${page.game || 'Tekken 8'} artwork — TEKKTICIAN`} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={page.title} />
    <meta name="twitter:description" content={page.description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content={`${page.game || 'Tekken 8'} artwork — TEKKTICIAN`} />
    {!page.noindex && <script type="application/ld+json">{safeJson(structuredData(page))}</script>}
  </Helmet>;
}
