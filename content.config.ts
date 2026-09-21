import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        category: z.string().optional(),
        readingTime: z.number().optional(),
        featured: z.boolean().default(false),
        published: z.boolean().default(true)
      })
    })
  }
})