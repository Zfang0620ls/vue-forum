import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import filters from './filters'
import routes from './routers'
import './common/stylus/index.styl'
import './common/css/markdown.css'
import './common/css/reset.css'

Vue.use(VueRouter)
Vue.use(VueResource)

// 注册filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  data() {
    return {
      alertshow: false
    }
  },
  router,
  components: {
    vAlert: require('./components/alert/alert')
  }
}).$mount('#app')
