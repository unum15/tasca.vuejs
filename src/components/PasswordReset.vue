<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <h2>Please input password</h2>
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
        <b-form-group label="Retype Password">
          <b-form-input
            v-model="password_confirmation"
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
      <b-col>
        <b-button variant="primary" @click="resetPassword">Reset</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'PasswordReset',
  data() {
    return {
      password: null,
      password_confirmation: null,
      error: null
    }
  },
  methods: {
    resetPassword(){
      let token = this.$route.query.token;
      let login = this.$route.query.email;
      this.$http.post('/auth/password/reset', {'token': token, 'login': login, 'password': this.password, 'password_confirmation': this.password_confirmation }).then((response) => {
        alert(response.data.message);
        this.$router.push('/')
      });
    },
  }
}
</script>