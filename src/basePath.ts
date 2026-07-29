/** Resolve repository-root assets correctly in both local development and GitHub Pages. */
export function withBasePath(url: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) return url;

  return `${import.meta.env.BASE_URL}${url.slice(1)}`;
}
