import express, { Application } from 'express'
import cors from 'cors';
import { IndexRouter } from './app/routes';

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))

app.use(express.json());

// app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use("/posts", postRouter);
// app.use("/comments", commentRouter)

app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/api/v1", IndexRouter)
// app.use(notFound)
// app.use(errorHandler)
export default app;