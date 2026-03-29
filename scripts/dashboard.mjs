import fs from "node:fs/promises";
import path from "node:path";

const blogDir = path.join(process.cwd(), "src", "content", "blog");

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const lines = block.split(/\r?\n/);
  const data = {};

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  }

  return data;
}

function stripQuotes(value = "") {
  return value.replace(/^['\"]|['\"]$/g, "");
}

function parseTags(raw = "") {
  const match = raw.match(/^\[(.*)\]$/);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
}

const entries = await fs.readdir(blogDir);
const files = entries.filter((name) => name.endsWith(".mdx"));
const posts = [];

for (const file of files) {
  const source = await fs.readFile(path.join(blogDir, file), "utf8");
  const frontmatter = parseFrontmatter(source);
  if (!frontmatter) continue;

  posts.push({
    file,
    title: stripQuotes(frontmatter.title || file),
    draft: stripQuotes(frontmatter.draft || "false") === "true",
    series: stripQuotes(frontmatter.series || ""),
    seriesOrder: stripQuotes(frontmatter.seriesOrder || ""),
    tags: parseTags(frontmatter.tags || ""),
    coverImage: stripQuotes(frontmatter.coverImage || ""),
  });
}

const drafts = posts.filter((post) => post.draft);
const published = posts.filter((post) => !post.draft);
const withoutCover = posts.filter((post) => !post.coverImage);
const seriesMap = new Map();

for (const post of posts) {
  if (!post.series) continue;
  if (!seriesMap.has(post.series)) seriesMap.set(post.series, []);
  seriesMap.get(post.series).push(post);
}

console.log("netztalt. content dashboard\n");
console.log(`Total posts:     ${posts.length}`);
console.log(`Published:       ${published.length}`);
console.log(`Drafts:          ${drafts.length}`);
console.log(`Without cover:   ${withoutCover.length}`);
console.log(`Series count:    ${seriesMap.size}`);

console.log("\nDraft posts:");
if (drafts.length === 0) {
  console.log("- none");
} else {
  for (const post of drafts) {
    console.log(`- ${post.title} (${post.file})`);
  }
}

console.log("\nSeries overview:");
if (seriesMap.size === 0) {
  console.log("- none");
} else {
  for (const [seriesName, seriesPosts] of seriesMap.entries()) {
    const ordered = [...seriesPosts].sort((a, b) => Number(a.seriesOrder || 0) - Number(b.seriesOrder || 0));
    console.log(`- ${seriesName} (${ordered.length} posts)`);
    for (const post of ordered) {
      console.log(`  • #${post.seriesOrder || "?"} ${post.title}`);
    }
  }
}

console.log("\nPosts missing cover images:");
if (withoutCover.length === 0) {
  console.log("- none");
} else {
  for (const post of withoutCover) {
    console.log(`- ${post.title}`);
  }
}
