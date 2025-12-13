export default function resolvePublicPath(p) {
  if (!p) return '';
  // Already absolute URL
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  // If already prefixed with PUBLIC_URL, return as-is
  const pub = process.env.PUBLIC_URL || '';
  if (pub && p.startsWith(pub)) return p;
  // If it's an absolute path starting with '/', prepend PUBLIC_URL
  if (p.startsWith('/')) return `${pub}${p}`;
  // Otherwise return as provided
  return p;
}
