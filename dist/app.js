"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}));
app.use(express_1.default.json());
// app.all("/api/auth/*splat", toNodeHandler(auth));
// app.use("/posts", postRouter);
// app.use("/comments", commentRouter)
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/api/v1", routes_1.IndexRouter);
// app.use(notFound)
// app.use(errorHandler)
exports.default = app;
//# sourceMappingURL=app.js.map