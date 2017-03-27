<template>
  <div class="publish">
    <v-header :left="showMenu?'200px':0" :theme="theme" @menuShow="showMenu=true"></v-header>
    <v-menu :left="showMenu?0:'-200px'" @menuHidden="showMenu=false"></v-menu>
    <v-mask v-show="showMenu" @menuHidden="showMenu=false"></v-mask> 
    <div class="publishwrap">
        <div class="category">
            <span>选择分类：</span>
            <select v-model="category">
                <option value="share">分享</option>
                <option value="ask">问答</option>
                <option value="job">招聘</option>
            </select>
            <div class="btnwrap">
              <button @click="publish">发布</button>             
            </div>
        </div>
        <div class="title">
          <input type="text" v-model="title" placeholder="请输入标题，字数大于10小于100" />
        </div> 
        <div class="content">
          <textarea rows="30" v-model="content" placeholder="支持markdown"></textarea>
        </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import vHeader from '../header/header'
  import vMenu from '../menu/menu'
  import vMask from '../mask/mask'
  import bus from '../../store'

  export default {
    data() {
      return {
        showMenu: false,
        theme: '发布',
        category: 'share',
        title: '',
        content: ''
      }
    },
    methods: {
      publish() {
        if (this.title.length < 10 || this.title.length > 100) {
          bus.$emit('alert', '请注意标题字数')
          return
        }
        this.$http.post('http://www.vue-js.com/api/v1/topics', {accesstoken: bus.user.accesstoken, title: this.title, tab: this.category, content: this.content}).then((res) => {
          this.$router.push({name: 'list'})
        }, () => {
          bus.$emit('alert', '发布失败')
        })
      }
    },
    components: {
      vHeader,
      vMenu,
      vMask
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.publish 
  padding-top: 44px
  .publishwrap
    .category
      padding: 15px
      height: 30px
      font-size: 0
      span 
        display: inline-block
        width: 30%
        line-height: 30px
        font-size: 12px
        text-align: center
      select 
        display: inline-block
        width: 40% 
        height: 20px
        margin-top: 5px 
        vertical-align: top
      .btnwrap
        display: inline-block
        width: 30% 
        height: 30px
        line-height: 30px
        vertical-align: top
        text-align: center   
        button 
          width: 60% 
          height: 24px 
          line-height: 24px
          margin-top: 3px
          vertical-align: top
          background: #80bd01
          color: #fff
          border-radius: 4px
          border: none
          outline: none
    .title
      padding: 10px
      border-top: 1px solid #d4d4d4
      border-bottom: 1px solid #d4d4d4
      input 
        width: 100% 
        line-height: 30px
        fint-size: 18px
        border: none
        outline: none
    .content
      margin: 15px
      padding: 15px
      border: 1px solid #d4d4d4
      textarea 
        width: 100%
        border: none
        resize: none
        outline: none
</style>
