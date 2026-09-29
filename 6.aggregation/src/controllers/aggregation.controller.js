import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

function sendAggregationResponse(res, endpoint, data) {
    return res.json({
        endpoint,
        count: data.length,
        data,
    });
}

// Which verified users should we feature first when introducing a filtered search?
export async function matchVerifiedUsers(req, res, next) {
    try {
        const pipeline = [
            {
                $match: {
                    isVerified: true,
                },
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    city: 1,
                    followersCount: 1,
                    isVerified: 1,
                },
            },
            {
                $sort: {
                    followersCount: -1,
                },
            },
        ];

        const users = await User.aggregate(pipeline);
        return sendAggregationResponse(res, 'match-verified-users', users);
    } catch (error) {
        next(error);
    }
}

// Which post categories generate the most activity overall?
export async function groupPostsByCategory(req, res, next) {
    try {
        const pipeline = [
            {
                $group: {
                    _id: '$category',
                    totalPosts: { $sum: 1 },
                    totalLikes: { $sum: '$likesCount' },
                    totalComments: { $sum: '$commentsCount' },
                },
            },
            {
                $sort: {
                    totalLikes: -1,
                },
            },
        ];

        const categories = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'group-posts-by-category', categories);
    } catch (error) {
        next(error);
    }
}

// What does a compact user profile look like when we only need display fields?
export async function projectUserOverview(req, res, next) {
    try {
        const pipeline = [
            {
                $project: {
                    _id: 0,
                    name: 1,
                    username: 1,
                    city: 1,
                    followersCount: 1,
                    memberSince: '$joinedAt',
                    accountType: {
                        $cond: [ '$isVerified', 'verified', 'standard' ],
                    },
                },
            },
            {
                $sort: {
                    followersCount: -1,
                },
            },
        ];

        const users = await User.aggregate(pipeline);
        return sendAggregationResponse(res, 'project-user-overview', users);
    } catch (error) {
        next(error);
    }
}

// Which posts should appear first when we sort by popularity and freshness?
export async function sortTopPosts(req, res, next) {
    try {
        const pipeline = [
            {
                $sort: {
                    likesCount: -1,
                    createdAt: -1,
                },
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    category: 1,
                    createdAt: 1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'sort-top-posts', posts);
    } catch (error) {
        next(error);
    }
}

// Which top posts should we show after trimming the sorted result set?
export async function limitTopPosts(req, res, next) {
    try {
        const pipeline = [
            {
                $sort: {
                    likesCount: -1,
                    createdAt: -1,
                },
            },
            {
                $limit: 5,
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    category: 1,
                    createdAt: 1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'limit-top-posts', posts);
    } catch (error) {
        next(error);
    }
}

// How do we page through posts when showing a feed in chunks?
export async function skipPostsPagination(req, res, next) {
    try {
        const page = Number.parseInt(req.query.page || '2', 10);
        const limit = Number.parseInt(req.query.limit || '4', 10);
        const skip = Math.max(page - 1, 0) * limit;

        const pipeline = [
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    createdAt: 1,
                    category: 1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'skip-posts-pagination', posts);
    } catch (error) {
        next(error);
    }
}

// What happens when each post tag becomes its own document for analysis?
export async function unwindTags(req, res, next) {
    try {
        const pipeline = [
            {
                $unwind: '$tags',
            },
            {
                $group: {
                    _id: '$tags',
                    posts: { $sum: 1 },
                    totalLikes: { $sum: '$likesCount' },
                },
            },
            {
                $sort: {
                    posts: -1,
                    totalLikes: -1,
                },
            },
        ];

        const tags = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'unwind-tags', tags);
    } catch (error) {
        next(error);
    }
}

// Which posts perform better once we join each post to its author profile?
export async function lookupPostsWithAuthor(req, res, next) {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: '$author',
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    category: 1,
                    createdAt: 1,
                    'author.name': 1,
                    'author.username': 1,
                    'author.city': 1,
                    'author.followersCount': 1,
                },
            },
            {
                $sort: {
                    likesCount: -1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'lookup-posts-with-author', posts);
    } catch (error) {
        next(error);
    }
}

