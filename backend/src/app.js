import express from "express"
import core from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"


const app = express()


app.use(core({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))


// import routes
import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blog.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import followRouter from "./routes/follow.routes.js"
import readingListRouter from "./routes/readingList.routes.js"


// use router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/readingLists", readingListRouter);


// error handler
app.use(errorHandler)


export { app }