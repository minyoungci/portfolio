import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? ''
const BUCKET     = process.env.R2_BUCKET_NAME ?? ''
const PUBLIC_URL = process.env.R2_PUBLIC_URL  ?? ''  // https://pub-xxx.r2.dev

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID     ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
})

export async function uploadToR2(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const missing = [
    !ACCOUNT_ID && 'R2_ACCOUNT_ID',
    !BUCKET     && 'R2_BUCKET_NAME',
    !PUBLIC_URL && 'R2_PUBLIC_URL',
    !process.env.R2_ACCESS_KEY_ID     && 'R2_ACCESS_KEY_ID',
    !process.env.R2_SECRET_ACCESS_KEY && 'R2_SECRET_ACCESS_KEY',
  ].filter(Boolean)
  if (missing.length > 0) {
    return { ok: false, error: `Missing env vars: ${missing.join(', ')}` }
  }
  try {
    await client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    }))
    return { ok: true, url: `${PUBLIC_URL}/${filename}` }
  } catch (err) {
    console.error('R2 upload error:', err)
    return { ok: false, error: String(err) }
  }
}
