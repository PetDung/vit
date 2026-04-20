const CLOUD_NAME = "ddnasugap"
const API_KEY = "947331273387367"
const UPLOAD_PRESET = "" // leave empty, we use signed upload
const API_SECRET = "Abduc20DY-6auh2BuEtHq7YDJi8"
const FOLDER = "marshell"

/**
 * Generate SHA-1 signature for Cloudinary signed upload.
 * Runs in the browser using SubtleCrypto.
 */
async function generateSignature(params: Record<string, string>): Promise<string> {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&")
  const msgBuffer = new TextEncoder().encode(sorted + API_SECRET)
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export interface UploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload a File to Cloudinary (signed upload).
 * Returns the Cloudinary URL.
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const timestamp = String(Math.floor(Date.now() / 1000))
  const params: Record<string, string> = {
    folder: FOLDER,
    timestamp,
  }

  const signature = await generateSignature(params)

  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", API_KEY)
  formData.append("timestamp", timestamp)
  formData.append("signature", signature)
  formData.append("folder", FOLDER)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || `Upload failed: ${res.status}`)
  }

  return res.json()
}
