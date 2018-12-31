<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        Google Calendar
    </header>
    <main>
      <b-container>
        <b-row>
          <b-col>
            Google API Authorization Status
          </b-col>
          <b-col>
            {{ status }}
          </b-col>
          <b-col v-if="status!='Valid'">
            <a :href="url">Enable</a>
          </b-col>
        </b-row>
      </b-container>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
  name: 'Edit',
  components: {
    'TopMenu': TopMenu,
  },
  data () {
    return {
        url: null,
        status: null,
    }
  },
  created () {
    console.log(this.$route.query.code);
    if(this.$route.query.code !== undefined){
      this.$http.post('/calendar/callback', {code: this.$route.query.code}).then(response => {
        this.status = response.data.status
      })
    }
    this.$http.get('/calendar/status').then(response => {
      this.status = response.data.status
    })
    this.$http.get('/calendar/url').then(response => {
      this.url = response.data.url
    })
  },
  methods: {
    save () {
    }
  }
}
</script>