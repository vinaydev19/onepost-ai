import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 5000,
    },
    Blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        index: true 
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true 
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)