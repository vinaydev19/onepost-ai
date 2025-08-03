import mongoose, { Schema } from "mongoose";

const followSchema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId, // 	The user who follows someone else
    ref: 'User',
    required: true
  },
  followingId: {
    type: Schema.Types.ObjectId, // 	The user who is being followed
    ref: 'User',
    required: true
  }
}, { timestamps: true });

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema);
