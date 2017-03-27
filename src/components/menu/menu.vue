<template>
  <div class="menu" :style="{left: left}">
    <div class="user">
        <div class="logined" v-if="user.loginname">
          <router-link class="link" :to="{'path':`/user/${user.loginname}`}">
            <img :src="user.avatar_url">
            <a>{{user.loginname}}</a>
            <img src="./go_icon.png" class="go" />
          </router-link>             
        </div>
        <div class="nologin" v-else>
          <router-link class="link" :to="{'name':'login'}">
            <img src="./login_icon.png">
            <a>登录</a>
          </router-link>         
        </div>
    </div>
    <div class="theme">
      <router-link class="link icon-paragraph-justify" :to="{'name':'list',query:{tab:'all'}}" @click.native="menuHidden">全部</router-link>
      <router-link class="link icon-fire" :to="{'name':'list',query:{tab:'good'}}" @click.native="menuHidden">精华</router-link>
      <router-link class="link icon-share2" :to="{'name':'list',query:{tab:'share'}}" @click.native="menuHidden">分享</router-link>
      <router-link class="link icon-bubbles" :to="{'name':'list',query:{tab:'ask'}}" @click.native="menuHidden">问答</router-link>
      <router-link class="link icon-user-tie" :to="{'name':'list',query:{tab:'job'}}" @click.native="menuHidden">招聘</router-link>       
    </div>
    <div class="about">
      <router-link class="link icon-info" :to="{'name':'about'}">关于</router-link>
    </div>
    <div class="msg" v-if="user.loginname">
      <router-link class="link icon-envelope" :to="{'name':'message'}">消息</router-link> 
      <span v-if="msgcount">{{msgcount}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bus from '../../store'

  export default {
    props: ['left'],
    data() {
      return {
        msgcount: 0,
        user: {}
      }
    },
    methods: {
      menuHidden() {
        this.$emit('menuHidden')
      }
    },
    mounted() {
      this.user = bus.user
      if (this.user.loginname) {
        this.$http.get(`http://www.vue-js.com/api/v1/message/count?accesstoken=${this.user.accesstoken}`).then((res) => {
          this.msgcount = res.body.data
        }, () => {
          bus.$emit('alert', '获取信息失败')
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.menu
  position: fixed
  top: 0
  bottom: 0
  left: -200px
  padding: 30px
  width: 140px
  background: #fff
  transition: 0.3s
  z-index: 999
  .user, .about, .msg
    padding: 15px 0
    .link
      display: block
      line-height: 24px
      text-align: center
      img 
        margin-right: 10px
        display: inline-block
        width: 24px
        height: 24px
        vertical-align: top
        border-radius: 4px
      .go 
        float: right
        margin-top: 4px
        width: 10px
        height: 16px
  .user
    border-bottom: 1px solid #d4d4d4
  .about, .msg
    border-top: 1px solid #d4d4d4
  .theme
    margin: 40px 0
    .link
      display: block
      font-size: 14px
      font-weight: 700
      line-height: 40px
      text-align: center
      color: #313131
  .msg 
    position: relative
    span
      position: absolute
      right: 20px 
      top: 15px
      display: block 
      width: 14px
      height: 14px
      line-height: 14px
      text-align: center
      font-size: 8px
      color: #fff
      background: #42b983
      border-radius: 50%
</style>
