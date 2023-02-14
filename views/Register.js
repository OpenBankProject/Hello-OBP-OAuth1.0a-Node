const Register = {
  data: () => ({
    form: {
      email: "",
      password: "",
      checked: false
    },
  }),
  methods: {
    onSubmit(event) {
        event.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(event) {
        event.preventDefault()
        this.form.email = ''
        this.form.name = ''
        this.form.checked = false
      }
  },
  template: `<div class="container">
    <form @submit="onSubmit" @reset="onReset">
      <h3 class="mb-3">Register</h3>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="form.email">
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" v-model="form.password">
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="form.checked">
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>`,
};

export default Register;
