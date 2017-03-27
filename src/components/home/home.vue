<template>
  <div class="home">
    <img class="logo" src="./logo.png">
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'webpack-zepto'

  export default {
    mounted() {
      setTimeout(() => {
        $('.home img').css({
          marginTop: 200,
          opacity: 1
        })
      }, 0)

      setTimeout(() => {
        this.$router.push({
          name: 'list'
        })
      }, 2000)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.home 
  height: 100% 
  overflow: hidden
  .logo
    display: block
    margin: 500px auto
    opacity: 0
    transition: 1.5s
</style>
