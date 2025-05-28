import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
    Blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        index: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        index: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    }
}, { timestamps: true })


likeSchema.index(
    { Blog: 1, likedBy: 1 },
    {
        unique: true,
        partialFilterExpression: { Blog: { $exists: true } }
    }
);

likeSchema.index(
    { comment: 1, likedBy: 1 },
    {
        unique: true,
        partialFilterExpression: { comment: { $exists: true } }
    }
);


export const Like = mongoose.model("Like", likeSchema)