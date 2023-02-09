import "reflect-metadata";
import "dotenv/config";
import session from "express-session";
import express, { Application } from "express";
import { useExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import path from "path";
import { renderToString } from "vue/server-renderer";
import vueApp from "../views/main";

const port = 3000;
const app: Application = express();
app.use(express.json());
app.use(express.static("views"));
app.use(
  session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
  })
);
useContainer(Container);

app.get("/", async (_, response) => {
  const html = await renderToString(vueApp);
  response.send(`
      <!DOCTYPE html>
      <html lang="en">
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <title>Vue SSR Example</title>
          <link rel="stylesheet" href="public/style.css">
          <script type="importmap">
            {
              "imports": {
                "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
              }
            }
          </script>
          <script type="module" src="public/app.js"></script>
        </head>
        <body>
          <div id="app">${html}</div>
        </body>
      </html>
    `);
});

const server = useExpressServer(app, {
  //routePrefix: "/api",
  controllers: [path.join(__dirname + "/controllers/*.ts")],
  middlewares: [path.join(__dirname + "/middlewares/*.ts")],
});

export const instance = server.listen(port);

console.log("Server running at http://localhost:3000");

export default app;
