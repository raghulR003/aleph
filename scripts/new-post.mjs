import fs from "node:fs/promises";
import path from "node:path";

const rawTitle = process.argv.slice(2).join(" ").trim();

if (!rawTitle) {
  console.error('Usage: npm run new-post -- "My New Post"');
  process.exit(1);
}

const slug = rawTitle
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-");

const today = new Date().toISOString().slice(0, 10);
const postDir = path.join(process.cwd(), "src", "content", "blog");
const imageDir = path.join(process.cwd(), "public", "images", "posts", slug);
const filePath = path.join(postDir, `${slug}.mdx`);

const template = `---
title: "${rawTitle}"
description: "Short summary of the article."
pubDate: ${today}
author: "default"
tags: ["notes"]
draft: true
---

## Introduction

Start writing here.
`;

try {
  await fs.access(filePath);
  console.error(`Post already exists: ${filePath}`);
  process.exit(1);
} catch {
  // file does not exist
}

await fs.mkdir(postDir, { recursive: true });
await fs.mkdir(imageDir, { recursive: true });
await fs.writeFile(filePath, template, "utf8");

console.log(`Created post: src/content/blog/${slug}.mdx`);
console.log(`Created image folder: public/images/posts/${slug}/`);
