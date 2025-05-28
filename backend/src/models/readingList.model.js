import mongoose, { Schema } from "mongoose";

const readingListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    blog: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    }
}, { timestamps: true })

export const ReadingList = mongoose.model("ReadingList", readingListSchema)