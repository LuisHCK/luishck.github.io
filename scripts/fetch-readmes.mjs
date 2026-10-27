import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const projectsPath = path.join(root, 'src', 'data', 'projects.json')
const outputDir = path.join(root, 'src', 'data', 'readmes')

const projects = JSON.parse(await readFile(projectsPath, 'utf8'))

await mkdir(outputDir, { recursive: true })

for (const project of projects) {
    if (!project.slug || !project.content) continue

    const response = await fetch(project.content)

    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${project.slug}: ${response.status} ${response.statusText}`
        )
    }

    const markdown = await response.text()
    const outputPath = path.join(outputDir, `${project.slug}.md`)

    await writeFile(outputPath, markdown)
    console.log(`✓ ${project.slug}`)
}
