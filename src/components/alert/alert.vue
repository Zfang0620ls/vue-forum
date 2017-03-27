<template>
<div class="alert">
    <p>{{msg}}</p>
</div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../store'

  export default {
    data() {
      return {
        msg: ''
      }
    },
    mounted() {
      bus.$on('alert', (msg) => {
        this.msg = msg
        this.alert()
      })
    },
    methods: {
      alert() {
        this.$emit('alertshow')
        setTimeout(() => {
          this.$emit('alerthidden')
        }, 2000)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.alert 
  position: fixed
  top: 50px
  left: 0
  width: 100%
  height: 30px
  z-index: 999
  p
    margin: 30px
    line-height: 50px
    text-align: center
    background: #f2dede
    font-size: 18px
    color: #a94442
    border-radius: 4px
</style>
