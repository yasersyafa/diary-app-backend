import { Hono } from "hono";

const app = new Hono();
// creating base path for api is /api
app.basePath("/api");

app.get("/", (c) => {
  return c.redirect("/api", 302);
});

app.get("/api", (c) => {
  return c.text("Hello, Yaser!");
});

export default app;
