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
      <html lang>
      <html>
        <head>
          <title>Vue SSR</title>
          <link rel="stylesheet" href="public/style.css">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-vue/2.23.1/bootstrap-vue.min.css"/>
          <script type="importmap">
            {
              "imports": {
                "vue":               "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.41/vue.esm-browser.prod.js",
                "vue-router":        "https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.1.5/vue-router.esm-browser.min.js",
                "@vue/devtools-api": "https://unpkg.com/@vue/devtools-api@6.4.5/lib/esm/index.js",
                "bootstrap-vue":     "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-vue/2.23.1/bootstrap-vue.esm.min.js"
              }
            }
          </script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous">
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
