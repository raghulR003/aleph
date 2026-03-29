# netzstalt.

Private owner handbook for running and maintaining the blog.

---

## 1. Local development

### PowerShell

Use `npm.cmd` instead of `npm` if PowerShell blocks script execution.

```powershell
npm.cmd install
npm.cmd run dev
```

Useful commands:

```powershell
npm.cmd run new-post -- "My New Article"
npm.cmd run validate:content
npm.cmd run dashboard
```

Open:

```text
http://localhost:4321
```

### Production preview

```powershell
npm.cmd run build
npm.cmd run preview
```

Notes:
- search does **not** fully work in dev mode
- search **does** work after `build`, because Pagefind indexes the generated HTML in `dist/`

---

## 2. Core publishing workflow

Your normal workflow as sole owner:

1. start dev server
2. create a new `.mdx` post file
3. add frontmatter
4. write the article in Markdown / MDX
5. add images under `public/images/posts/...`
6. preview locally
7. run a production build
8. deploy

Minimal loop:

```powershell
npm.cmd run dev
```

Then before publishing:

```powershell
npm.cmd run build
```

---

## 3. Where posts live

All posts go in:

```text
src/content/blog/
```

Example:

```text
src/content/blog/my-first-post.mdx
src/content/blog/how-i-think-about-architecture.mdx
src/content/blog/notes-on-queues-and-retries.mdx
```

Use kebab-case filenames.

---

## 4. Post template

Copy this whenever you start a new article:

```mdx
---
title: "Post Title"
description: "Short summary of the article."
pubDate: 2026-03-28
author: "default"
tags: ["notes"]
draft: true
---

## Introduction

Start writing here.
```

When ready to publish, change:

```yaml
draft: false
```

### Faster option: generate a post automatically

```powershell
npm.cmd run new-post -- "My New Article"
```

This creates:

```text
src/content/blog/my-new-article.mdx
public/images/posts/my-new-article/
```

---

## 5. Frontmatter reference

### Required fields

```yaml
title: "Post title"
description: "Short summary"
pubDate: 2026-03-28
author: "default"
tags: ["tag-one", "tag-two"]
draft: false
```

### Optional fields

```yaml
updatedDate: 2026-03-29
coverImage: "/images/posts/post-slug/cover.jpg"
coverAlt: "Describe the image"
series: "Series Name"
seriesOrder: 1
ogImage: "/images/custom-og.jpg"
```

### What each field does

- `title`: page title + post heading
- `description`: summary used on cards and metadata
- `pubDate`: publish date
- `updatedDate`: optional modified date
- `author`: usually `default`
- `tags`: used for tag pages and related posts
- `draft`: hides the post when `true`
- `coverImage`: optional hero image
- `coverAlt`: accessibility text for the cover image
- `series`: groups posts together
- `seriesOrder`: controls order inside a series
- `ogImage`: optional override for default social image

---

## 6. Markdown and MDX support

Yes — the blog renders Markdown cleanly.

It supports:
- headings
- paragraphs
- bold / italic
- links
- lists
- blockquotes
- tables
- inline code
- fenced code blocks
- images
- horizontal rules

Code blocks are already styled.

### Why posts use `.mdx`

Even if you only write plain Markdown, keep using `.mdx`.

Why:
- normal Markdown still works
- later you can embed custom components if you want

So your default format should remain:

```text
.mdx
```

### Built-in MDX components you can use

You now have a few reusable components available inside posts.

#### Callout

```mdx
<Callout type="note" title="Why this matters">
  This is a highlighted note inside the article.
</Callout>
```

Valid types:
- `note`
- `tip`
- `warning`
- `success`

#### Figure

```mdx
<Figure
  src="/images/posts/my-post/diagram.png"
  alt="System architecture diagram"
  caption="A simple request flow through the system."
/>
```

#### Comparison

```mdx
<Comparison leftTitle="Good" rightTitle="Bad">
  <div slot="left">

  - Small interfaces
  - Clear names
  - Predictable behavior

  </div>

  <div slot="right">

  - Huge abstractions
  - Vague naming
  - Hidden side effects

  </div>
</Comparison>
```

These only work in `.mdx` files, which is another reason to keep using MDX instead of plain `.md`.

#### FAQ

```mdx
<FAQ question="Why use Astro for a blog?" open>
  Because it gives you static output, excellent performance, and a very good content workflow.
</FAQ>
```

#### Details

```mdx
<Details summary="Show the implementation notes">
  Put extra detail here without making the article feel too dense.
</Details>
```

#### FileTree

```mdx
<FileTree title="Project layout">
{`src/
  components/
  content/
  pages/`}
</FileTree>
```

#### Terminal

```mdx
<Terminal title="PowerShell">
{`npm.cmd run dev
npm.cmd run build`}
</Terminal>
```

#### Timeline

```mdx
<Timeline title="How the system evolved">
  <TimelineItem label="Step 1">
    Start with the simplest version.
  </TimelineItem>
  <TimelineItem label="Step 2">
    Add guardrails and author tooling.
  </TimelineItem>
</Timeline>
```

#### LanguageTabs

Use this when one post should contain multiple language versions on the same page.

```mdx
<LanguageTabs defaultLanguage="ta">
  <div slot="ta">
    <p>தமிழ் உரை இங்கே.</p>
  </div>

  <div slot="en">
    <p>English text goes here.</p>
  </div>

  <div slot="de">
    <p>Der deutsche Text steht hier.</p>
  </div>
</LanguageTabs>
```

Use this for:
- fiction published in multiple languages
- essays you want to keep as one canonical page
- translation pairs where all versions belong together

If the post is one work in three languages, keep it in **one** `.mdx` file.

---

## 7. Images

