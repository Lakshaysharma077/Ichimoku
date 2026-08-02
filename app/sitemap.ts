import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ichimokuedge.com';

  const routes = [
    '',
    '/ichimoku',
    '/tools',
    '/pricing',
    '/faq',
    '/education',
    '/ideas',
    '/glossary',
    '/support',
    '/checkout',
    '/terms',
    '/privacy',
    '/disclaimer',
    '/refund',
    '/cookies',
  ];

  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/pricing' || route === '/tools' ? 0.9 : 0.7,
  }));
}
