<template>
  <b-container fluid>
    <b-row>
      <b-col md="4" offset-md="4">
        <h1>{{ company_name }}</h1>
        <h4>Tasca Customer Managment System</h4>
        <h2>Please Sign In</h2>
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
      password: null,
      company_name: null
    }
  },
  created() {
    this.$http.get('/settings')
      .then(response => {
        this.company_name = response.data.operating_company.name;
        this.$store.dispatch('saveSettings',response.data);
        this.$http.get('/status')
          .then(response => {
            if(response.data.status == 'active'){
              this.loginSuccessful(response);
            }
          });
      });
    
  },
  methods: {
    signin() {
      this.$http.post('/auth', { login: this.login, password: this.password })
        .then(request => {
           this.loginSuccessful(request)
        });
    },
    loginSuccessful (response) {
      if(response.data.bearer_token){
        localStorage.setItem('bearer_token', response.data.bearer_token);
      }
      this.$store.dispatch('saveUser',response.data);
      this.$router.push('/clients');
    },
    resetPassword(){
      this.$http.post('/auth/password/email', {'login' : this.login}).then((response) => {
        alert(response.data.message);
      });
    },
  }
}
</script>