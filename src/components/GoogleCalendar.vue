<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        Google Calendar
    </header>
    <main>
        <a :href="url">Enable</a>
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
        url: null
    }
  },
  created () {
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