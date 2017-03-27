const routers = [
  {
    path: '/',
    name: 'home',
    component: require('./components/home/home')
  },
  {
    path: '/list',
    name: 'list',
    component: require('./components/list/list')
  },
  {
    path: '/topic/:id',
    name: 'topic',
    component: require('./components/topic/topic')
  },
  {
    path: '/login',
    name: 'login',
    component: require('./components/login/login')
  },
  {
    path: '/user/:id',
    name: 'user',
    component: require('./components/user/user')
  },
  {
    path: '/about',
    name: 'about',
    component: require('./components/about/about')
  },
  {
    path: '/message',
    name: 'message',
    component: require('./components/message/message')
  },
  {
    path: '/publish',
    name: 'publish',
    component: require('./components/publish/publish')
  },
  {
    path: '*',
    component: require('./components/home/home')
  }
]

export default routers
