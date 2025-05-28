import mongoose, { Schema } from "mongoose";
import slugify from "slugify"

const blogSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        index: true,
    },
    content: {
        type: String,
        required: true
    },
    featuredImage: {
        type: String, // cloudinary url
    },
    files: [
        {
            type: String,
        }
    ], // it like list of image, video, audio that user can upload in blog
    status: {
        type: String,
        enum: ["Draft", "Published", "Pending Approval"],
        default: "Draft",
        index: true
    },
}, { timestamps: true })


blogSchema.pre("save", async function (next) {
    if (!this.isModified('title')) return next();

    const baseSlug = slugify(this.title, { replacement: "-", lower: true, strict: true });
    this.slug = `${baseSlug}-${this._id}`;
    next();
})


export const Blog = mongoose.model("Blog", blogSchema)