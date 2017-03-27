<template>
  <div class="header" :style="{left: left}">
    <img src="./nav_icon.png" @click="menuShow">
    <h1>{{theme}}</h1>
    <span class="release icon-paperplane" @click="release"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../store'
  export default {
    props: ['theme', 'left'],
    methods: {
      menuShow() {
        this.$emit('menuShow')
      },
      release() {
        if (!bus.user.accesstoken) {
          bus.$emit('alert', '请先登录')
        } else {
          this.$router.push({name: 'publish'})
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.header
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 44px 
  background: #fff
  border-bottom: 1px solid #e8e8e8
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25)
  transition: 0.3s
  z-index: 9
  h1
    width: 100% 
    height: 100%
    line-height: 44px
    font-size: 16px
    text-align: center
  img 
    position: absolute
    left: 0
    top: 0
    width: 19px
    height: 16px
    padding: 14px 15px
  .release
    position: absolute
    right: 15px
    top: 0
    line-height: 44px
    color: #42b983
</style>
