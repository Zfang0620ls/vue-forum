<template>
  <div class="mask" @click="menuHidden">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    methods: {
      menuHidden() {
        this.$emit('menuHidden')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.mask
  position: fixed
  width: 100% 
  height: 100% 
  left: 0
  top: 0
  background: rgba(0, 0, 0, 0.4)
  z-index: 99
</style>
