const Login = {
  data: () => ({
    email: "",
    password: "",
  }),
  methods: {
    login(submitEvent) {
      this.email = submitEvent.target.elements.email.value;
      this.password = submitEvent.target.elements.password.value;
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          console.log("SignIn");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  template: `<div class="container">
    <form @submit.prevent="login">
      <h3 class="mb-3">Login</h3>
      <div class="input">
        <label for="email">Email address</label>
        <input
          class="form-control"
          type="text"
          name="email"
          placeholder="email@adress.com"
        />
      </div>
      <div class="input">
        <label for="password">Password</label>
        <input
          class="form-control"
          type="password"
          name="password"
          placeholder="password123"
        />
      </div>
      <div class="alternative-option mt-4">
          <router-link to="/register">Register</router-link>
      </div>
      <button type="submit" class="mt-4 btn-pers" id="login_button">
        Login
      </button>
      <div
        class="alert alert-warning alert-dismissible fade show mt-5 d-none"
        role="alert"
        id="alert_1"
      >
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </form>
  </div>`,
};

export default Login;
