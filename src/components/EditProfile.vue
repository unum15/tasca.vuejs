<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        Profile
    </header>
    <main>
        <b-container>
            <b-row>
                <b-col>
                    <b-form-group label="Name">
                        <b-form-input
                            type="text"
                            @change="save"
                            v-model="profile.name"
                            required
                            >
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Email">
                        <b-form-input
                            type="text"
                            @change="save"
                            v-model="profile.login"
                            required
                            >
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Show Help">
                    <b-form-checkbox
                      @change="save"
                      v-model="profile.show_help">
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                  <b-form-group label="Show Only Activity Level At and Above">
                    <b-form-select
                      @input="save"
                      :options="activity_levels"
                      value-field="id"
                      text-field="name"
                      v-model="profile.show_maximium_activity_level_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Default Service Window">
                    <b-form-input
                      type="number"
                      v-model="profile.default_service_window"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Work Order Window">
                    <b-form-input
                      type="number"
                      v-model="profile.pending_days_out"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-col>
            </b-row>
             <b-row>           
                <b-col>
                    <b-form-group label="Password">
                        <b-form-input
                            type="password"
                            v-model="password"
                            >
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Password Again">
                        <b-form-input
                            type="password"
                            v-model="password_again"
                            >
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-button
                      @click="changePassword"
                      >
                      Change Password
                    </b-button>
                </b-col>
            </b-row>
        </b-container>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu';
import { mapState } from 'vuex';
export default {
  name: 'EditProfile',
  components: {
    'TopMenu': TopMenu,
  },
  data () {
    return {
        profile: {},
        activity_levels: [],
        password: null,
        password_again: null
    }
  },
  created () {
    this.getProfile();
    this.$http.get('/activity_levels').then(response => {
      this.activity_levels = response.data
    })
  },
  methods: {
    getProfile(){
      if(this.user_id){
        this.$http.get('/contact/' + this.user_id).then(response => {
          this.profile = response.data
        });
      }
    },
    save () {
        this.$http.patch('/contact/' + this.profile.id, this.profile)
    },
    changePassword (){
      if(this.password == this.password_again){
        this.$http.patch('/contact/' + this.profile.id, {password: this.password}).then(() => {
          alert('Password changed!');
          this.password = null;
          this.password_again = null;
        })
      }
      else{
        alert('Passwords do not match!');
      }
    }
  },
  computed:{
    ...mapState({
      user_id: state => state.user.id,
    })
  },
  watch:{
    user_id(){
        this.getProfile();
    }
  }
}
</script>