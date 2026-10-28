import { execSync } from 'node:child_process'

export default function globalTeardown() {
    if (process.env.BASE_URL) return

    try {
        execSync('docker compose down --remove-orphans', { stdio: 'ignore' })
    } catch {
        // The server may already be gone; nothing to clean up.
    }
}
