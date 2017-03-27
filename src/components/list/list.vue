<template>
  <div class="topics" :class="{noscroll: showMenu}">
    <v-header :left="showMenu?'200px':0" :theme="theme" @menuShow="showMenu=true"></v-header>
    <v-menu :left="showMenu?0:'-200px'" @menuHidden="showMenu=false"></v-menu>
    <v-mask v-show="showMenu" @menuHidden="showMenu=false"></v-mask>
    <div class="page">
      <ul>
        <li v-for="topic in topics" class="topic">
          <router-link :to="`/topic/${topic.id}`">
          <div class="titleWrap">
            <span class="label" :class="tabToClass(topic.tab, topic.top, topic.good)">{{topic.tab | tabToLabel(topic.top, topic.good)}}</span>
            <span class="title">{{topic.title}}</span>
          </div>
          <div class="infoWrap">
            <img :src="topic.author.avatar"> 
            <div class="info">
              <p>
                <span class="loginname">{{topic.author.loginname}}</span>
                <span class="replycount"><strong>{{topic.reply_count}}</strong> /{{topic.visit_count}}</span>
              </p>
              <p> 
                <span class="createat">{{topic.create_at | formatTime}}</span> 
                <span class="replyat">{{topic.last_reply_at | formatTime}}</span>
              </p>
            </div>
          </div>
          </router-link>
        </li>
      </ul>
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
        scroll: true,
        topics: [],
        searchKey: {
          tab: 'all',
          page: 1,
          limit: 20
        }
      }
    },
    computed: {
      theme() {
        switch (this.searchKey.tab) {
          case 'all':
            return '全部'
          case 'good':
            return '精华'
          case 'ask':
            return '问答'
          case 'job':
            return '招聘'
          case 'share':
            return '分享'
        }
      }
    },
    mounted() {
      let temp
      if (window.sessionStorage.temp) {
        temp = JSON.parse(window.sessionStorage.temp)
      }
      console.log(temp)
      this.searchKey.tab = this.$route.query.tab || 'all'
      if (temp && temp.searchKey.tab === this.searchKey.tab) {
        this.searchKey = temp.searchKey
        this.topics = temp.topics
        this.$nextTick(() => {
          $(window).scrollTop(temp.scrollTop)
        })
      } else {
        this.getTopics()
      }

      $(window).on('scroll', () => {
        let wH = $(window).height()
        let wSH = $(window).scrollTop()

        if (($(document).height() < (wH + wSH + 200)) && this.scroll) {
          this.searchKey.page++
          this.getTopics()
        }
      })
    },
    methods: {
      tabToClass(tab, top, good) {
        if (top) {
            return 'top'
        }
        if (good) {
            return 'good'
        }
        return tab
      },
      getTopics() {
        this.scroll = false
        this.$http.get(`http://www.vue-js.com/api/v1/topics?tab=${this.searchKey.tab}&page=${this.searchKey.page}&limit=${this.searchKey.limit}`).then((res) => {
          let data = res.body.data
          data = data.map((topic) => {
            return {
              id: topic.id,
              tab: topic.tab,
              title: topic.title,
              last_reply_at: topic.last_reply_at,
              reply_count: topic.reply_count,
              visit_count: topic.visit_count,
              create_at: topic.create_at,
              good: topic.good,
              top: topic.top,
              author: {
                loginname: topic.author.loginname,
                avatar: topic.author.avatar_url
              }
            }
          })
          data.forEach((topic) => {
            this.topics.push(topic)
          })
          this.scroll = true
        }, () => {
          bus.$emit('alert', '获取列表失败，请重试')
        })
      }
    },
    components: {
      vHeader,
      vMenu,
      vMask
    },
    watch: {
      $route() {
        this.topics = []
        this.searchKey = {
          tab: this.$route.query.tab,
          page: 1,
          limit: 20
        }
        this.getTopics()
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.name !== 'topic') {
        window.sessionStorage.removeItem('temp')
      }
      next()
    },
    beforeRouteLeave(to, from, next) {
      $(window).off('scroll')
      window.sessionStorage.temp = JSON.stringify({
        searchKey: this.searchKey,
        topics: this.topics,
        scrollTop: $(window).scrollTop()
      })
      next()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.topics
  height: 100% 
  &.noscroll
    overflow: hidden 
  .page 
    padding-top: 44px
    .topic
      padding: 10px 15px 
      border-bottom: 1px solid #d5dbdb
      .titleWrap 
        display: flex
        .label
          padding: 6px
          font-size: 12px
          color: #fff
          border-radius: 2px
          margin-right: 10px
          &.top
            background: #E74C3C
          &.good
            background: #E67E22
          &.share
            background: #1ABC9C
          &.ask
            background: #3498DB
          &.gob
            background: #9B59B6
        .title
          flex: 1
          height: 24px
          line-height: 24px
          white-space: nowrap
          text-overflow: ellipsis
          overflow: hidden
          font-weight: 600
      .infoWrap
        margin-top: 10px
        display: flex
        img
          display: block
          margin-right: 10px
          width: 38px
          height: 38px
          border-radius: 50%
        .info
          flex: 1
          height: 38px 
          font-size: 14px
          line-height: 19px 
          p 
            height: 19px
          .loginname
          .createat
            float: left
          .replycount
            float: right
            strong 
              font-weight: 600
              color: #42b983
          .replyat
            float: right
</style>
