# Code & Chiya Blog CMS 🍵

A simple, file-based CMS for the blog section. No database needed!

## How It Works

Blog posts are markdown files stored in `src/content/blog/`. Each file has frontmatter (metadata) and markdown content.

## Adding a New Blog Post

### Step 1: Create a new `.md` file

Create a file in `src/content/blog/` with a URL-friendly name:

```
src/content/blog/my-awesome-post.md
```

### Step 2: Add frontmatter and content

```markdown
---
slug: "my-awesome-post"
title: "My Awesome Post Title"
excerpt: "A short description that appears in the blog list..."
date: "2024-11-20"
category: "technical"
readTime: "5 min"
tags: ["React", "TypeScript", "Web Dev"]
published: true
---

# Your Blog Post Title

Your content goes here! You can use:

## Headings

### Subheadings

**Bold text** and *italic text*

- Bullet points
- Like this

1. Numbered lists
2. Also work

```javascript
// Code blocks with syntax highlighting
const greeting = "Hello World!";
console.log(greeting);
\```

> Blockquotes for important notes

[Links work too](https://example.com)

![Images are supported](/path/to/image.jpg)

| Tables | Are | Supported |
|--------|-----|-----------|
| Cell 1 | 2   | 3         |
```

### Step 3: Save and refresh

That's it! The post will automatically appear in:
- The homepage "Code & Chiya" section (3 most recent posts)
- The full blog list at `/blog`
- Individual post page at `/blog/my-awesome-post`

## Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `slug` | ✅ | URL-friendly identifier | `"my-post"` |
| `title` | ✅ | Post title | `"Why I Love TypeScript"` |
| `excerpt` | ✅ | Short description | `"A love letter to type safety..."` |
| `date` | ✅ | Publication date (YYYY-MM-DD) | `"2024-11-20"` |
| `category` | ✅ | One of: `technical`, `story`, `thoughts` | `"technical"` |
| `readTime` | ✅ | Estimated reading time | `"8 min"` |
| `tags` | ✅ | Array of tags | `["React", "TypeScript"]` |
| `published` | Optional | Show/hide post (default: true) | `true` or `false` |

## Categories

- **`technical`** 🔵 (Cyan) - Deep dives, tutorials, technical explanations
- **`story`** 🟠 (Orange) - Project stories, experiences, journey posts
- **`thoughts`** 🟣 (Purple) - Opinions, reflections, personal insights

## Markdown Features

### Syntax Highlighting

````markdown
```javascript
const code = "automatically highlighted";
```

```python
def hello_world():
    print("Supports multiple languages!")
```
````

### Tables

```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data     | More data|
```

### Quotes

```markdown
> Important note or quote
```

### Links

```markdown
[Link text](https://example.com)
```

### Images

Images should be placed in the `public/` folder:

**Step 1:** Create a folder for blog images (if not exists):
```
public/blog/images/
```

**Step 2:** Add your image:
```
public/blog/images/my-screenshot.png
```

**Step 3:** Reference it in markdown:
```markdown
![Screenshot of the app](/blog/images/my-screenshot.png)

# Or with title on hover
![OCR Pipeline Diagram](/blog/images/ocr-pipeline.png "How Chitragupta AI processes images")
```

**Image Best Practices:**
- Use descriptive filenames: `chitragupta-dashboard.png` not `img1.png`
- Optimize size: Max width 1200px, compress for web
- Formats: PNG for screenshots, JPG for photos, WebP for best compression
- Alt text matters: Describe what's in the image for accessibility

**Example in blog post:**
```markdown
## The Dashboard

Here's what the interface looks like:

![Chitragupta AI Dashboard](/blog/images/dashboard-screenshot.png "Main dashboard with OCR results")

As you can see, extracted fields are highlighted...
```

## Tips

1. **Slug must be unique** - Each post needs a different slug
2. **Date format matters** - Use `YYYY-MM-DD` format
3. **Draft posts** - Set `published: false` to hide while working
4. **Tags are flexible** - Use any tags, they're just strings
5. **Read time** - Manually estimate (roughly 200 words per minute)

## File Structure

```
src/
├── content/
│   └── blog/
│       ├── bug-that-cost-me-sleep.md
│       ├── vision-mate-hackathon-to-production.md
│       ├── why-i-code-at-2am.md
│       └── [your-new-post].md
├── lib/
│   └── blog.ts                    # CMS logic
├── pages/
│   ├── BlogList.tsx               # /blog page
│   └── BlogPost.tsx               # /blog/:slug page
└── components/
    └── CodeAndChiya.tsx           # Homepage section
```

## Troubleshooting

### Post not showing?

1. Check `published: true` in frontmatter
2. Make sure file is in `src/content/blog/`
3. Check date format is `YYYY-MM-DD`
4. Verify frontmatter has `---` before and after

### Syntax highlighting not working?

Make sure your code fence has the language:

````
```javascript  ← language name here
code here
```
````

### Images not loading?

Place images in `public/` folder:
- Image at: `public/blog/my-image.jpg`
- Reference as: `![Alt](/blog/my-image.jpg)`

## Future Enhancements

Possible additions:
- [ ] Tag filtering
- [ ] Search functionality
- [ ] Related posts
- [ ] View count
- [ ] Comments (via GitHub Discussions)
- [ ] RSS feed
- [ ] Dark mode toggle for code blocks

---

Happy blogging! 🍵✨
