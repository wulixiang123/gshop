import { createApp } from 'vue' // 创建vue
import pinia from './stores' // sotre
import ElementPlus from 'element-plus' // element
import zhCn from 'element-plus/es/locale/lang/zh-cn' // element
import 'element-plus/dist/index.css' // element
import App from './App.vue' // 根组件
import router from './router' // 路由
import './styles/index.scss' // 全局样式
import ElSvg from './components/SvgIcon/ElSvg' // svg图标的组件(放一放)
import './permission' // 路由守卫
import '@/mock'

const app = createApp(App)

import { vueEcharts } from '@/plugins/echarts'
app.use(vueEcharts)

import CategorySelector from '@/components/CategorySelector/index.vue'
app.component('CategorySelector', CategorySelector)


import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore()
app.directive('permissionbtn', (el, binding) => {
  if ( !userInfoStore.userInfo.buttons.includes(binding.value) ) {
    el.remove()
  }
})



ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')


// console.log(import.meta)
// console.log(import.meta.env)
// console.log(import.meta.env.VITE_API_URL)
