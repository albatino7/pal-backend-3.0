import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Follow } from '../models/Follow.js';
import { usersData } from './data/users.data.js';
import { postsData } from './data/posts.data.js';
import { commentsData } from './data/comments.data.js';
import { followsData } from './data/follows.data.js';

dotenv.config();

function createIdMap(items) {
    return items.reduce((map, item) => {
        map[ item._id ] = new mongoose.Types.ObjectId();
        return map;
    }, {});
}

async function clearCollections() {
    await Promise.all([
        User.deleteMany({}),
        Post.deleteMany({}),
        Comment.deleteMany({}),
        Follow.deleteMany({}),
    ]);
}

async function seed() {
    await connectDB();

    try {
        await clearCollections();

        const userIdMap = createIdMap(usersData);
        const postIdMap = createIdMap(postsData);
        const commentIdMap = createIdMap(commentsData);
        const followIdMap = createIdMap(followsData);

        const usersToInsert = usersData.map((user) => ({
            ...user,
            _id: userIdMap[ user._id ],
            joinedAt: new Date(user.joinedAt),
        }));

        const postsToInsert = postsData.map((post) => ({
            ...post,
            _id: postIdMap[ post._id ],
            userId: userIdMap[ post.userId ],
            createdAt: new Date(post.createdAt),
        }));

        const commentsToInsert = commentsData.map((comment) => ({
            ...comment,
            _id: commentIdMap[ comment._id ],
            postId: postIdMap[ comment.postId ],
            userId: userIdMap[ comment.userId ],
            createdAt: new Date(comment.createdAt),
        }));

        const followsToInsert = followsData.map((follow) => ({
            ...follow,
            _id: followIdMap[ follow._id ],
            followerId: userIdMap[ follow.followerId ],
            followingId: userIdMap[ follow.followingId ],
            createdAt: new Date(follow.createdAt),
        }));

        const [ insertedUsers, insertedPosts, insertedComments, insertedFollows ] = await Promise.all([
            User.insertMany(usersToInsert),
            Post.insertMany(postsToInsert),
            Comment.insertMany(commentsToInsert),
            Follow.insertMany(followsToInsert),
        ]);

        console.log('Seed complete');
        console.log(`Users inserted: ${insertedUsers.length}`);
        console.log(`Posts inserted: ${insertedPosts.length}`);
        console.log(`Comments inserted: ${insertedComments.length}`);
        console.log(`Follows inserted: ${insertedFollows.length}`);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        process.exit(process.exitCode || 0);
    }
}

seed();
