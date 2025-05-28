import mongoose, { Schema } from "mongoose";

const followSchema = new mongoose.Schema({
    followers: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

followSchema.index({ followers: 1, following: 1 }, { unique: true });


export const Follow = mongoose.model("Follow", followSchema)