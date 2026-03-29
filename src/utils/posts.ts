import type { CollectionEntry } from "astro:content";

/** Calculate reading time from raw markdown/mdx body */
export function getReadingTime(content: string): string {
  const wordsPerMinute = 238;
  const text = content.replace(/<[^>]*>/g, "").replace(/```[\s\S]*?```/g, "");
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/** Format a date to human-readable string */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Sort posts by date descending, filter out drafts */
export function getSortedPosts(
  posts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[] {
  return posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    );
}

/** Get standalone posts (not part of any series) */
export function getStandalonePosts(
  posts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[] {
  return posts
    .filter((post) => !post.data.draft && !post.data.series)
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    );
}

/** Get standalone posts by category */
export function getStandalonePostsByCategory(
  category: string,
  posts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[] {
  return posts
    .filter((post) => 
      !post.data.draft && 
      !post.data.series && 
      (post.data.category || "technical") === category
    )
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    );
}

/** Get all unique tags from posts */
export function getAllTags(
  posts: CollectionEntry<"blog">[]
): Map<string, number> {
  const tagMap = new Map<string, number>();
  posts
    .filter((post) => !post.data.draft)
    .forEach((post) => {
      post.data.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
  return new Map([...tagMap.entries()].sort((a, b) => b[1] - a[1]));
}

/** Get related posts by tag overlap, scored */
export function getRelatedPosts(
  currentPost: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
  limit = 3
): CollectionEntry<"blog">[] {
  const currentTags = new Set(currentPost.data.tags);
  return allPosts
    .filter((post) => post.slug !== currentPost.slug && !post.data.draft)
    .map((post) => ({
      post,
      score: post.data.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

/** Get posts in a series, sorted by seriesOrder */
export function getSeriesPosts(
  seriesName: string,
  allPosts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[] {
  return allPosts
    .filter((post) => post.data.series === seriesName && !post.data.draft)
    .sort((a, b) => (a.data.seriesOrder || 0) - (b.data.seriesOrder || 0));
}

/** Get all unique series names with post counts (legacy) */
export function getAllSeries(
  posts: CollectionEntry<"blog">[]
): Map<string, number> {
  const seriesMap = new Map<string, number>();
  posts
    .filter((post) => !post.data.draft && post.data.series)
    .forEach((post) => {
      const series = post.data.series!;
      seriesMap.set(series, (seriesMap.get(series) || 0) + 1);
    });
  return seriesMap;
}

/** Get all series with metadata and post counts */
export function getAllSeriesWithMetadata(
  allSeries: CollectionEntry<"series">[],
  allPosts: CollectionEntry<"blog">[]
): Array<{
  series: CollectionEntry<"series">;
  postCount: number;
  posts: CollectionEntry<"blog">[];
}> {
  return allSeries
    .map((seriesEntry) => {
      const posts = getSeriesPosts(seriesEntry.id, allPosts);
      return {
        series: seriesEntry,
        postCount: posts.length,
        posts,
      };
    })
    .filter((item) => item.postCount > 0) // Only show series with published posts
    .sort((a, b) => b.postCount - a.postCount);
}

/** Get series by category */
export function getSeriesByCategory(
  category: string,
  allSeries: CollectionEntry<"series">[],
  allPosts: CollectionEntry<"blog">[]
): Array<{
  series: CollectionEntry<"series">;
  postCount: number;
  posts: CollectionEntry<"blog">[];
}> {
  return allSeries
    .filter((s) => s.data.category === category)
    .map((seriesEntry) => {
      const posts = getSeriesPosts(seriesEntry.id, allPosts);
      return {
        series: seriesEntry,
        postCount: posts.length,
        posts,
      };
    })
    .filter((item) => item.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount);
}

/** Get featured series */
export function getFeaturedSeries(
  allSeries: CollectionEntry<"series">[],
  allPosts: CollectionEntry<"blog">[]
): Array<{
  series: CollectionEntry<"series">;
  postCount: number;
  posts: CollectionEntry<"blog">[];
}> {
  return allSeries
    .filter((s) => s.data.featured)
    .map((seriesEntry) => {
      const posts = getSeriesPosts(seriesEntry.id, allPosts);
      return {
        series: seriesEntry,
        postCount: posts.length,
        posts,
      };
    })
    .filter((item) => item.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount);
}

/** Get all categories with post counts */
export function getAllCategories(
  posts: CollectionEntry<"blog">[]
): Map<string, number> {
  const categoryMap = new Map<string, number>();
  posts
    .filter((post) => !post.data.draft)
    .forEach((post) => {
      const category = post.data.category || "technical";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
  return categoryMap;
}

/** Get posts by category, sorted by date */
export function getPostsByCategory(
  category: string,
  allPosts: CollectionEntry<"blog">[]
): CollectionEntry<"blog">[] {
  return allPosts
    .filter((post) => !post.data.draft && (post.data.category || "technical") === category)
    .sort(
      (a, b) =>
        new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    );
}

/** Category metadata for display */
export const categoryMetadata: Record<string, { label: string; description: string; color: string }> = {
  technical: {
    label: "Technical",
    description: "Deep dives on LLMs, coding, system design, and engineering",
    color: "blue",
  },
  creative: {
    label: "Creative",
    description: "Fiction, stories, experiments, and creative writing",
    color: "purple",
  },
};

/** Series status metadata for display */
export const seriesStatusMetadata: Record<string, { label: string; color: string }> = {
  ongoing: { label: "Ongoing", color: "yellow" },
  completed: { label: "Completed", color: "green" },
  planned: { label: "Planned", color: "gray" },
};

/** Slugify a string for URLs */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Pagination helper */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): { data: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(items.length / pageSize);
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    totalPages,
    currentPage: page,
  };
}
