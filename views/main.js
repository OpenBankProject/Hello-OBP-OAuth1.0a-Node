import { createSSRApp } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "./App.js";
import Login from "./Login.js";
import Register from "./Register.js";
import Layout from "./Layout.js";

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/layout', component: Layout },
]
const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const app = createSSRApp(App);
app.use(router)

export default app;
