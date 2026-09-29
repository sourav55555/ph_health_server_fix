"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const qs_1 = __importDefault(require("qs"));
const routes_1 = require("./app/routes");
const errorHandeler_1 = require("./app/middleware/errorHandeler");
const notFound_1 = require("./app/middleware/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = require("./app/lib/auth");
const node_1 = require("better-auth/node");
const node_path_1 = __importDefault(require("node:path"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.set("query parser", (str) => qs_1.default.parse(str));
app.set("view engine", "ejs");
app.set("views", node_path_1.default.resolve(process.cwd(), `src/app/template`));
app.post("/webhook", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    console.log("webhook received", req.body);
    res.status(200).json({ received: true });
});
app.use("/api/auth", (0, node_1.toNodeHandler)(auth_1.auth));
app.use((0, cors_1.default)({
    origin: [env_1.envVars.FRONTEND_URL, env_1.envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-type", "Authorization"]
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// app.all("/api/auth/*splat", toNodeHandler(auth));
// app.use("/posts", postRouter);
// app.use("/comments", commentRouter)
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/api/v1", routes_1.IndexRouter);
app.use(errorHandeler_1.globalErrorHandler);
app.use(notFound_1.notFound);
// app.use(errorHandler)
exports.default = app;
//# sourceMappingURL=app.js.map