<template>
  <div>
    <TopMenu></TopMenu>
    <header>
    </header>
    <main>
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
        settings: null
    }
  },
  created () {
    this.$http.get('/settings').then(response => {
      this.settings = response.data
    })
  },
  methods: {
    save () {
    }
  }
}
</script>