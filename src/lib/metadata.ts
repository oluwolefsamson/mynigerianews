export const siteUrl = 'https://mynigeria.news'

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}
