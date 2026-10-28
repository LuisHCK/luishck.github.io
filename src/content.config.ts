import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            description: z.string(),
            order: z.number(),
            stack: z.array(z.string()).default([]),
            cover: image(),
            links: z
                .array(
                    z.object({
                        label: z.string(),
                        url: z.string(),
                        target: z.string().optional(),
                        rel: z.string().optional(),
                    })
                )
                .default([]),
        }),
})

export const collections = { projects }
