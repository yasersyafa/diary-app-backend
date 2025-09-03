import { Hono } from "hono";
import { cors } from "hono/cors";
import { postController } from "./controllers/post.controller";
import { categoryController } from "./controllers/category.controller";
import { tagController } from "./controllers/tag.controller";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.get("/", (c) => {
  return c.redirect("/api", 302);
});

app.get("/api", (c) => {
  return c.text("Hello, Yaser Syafa!");
});

// registering controllers
app.route("/api", postController);
app.route("/api", categoryController);
app.route("/api", tagController);

export default app;
