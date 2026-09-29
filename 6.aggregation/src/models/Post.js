import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        tags: {
            type: [ String ],
            required: true,
        },
        likesCount: {
            type: Number,
            required: true,
        },
        commentsCount: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        category: {
            type: String,
            enum: [ 'tech', 'travel', 'food', 'fitness', 'art' ],
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

export const Post = mongoose.model('Post', postSchema);
