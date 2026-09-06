/** 절대 URL의 기준. 커스텀 도메인 연결 후 NEXT_PUBLIC_SITE_URL로 고정한다. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

/** next/image로 최적화해도 되는 소스인지 (로컬 경로 또는 next.config.ts의 remotePatterns 호스트). */
export const isOptimizableImage = (src: string) =>
  /^(\/(?!\/)|https:\/\/(images\.unsplash\.com|picsum\.photos|[a-z0-9-]+\.r2\.dev)\/)/.test(src)

export const isVideoSrc = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)