### Where to store them

Put images in `public/images/`.

Recommended structure:

```text
public/images/posts/my-first-post/
```

Example:

```text
public/images/posts/my-first-post/cover.jpg
public/images/posts/my-first-post/diagram.png
public/images/posts/my-first-post/output.webp
```

### How to use images in content

In frontmatter:

```yaml
coverImage: "/images/posts/my-first-post/cover.jpg"
coverAlt: "A descriptive cover image"
```

Inside Markdown:

```md
![System diagram](/images/posts/my-first-post/diagram.png)
```

### Image guidelines

- use descriptive file names
- prefer `.webp` or compressed `.jpg` for large images
- use `.png` only when you need crisp diagrams or transparency
- always write useful alt text
- keep one folder per post

---

## 8. Tags

Tags drive:
- tag archive pages
- related posts
- content grouping

Use simple lowercase tags:

```yaml
tags: ["astro", "typescript", "performance"]
```

Recommended rules:
- keep tags lowercase
- keep them short
- avoid duplicates like `ts` and `typescript`
- don’t over-tag posts

Good:

```yaml
tags: ["architecture", "distributed-systems", "reliability"]
```

Bad:

```yaml
tags: ["Architecture", "arch", "system design", "systems", "backend", "distributed systems"]
```

---

## 9. Series

If several posts belong together, use:

```yaml
series: "Thinking in Systems"
seriesOrder: 1
```

Example next post:

```yaml
series: "Thinking in Systems"
seriesOrder: 2
```

Only use series when you really want ordered reading.

---

## 10. Drafts

Draft mode is your friend.

While writing:

```yaml
draft: true
```

When ready:

```yaml
draft: false
```

Draft posts won’t appear in the published site.

---

## 11. Authors

Current default author file:

```text
src/content/authors/default.json
```

Edit that file to change:
- name
- bio
- avatar

### Add another author later

Create a new file like:

```text
src/content/authors/jane.json
```

Then reference it in a post:

```yaml
author: "jane"
```

---

## 12. Search behavior

Search is powered by Pagefind.

Important:
- dev mode does not build the search index
- production build does

So if search looks empty during `dev`, that is normal.

To test real search:

```powershell
npm.cmd run build
npm.cmd run preview
```

---

## 13. Deploying

This is a static site.

Build output is in:

```text
dist/
```

Deploy that to:
- Netlify
- Render
- any static host

### Before deploying

Update:

```text
astro.config.mjs
```

Specifically:

```js
site: "https://your-real-domain.com"
```

---

## 14. Recommended writing standards for yourself

Keep the system simple.

### Naming
- use kebab-case filenames
- use one image folder per post

### Frontmatter discipline
- always include `title`
- always include `description`
- always include `pubDate`
- always include `tags`
- use `draft: true` until done

### Content discipline
- start with a strong intro
- use `##` and `###` headings clearly
- keep sections focused
- prefer fewer, stronger images
- avoid giant tag lists

---

## 15. Good example post

```mdx
---
title: "How I Think About Reliable Background Jobs"
description: "A practical way to reason about retries, queues, idempotency, and failure handling."
pubDate: 2026-03-28
author: "default"
tags: ["architecture", "queues", "reliability"]
coverImage: "/images/posts/reliable-background-jobs/cover.jpg"
coverAlt: "Queue and worker diagram"
draft: false
---

## The core problem

Background jobs look easy until they fail halfway through.

## The first rule: make retries safe

If a job can run twice, then retries stop being scary.

```ts
export async function processJob(jobId: string) {
  // Example only
}
```

## Final thought

Reliability is mostly about reducing the number of surprising states.
```

---

## 16. Maintenance checklist

Before publishing:
- title is clear
- description is strong
- tags are clean
- draft is false
- images load correctly
- code blocks render correctly
- local build passes

Commands:

```powershell
npm.cmd run validate:content
npm.cmd run build
npm.cmd run preview
```

### What validation checks

The validation script currently checks:
- frontmatter exists
- title exists
- description exists
- description is not too short
- `pubDate` is valid
- author exists
- at least one tag exists
- all tags are lowercase
- `draft` is either `true` or `false`
- local `coverImage` paths actually exist

It also warns when:
- description is quite long
- article is very short
- headings are missing
- too many tags are used
- `coverImage` exists without `coverAlt`

And it enforces:
- `seriesOrder` must exist if `series` exists
- `seriesOrder` cannot exist without `series`

---

## 17. Current project notes

- site name is `netzstalt.`
- discussion is intentionally lightweight
- no newsletter system
- no external comment system
- Google Fonts are used directly
- search works in production build
- content validation runs before build
- post scaffolding is available via `new-post`
- reusable MDX components are available in posts
- multilingual single-page posts are supported with `LanguageTabs`
- a private CLI dashboard is available via `dashboard`

---

## 18. Files you’ll touch most often

### Content

```text
src/content/blog/
src/content/authors/default.json
public/images/posts/
```

### Site configuration

```text
astro.config.mjs
src/components/Header.astro
src/components/Footer.astro
src/layouts/BlogPost.astro
```

---

## 19. If you want to evolve the blog later

Good future upgrades:
- automatic image optimization workflow
- better series landing pages
- reading list / bookmarks page
- notes / shortform posts section
- topic map / tag strategy report
- cover image helper or generator

---

## 20. Private dashboard

You now have a small private reporting command:

```powershell
npm.cmd run dashboard
```

It shows:
- total post count
- published vs draft count
- series overview
- posts missing cover images
- drafts still in progress

---

## 21. One-sentence operating model

You are not using a CMS.

You publish by creating `.mdx` files, adding images under `public/`, previewing locally, and deploying the generated static site.
