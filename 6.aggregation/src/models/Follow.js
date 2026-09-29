import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
    {
        followerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        followingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

export const Follow = mongoose.model('Follow', followSchema);
