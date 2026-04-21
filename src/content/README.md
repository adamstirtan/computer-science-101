# Content Authoring Guide

Add course pages as markdown files under this directory.

## Frontmatter contract

Each file should include YAML frontmatter:

```md
---
title: Page title
description: One-sentence summary
category: Category name
order: 1
slug: optional-custom-slug
---
```

Notes:

- `title`, `description`, and `category` are required.
- `order` is optional and controls sort order inside a category.
- `slug` is optional; when omitted, one is derived from file path.
- Navigation is generated automatically from these files.
