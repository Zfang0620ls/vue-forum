<template>
  <div class="topic" :class="{noscroll: showMenu}">
    <v-header :left="showMenu?'200px':0" :theme="theme" @menuShow="showMenu=true"></v-header>
    <v-menu :left="showMenu?0:'-200px'" @menuHidden="showMenu=false"></v-menu>
    <v-mask v-show="showMenu" @menuHidden="showMenu=false"></v-mask>
    <div class="page">
        <h2 class="title">{{topic.title}}</h2>
        <div class="infoWrapper">
            <router-link :to="{path: `/user/${topic.author.loginname}`}">
            <img :src="topic.author.avatar_url" class="avatar">
            </router-link>
            <div class="info">
                <p>
                    <span class="authorname">{{topic.author.loginname}}</span> 
                    <span class="label" :class="tabToClass(topic.tab, topic.top, topic.good)">{{ topic.tab | tabToLabel(topic.top, topic.good)}}</span>
                </p> 
                <p> 
                    <span class="createat">发布于{{topic.create_at | formatTime}}</span>
                    <span class="visitcount">{{topic.visit_count}}次浏览</span>
                </p>
            </div>
        </div>
        <div class="content markdown-body" v-html="topic.content"></div>
        <div class="reply">
            <p class="replycount"><strong>{{replies.length}}</strong> 条回复</p> 
            <ul class="replylist">
                <li class="replyitem" v-for="(reply, index) in replies">
                    <div class="replyitemhead">
                        <router-link :to="{path: `/user/${reply.author.loginname}`}">
                        <img :src="reply.author.avatar_url">
                        </router-link>
                        <div>
                            <p>{{reply.author.loginname}}发布于{{reply.create_at | formatTime}}</p>
                            <p>
                                <span class="icon-thumb-up" @click="up(index)" :class="{uped: upList[index]}">{{reply.ups.length}}</span>
                                <span class="icon-mail-reply" @click="showreplybox(index, reply.author.loginname)"></span>
                            </p>
                        </div>
                    </div>
                    <div class="replyitembody markdown-body" v-html="reply.content"></div>
                    <div class="replybox" v-if="replybox[index]" :class="'replybox-'+index">
                      <textarea rows="8" placeholder="支持markdown语法"></textarea>
                      <a class="replyBtn" @click="submitreply($event, reply.id)">确定</a>
                    </div>
                </li>
            </ul>
            <div class="replybox" v-if="accesstoken">
              <textarea rows="8" placeholder="支持markdown语法"></textarea>
              <a class="replyBtn" @click="submitreply($event)">确定</a>
            </div>
        </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import vHeader from '../header/header'
  import vMenu from '../menu/menu'
  import vMask from '../mask/mask'
  import bus from '../../store'
  import $ from 'webpack-zepto'

  export default {
    data() {
      return {
        accesstoken: '',
        theme: '主题',
        showMenu: false,
        topic: {},
        replies: [],
        upList: [],
        replybox: []
      }
    },
    mounted() {
      if (bus.user.accesstoken) {
        this.accesstoken = bus.user.accesstoken
      }

      let topicId = this.$route.params.id
      this.$http.get(`http://www.vue-js.com/api/v1/topic/${topicId}`).then((res) => {
        let data = res.body.data
        this.topic = {
          id: data.id,
          title: data.title,
          author: data.author,
          content: data.content,
          create_at: data.create_at,
          visit_count: data.visit_count,
          top: data.top,
          good: data.good,
          tab: data.tab
        }
        this.replies = data.replies
        for (let i = 0; i < this.replies.length; i++) {
          this.replybox.push(false)
        }

        this.replies.forEach((reply) => {
          if (!reply.ups.length) {
            this.upList.push(false)
          } else {
            if (this.inArray(reply.ups, bus.user.id)) {
              this.upList.push(true)
            } else {
              this.upList.push(false)
            }
          }
        })
      }, () => {
        bus.$emit('alert', '获取信息失败')
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
      up(index) {
        if (!bus.user.accesstoken) {
          bus.$emit('alert', '请先登录')
          return
        }

        this.$http.post(`http://www.vue-js.com/api/v1/reply/${this.replies[index].id}/ups`, {accesstoken: bus.user.accesstoken}).then((res) => {
          res = res.body
          let num = Number($('.icon-thumb-up').eq(index).html())
          if (res.action === 'up') {
            $('.icon-thumb-up').eq(index).html(num + 1)
            this.upList.splice(index, 1, true)
          } else {
            $('.icon-thumb-up').eq(index).html(num - 1)
            this.upList.splice(index, 1, false)
          }
        }, () => {
          bus.$emit('alert', '点赞失败')
        })
      },
      inArray(p, c) {
        for (let i = 0; i < p.length; i++) {
          if (p[i] === c) {
            return true
          }
        }
        return false
      },
      showreplybox(index, name) {
        if (!bus.user.accesstoken) {
          bus.$emit('alert', '请先登录')
          return
        }
        this.replybox.splice(index, 1, true)
        this.$nextTick(() => {
          $(`.topic .replybox-${index} textarea`).val(`@${name} `)
        })
      },
      submitreply(ev, id) {
        let content = $(ev.target).siblings('textarea').val()
        if (id) {
          this.$http.post(`http://www.vue-js.com/api/v1/topic/${this.topic.id}/replies`, {accesstoken: bus.user.accesstoken, content: content, reply_id: id}).then((res) => {
            window.location.reload()
          }, () => {
            bus.$emit('alert', '回复失败')
          })
        } else {
          this.$http.post(`http://www.vue-js.com/api/v1/topic/${this.topic.id}/replies`, {accesstoken: bus.user.accesstoken, content: content}).then((res) => {
            window.location.reload()
          }, () => {
              bus.$emit('alert', '回复失败')
          })
        }
      }
    },
    components: {
      vHeader,
      vMenu,
      vMask
    },
    watch: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.topic
  height: 100% 
  &.noscroll
    overflow: hidden 
  .page
    padding-top: 44px
    .title
      margin: 15px
      padding: 5px
      font-size: 18px
      font-weight: 700
      color: #2c3e50
      line-height: 1.5
      background-color: #f0f0f0
      border-radius: 5px
    .infoWrapper 
      display: flex
      padding: 0 15px
      height: 50px
      img 
        display: block 
        width: 45px
        height: 45px
        margin-right: 15px
        border-radius: 50%
      .info
        flex: 1
        p 
          height: 24px
          .authorname, .createat
            float: left
            font-size: 12px
            line-height: 24px
          .label, .visitcount
            float: right
            font-size: 12px
          .visitcount
            line-height: 24px
          .label
            padding: 6px 12px
            color: #fff
            border-radius: 4px
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
    
    .content
      padding: 15px
      border-bottom: solid 1px #d4d4d4
    
    
    .reply
      .replycount
        padding: 15px
        font-size: 16px
        line-height: 24px
        font-weight: 700
        border-bottom: solid 1px #d4d4d4
        strong 
          color: #42b983
          font-weight: 700
      .replyitem
        padding: 15px
        border-bottom: solid 1px #d4d4d4
        .replyitemhead
          display: flex
          height: 48px
          img 
            display: block 
            width: 45px
            height: 45px
            margin-right: 15px
            border-radius: 8px
          div 
            flex: 1
            p 
              line-height: 24px
              &:nth-child(2)
                font-size: 16px
                text-align: right
                span 
                  margin-left: 20px
              .uped 
                color: #4fc08d
        .replyitembody
          padding: 15px 0  
      .replybox
        margin: 15px
        textarea 
          display: block 
          box-sizing: border-box
          padding: 15px
          width: 100% 
          font-size: 14px 
          resize: none
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
