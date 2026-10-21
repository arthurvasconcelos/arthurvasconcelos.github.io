import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "**/blog/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        draft: z.boolean().optional().default(false),
        translationKey: z.string().optional(),
      }),
    }),
    labs: defineCollection({
      type: "page",
      source: "**/labs/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        draft: z.boolean().optional().default(false),
        translationKey: z.string().optional(),
        tags: z.array(z.string()).optional().default([]),
      }),
    }),
  },
});
