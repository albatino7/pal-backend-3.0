import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        likesCount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

export const Comment = mongoose.model('Comment', commentSchema);
