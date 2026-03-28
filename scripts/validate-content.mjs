import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const blogDir = path.join(root, "src", "content", "blog");
const publicDir = path.join(root, "public");
const authorDir = path.join(root, "src", "content", "authors");

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

const errors = [];
const warnings = [];
const entries = await fs.readdir(blogDir);
const files = entries.filter((name) => name.endsWith(".mdx"));
const authorEntries = await fs.readdir(authorDir);
const authorIds = new Set(authorEntries.filter((name) => name.endsWith(".json")).map((name) => name.replace(/\.json$/, "")));

for (const file of files) {
  const fullPath = path.join(blogDir, file);
  const source = await fs.readFile(fullPath, "utf8");
  const frontmatter = parseFrontmatter(source);

  if (!frontmatter) {
    errors.push(`${file}: missing frontmatter block`);
    continue;
  }

  const title = stripQuotes(frontmatter.title || "");
  const description = stripQuotes(frontmatter.description || "");
  const pubDate = stripQuotes(frontmatter.pubDate || "");
  const author = stripQuotes(frontmatter.author || "");
  const draft = stripQuotes(frontmatter.draft || "false");
  const coverImage = stripQuotes(frontmatter.coverImage || "");
  const coverAlt = stripQuotes(frontmatter.coverAlt || "");
  const series = stripQuotes(frontmatter.series || "");
  const seriesOrder = stripQuotes(frontmatter.seriesOrder || "");
  const tags = parseTags(frontmatter.tags || "");
  const body = source.replace(/^---\n[\s\S]*?\n---/, "").trim();
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const isMultilingual = body.includes("<LanguageTabs");
  const isFiction = tags.includes("fiction") || tags.includes("thriller") || tags.includes("story");

  if (!title) errors.push(`${file}: missing title`);
  if (!description) errors.push(`${file}: missing description`);
  if (description && description.length < 20) {
    errors.push(`${file}: description is too short`);
  }
  if (description && description.length > 180) {
    warnings.push(`${file}: description is quite long`);
  }
  if (!pubDate || Number.isNaN(Date.parse(pubDate))) {
    errors.push(`${file}: invalid pubDate`);
  }
  if (!author) errors.push(`${file}: missing author`);
  if (author && !authorIds.has(author)) {
    errors.push(`${file}: author '${author}' does not exist`);
  }
  if (tags.length === 0) errors.push(`${file}: at least one tag is required`);
  if (tags.some((tag) => tag !== tag.toLowerCase())) {
    errors.push(`${file}: tags must be lowercase`);
  }
  if (tags.length > 5) {
    warnings.push(`${file}: has more than 5 tags`);
  }
  if (!["true", "false"].includes(draft)) {
    errors.push(`${file}: draft must be true or false`);
  }
  if (wordCount < 80) {
    warnings.push(`${file}: article is very short (${wordCount} words)`);
  }
  if (body && !body.includes("## ") && !isMultilingual && !isFiction) {
    warnings.push(`${file}: consider adding section headings`);
  }
  if (series && !seriesOrder) {
    errors.push(`${file}: seriesOrder is required when series is set`);
  }
  if (!series && seriesOrder) {
    errors.push(`${file}: seriesOrder exists without series`);
  }

  if (coverImage && coverImage.startsWith("/")) {
    const imagePath = path.join(publicDir, coverImage.slice(1));
    try {
      await fs.access(imagePath);
    } catch {
      errors.push(`${file}: coverImage does not exist at ${coverImage}`);
    }
  }

  if (coverImage && !coverAlt) {
    warnings.push(`${file}: coverImage is set without coverAlt`);
  }
}

if (errors.length > 0) {
  console.error("Content validation failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn("Content validation warnings:\n");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
  console.warn("");
}

console.log(`Content validation passed for ${files.length} post(s).`);
