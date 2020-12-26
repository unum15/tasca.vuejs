<template>
  <b-container fluid>
    <b-row>
      <b-col md="2" offset-md="5">
        <h2 class="form-signin-heading">Please sign in</h2>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="2" offset-md="5">
        <b-form-group label="Login">
        <b-form-input
          v-model="login"
          type="text"
          class="form-control"
          placeholder="Login"
          required
          autofocus
          >
        </b-form-input>
      </b-form-group>
          </b-col>
    </b-row>
    <b-row>
      <b-col md="2" offset-md="5">
        <b-form-group label="Password">
          <b-form-input
            v-model="password"
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required
          >
          </b-form-input>
        </b-form-group>
            </b-col>
    </b-row>
    <b-row>
      <b-col md="2" offset-md="5">
        <b-button variant="primary" @click="signin">Sign in</b-button>
        <b-button variant="link" @click="resetPassword">Reset</b-button>
        </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      login: null,
      password: null
    }
  },
  created() {
    this.$http.get('/status')
        .then(request => {
          if(request.data.status == 'active'){
            this.loginSuccessful(request)
          }
        })
  },
  methods: {
    signin() {
      this.$http.post('/auth', { login: this.login, password: this.password })
        .then(request => {
           this.loginSuccessful(request)
        });
    },
    loginSuccessful (req) {
      for (var prop in req.data) {
        //test for string?
        localStorage.setItem(prop, req.data[prop])
      }
      var perms = [];
      for (var role in req.data.roles) {
        for (var perm in req.data.roles[role].perms) {
          perms.push(req.data.roles[role].perms[perm].name)
        }
      }
      perms = perms.filter((value, index, perms) => (perms.indexOf(value) === index))
      localStorage.setItem('perms', perms.toString())
      this.$router.push('/clients')
    },
    resetPassword(){
      this.$http.post('/auth/password/email', {'login' : this.login}).then((response) => {
        alert(response.data.message);
      });
    },
  }
}
</script>