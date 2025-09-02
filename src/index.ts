import { Hono } from "hono";
import { postController } from "./controllers/post.controller";
import { categoryController } from "./controllers/category.controller";
import { tagController } from "./controllers/tag.controller";

const app = new Hono();

app.get("/", (c) => {
  return c.redirect("/api", 302);
});

app.get("/api", (c) => {
  return c.text("Hello, Yaser!");
});

// registering controllers
app.route("/api", postController);
app.route("/api", categoryController);
app.route("/api", tagController);

export default app;
