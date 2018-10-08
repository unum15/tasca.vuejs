<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import TopMenu from '@/components/TopMenu'
export default {
  name: 'app',
  components: {
    'TopMenu': TopMenu
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
