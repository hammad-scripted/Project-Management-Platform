import express from "express";
import cors from "cors";
import healthCheckRouter from "./routes/health.routes.js";
const app = express();

//** MIDDLEWARES */

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//** ROUTES */

app.use("/api/v1/healthcheck", healthCheckRouter);
app.get("/", (req, res) => {
  res.send("hello");
});
export default app;
