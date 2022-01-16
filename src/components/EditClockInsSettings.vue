<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        General Settings
    </header>
    <main>
        <b-container>
            <b-row>
              <b-col>
                <b-form-group label="Clock in reminders ">
                  <b-form-input type="text" v-model="settings.clock_in_reminder_minutes"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Color">
                  <b-form-input type="color" v-model="settings.clock_in_reminder_color"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Second Reminder">
                  <b-form-input type="text" v-model="settings.clock_in_second_reminder_minutes"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Current clock ins">
                  <b-form-input type="color" v-model="settings.clock_in_current_color"></b-form-input>
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
  name: 'EditClockInsSettings',
  components: {
    'TopMenu': TopMenu,
  },
  data () {
    return {
        settings: {}
    }
  },
  created () {
    this.$http.get('/settings').then(response => {
      this.settings = response.data
    })
  },
  methods: {
    save () {
        this.$http.patch('/settings/', this.settings)
    }
  }
}
</script>