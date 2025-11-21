import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Polyfill Buffer for browser
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: 'story' | 'technical' | 'thoughts';
  readTime: string;
  tags: string[];
  published: boolean;
  content: string;
}

// Import all markdown files from the blog directory
const blogFiles = import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true });

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const path in blogFiles) {
    try {
      const fileContent = blogFiles[path] as string;
      const { data, content } = matter(fileContent);

      if (data.published !== false) {
        posts.push({
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          date: data.date,
          category: data.category,
          readTime: data.readTime,
          tags: data.tags || [],
          published: data.published ?? true,
          content: content,
        });
      }
    } catch (error) {
      console.error(`Error parsing blog post at ${path}:`, error);
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
