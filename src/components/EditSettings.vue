<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        General Settings
    </header>
    <main>
        <b-container>
            <b-row v-for="(value,setting) in settings" :key="setting">
              <b-col>
                {{ setting }}
              </b-col>
              <b-col>
                {{ value }}
              </b-col>
            </b-row>
        </b-container>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
  name: 'EditSettings',
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