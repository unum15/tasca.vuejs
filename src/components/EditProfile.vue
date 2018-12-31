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
            </b-row>
            <b-row>
                <b-col>
                  <b-form-group label="Show Only Activity Level Below">
                    <b-form-select
                      @change="save"
                      :options="activity_levels"
                      value-field="id"
                      text-field="name"
                      v-model="profile.show_activity_level_id">
                    </b-form-select>
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
                    <b-form-group label="Password">
                        <b-form-input
                            type="password"
                            v-model="profile.password"
                            >
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Password Again">
                        <b-form-input
                            type="password"
                            v-model="profile.password_again"
                            >
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-container>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
  name: 'EditProfile',
  components: {
    'TopMenu': TopMenu,
  },
  data () {
    return {
        profile: {},
        activity_levels: []
    }
  },
  created () {
    var id = localStorage.getItem('id')
    this.$http.get('/contact/' + id).then(response => {
      this.profile = response.data
    })
    this.$http.get('/activity_levels').then(response => {
      this.activity_levels = response.data
    })
  },
  methods: {
    save () {
        this.$http.patch('/contact/' + this.profile.id, this.profile)
    }
  }
}
</script>