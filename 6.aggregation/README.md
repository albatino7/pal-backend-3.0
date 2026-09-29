# Aggregation Pipeline Class Backend

Live-coding backend for demonstrating MongoDB aggregation pipelines with Express and Mongoose.

## Setup

1. Install dependencies with `npm install`.
2. Create a local `.env` file from `.env.example` and set `MONGO_URI` and `PORT` if needed.
3. Make sure MongoDB is reachable at `MONGO_URI`.

## Seed Data

Run the seed script:

```bash
npm run seed
```

This clears the collection data, inserts the teaching dataset, and prints a summary of inserted documents.

## Run the Server

Development mode:

```bash
npm run dev
```

Production-style run:

```bash
npm start
```

## Available Endpoints

All routes are mounted under `/api/aggregation`.

- `GET /match-verified-users` - Verified users with basic profile fields.
- `GET /group-posts-by-category` - Post counts and engagement totals grouped by category.
- `GET /project-user-overview` - Compact user profile projection for teaching `$project`.
- `GET /sort-top-posts` - Posts sorted by likes and recency.
- `GET /limit-top-posts` - Top posts after limiting the sorted set.
- `GET /skip-posts-pagination` - Paginated posts using `$skip` and `$limit`.
- `GET /unwind-tags` - Explode post tags into one document per tag.
- `GET /lookup-posts-with-author` - Posts joined with author details.
- `GET /graph-lookup-follow-network` - Follow chains from a starting user.
- `GET /add-fields-engagement-score` - Add derived engagement score fields to posts.
- `GET /unset-private-user-fields` - Remove selected fields from user documents.
- `GET /replace-root-post-author` - Replace root with joined author data.
- `GET /count-posts-by-category` - Count posts for a selected category.
- `GET /sample-posts` - Return a random sample of posts.
- `GET /facet-post-stats` - Multiple post analytics views in one query.
- `GET /bucket-users-by-followers` - Bucket users by follower count.
- `GET /bucket-auto-post-likes` - Auto-bucket posts by like count.