// How far can a follow network spread from a starting user?
export async function graphLookupFollowNetwork(req, res, next) {
    try {
        const startUsername = req.query.username || 'aarav_codes';

        const pipeline = [
            {
                $match: {
                    username: startUsername,
                },
            },
            {
                $graphLookup: {
                    from: 'follows',
                    startWith: '$_id',
                    connectFromField: 'followingId',
                    connectToField: 'followerId',
                    as: 'followChain',
                    maxDepth: 2,
                    depthField: 'depth',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            {
                $project: {
                    name: '$profile.name',
                    username: '$profile.username',
                    followChain: 1,
                },
            },
        ];

        const network = await User.aggregate(pipeline);
        return sendAggregationResponse(res, 'graph-lookup-follow-network', network);
    } catch (error) {
        next(error);
    }
}

// Which post metrics become more useful after adding a derived engagement score?
export async function addFieldsEngagementScore(req, res, next) {
    try {
        const pipeline = [
            {
                $addFields: {
                    engagementScore: {
                        $add: [
                            '$likesCount',
                            {
                                $multiply: [ '$commentsCount', 25 ],
                            },
                        ],
                    },
                },
            },
            {
                $sort: {
                    engagementScore: -1,
                },
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    engagementScore: 1,
                    category: 1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'add-fields-engagement-score', posts);
    } catch (error) {
        next(error);
    }
}

// Which fields should disappear when we want a public-safe user document?
export async function unsetPrivateUserFields(req, res, next) {
    try {
        const pipeline = [
            {
                $unset: [ 'email' ],
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    age: 1,
                    city: 1,
                    joinedAt: 1,
                    isVerified: 1,
                    followersCount: 1,
                },
            },
            {
                $sort: {
                    followersCount: -1,
                },
            },
        ];

        const users = await User.aggregate(pipeline);
        return sendAggregationResponse(res, 'unset-private-user-fields', users);
    } catch (error) {
        next(error);
    }
}

// How can we reshape a joined document so the author becomes the root object?
export async function replaceRootPostAuthor(req, res, next) {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author',
                },
            },
            {
                $unwind: '$author',
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            '$author',
                            {
                                postCaption: '$caption',
                                likesCount: '$likesCount',
                                category: '$category',
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    email: 0,
                },
            },
        ];

        const authors = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'replace-root-post-author', authors);
    } catch (error) {
        next(error);
    }
}

// How many posts exist in a single category that we want to highlight live?
export async function countPostsByCategory(req, res, next) {
    try {
        const category = req.query.category || 'tech';

        const pipeline = [
            {
                $match: {
                    category,
                },
            },
            {
                $count: 'totalPosts',
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'count-posts-by-category', posts);
    } catch (error) {
        next(error);
    }
}

// Which random posts are good for showing that aggregation can sample live data?
export async function samplePosts(req, res, next) {
    try {
        const size = Number.parseInt(req.query.size || '3', 10);

        const pipeline = [
            {
                $sample: {
                    size,
                },
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    category: 1,
                    createdAt: 1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'sample-posts', posts);
    } catch (error) {
        next(error);
    }
}

// Which single query can summarize post performance from multiple angles at once?
export async function facetPostStats(req, res, next) {
    try {
        const pipeline = [
            {
                $facet: {
                    topPosts: [
                        {
                            $sort: {
                                likesCount: -1,
                            },
                        },
                        {
                            $limit: 3,
                        },
                        {
                            $project: {
                                caption: 1,
                                likesCount: 1,
                                category: 1,
                            },
                        },
                    ],
                    categoryBreakdown: [
                        {
                            $group: {
                                _id: '$category',
                                posts: { $sum: 1 },
                                likes: { $sum: '$likesCount' },
                            },
                        },
                        {
                            $sort: {
                                likes: -1,
                            },
                        },
                    ],
                    popularTags: [
                        {
                            $unwind: '$tags',
                        },
                        {
                            $group: {
                                _id: '$tags',
                                appearances: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                appearances: -1,
                            },
                        },
                        {
                            $limit: 5,
                        },
                    ],
                },
            },
        ];

        const stats = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'facet-post-stats', stats);
    } catch (error) {
        next(error);
    }
}

// How can we bucket users into follower-count bands for teaching segmentation?
export async function bucketUsersByFollowers(req, res, next) {
    try {
        const pipeline = [
            {
                $bucket: {
                    groupBy: '$followersCount',
                    boundaries: [ 0, 1000, 3000, 6000, 10000 ],
                    default: '10000+',
                    output: {
                        users: { $sum: 1 },
                        averageFollowers: { $avg: '$followersCount' },
                        usernames: { $push: '$username' },
                    },
                },
            },
        ];

        const buckets = await User.aggregate(pipeline);
        return sendAggregationResponse(res, 'bucket-users-by-followers', buckets);
    } catch (error) {
        next(error);
    }
}

// What natural distribution do post likes follow when MongoDB chooses the bucket ranges?
export async function bucketAutoPostLikes(req, res, next) {
    try {
        const pipeline = [
            {
                $bucketAuto: {
                    groupBy: '$likesCount',
                    buckets: 4,
                    output: {
                        posts: { $sum: 1 },
                        averageLikes: { $avg: '$likesCount' },
                        categories: { $push: '$category' },
                    },
                },
            },
        ];

        const buckets = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'bucket-auto-post-likes', buckets);
    } catch (error) {
        next(error);
    }
}
