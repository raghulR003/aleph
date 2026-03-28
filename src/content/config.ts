import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    author: z.string().default("default"),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string(),
    social: z
      .object({
        twitter: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { blog, authors };
