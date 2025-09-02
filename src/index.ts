import { Hono } from "hono";
import { postController } from "./controllers/post.controller";

const app = new Hono();

app.get("/", (c) => {
  return c.redirect("/api", 302);
});

app.get("/api", (c) => {
  return c.text("Hello, Yaser!");
});

// registering controllers
app.route("/api", postController);

export default app;
