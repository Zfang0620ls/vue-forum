<template>
  <div class="login">
    <v-header :left="showMenu?'200px':0" :theme="theme" @menuShow="showMenu=true"></v-header>
    <v-menu :left="showMenu?0:'-200px'" @menuHidden="showMenu=false"></v-menu>
    <v-mask v-show="showMenu" @menuHidden="showMenu=false"></v-mask> 
    <div class="loginWrap">
      <div>
        <input type="text" v-model="access" placeholder="Access Token"/> 
        <a class="loginBtn">登录</a>        
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import vHeader from '../header/header'
  import vMenu from '../menu/menu'
  import vMask from '../mask/mask'
  import $ from 'webpack-zepto'
  import bus from '../../store'

  export default {
    data() {
      return {
        showMenu: false,
        theme: '登录',
        access: ''
      }
    },
    components: {
      vHeader,
      vMenu,
      vMask
    },
    mounted() {
      $('.loginBtn').on('click', () => {
        this.$http.post('http://www.vue-js.com/api/v1/accesstoken', {accesstoken: this.access}).then((res) => {
          bus.user = res.body
          bus.user.accesstoken = this.access
          window.sessionStorage.user = JSON.stringify(bus.user)
          this.$router.push({
            name: 'list'
          })
        }, () => {
          bus.$emit('alert', '登陆失败')
        })
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.login
  .loginWrap
    padding-top: 44px    
    div 
      margin-top: 50px
      padding: 40px
      input 
        display: block
        width: 100%
        line-height: 24px
        font-size: 16px
        text-indent: 10px
        outline: none
        border: none 
        border-bottom: 1px solid #4fc08d
      a 
        display: block 
        margin-top: 10px
        width: 100% 
        line-height: 42px
        font-size: 16px
        text-align: center
        background: #4fc08d
        border-bottom: 2px solid #3aa373;
        color: #fff
        border-radius: 4px
</style>
