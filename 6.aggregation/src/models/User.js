import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        age: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        joinedAt: {
            type: Date,
            required: true,
        },
        isVerified: {
            type: Boolean,
            required: true,
        },
        followersCount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

export const User = mongoose.model('User', userSchema);
