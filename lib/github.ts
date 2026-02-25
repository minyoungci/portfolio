const OWNER = process.env.GITHUB_OWNER || 'minyoungci'
const REPO  = process.env.GITHUB_REPO  || 'portfolio'
const TOKEN = process.env.GITHUB_TOKEN

const BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`

const headers = () => ({
  'Authorization': `Bearer ${TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
})

/** 현재 파일의 SHA 가져오기 (업데이트 시 필요) */
async function getSha(filePath: string): Promise<string | null> {
  const res = await fetch(`${BASE}/${filePath}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.sha ?? null
}

/** 파일 생성/업데이트 */
export async function putFile(
  filePath: string,
  content: string | Buffer,
  message: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!TOKEN) return { ok: false, error: 'GITHUB_TOKEN not set' }

  const sha = await getSha(filePath)

  const b64 = Buffer.isBuffer(content)
    ? content.toString('base64')
    : Buffer.from(content, 'utf-8').toString('base64')

  const body: Record<string, string> = { message, content: b64 }
  if (sha) body.sha = sha

  const res = await fetch(`${BASE}/${filePath}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error('GitHub API error:', err)
    return { ok: false, error: JSON.stringify(err) }
  }

  return { ok: true }
}
