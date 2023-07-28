import type { RouteRecordRaw } from "vue-router";
import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
// import type { UserInfoState } from './interface';
import {ElMessage} from 'element-plus'
import {allAsyncRoutes, anyRoute, staticRoutes} from '@/router/routes'
import userinfoApi,{type UserInfoModel} from '@/api/userinfo';



const filterRoutes = (allAsyncRoutes:RouteRecordRaw[],routes:string[])=>{
  let newArr = allAsyncRoutes.filter(route=>{
    let isExist = routes.includes((route.name as string))
    if(route.children && route.children.length){
      route.children = filterRoutes(route.children,routes)
    }
    return isExist
  })
  return newArr
}







export interface UserInfoState {
  token: string;
  userInfo: UserInfoModel
  menuRoutes: RouteRecordRaw[] // 用于生成导航菜单的路由列表
}

// 初始化个人信息
const initUserinfo = ():UserInfoModel => ({
    avatar: '', // 头像
    name: '', // 名称
    buttons: [], // 权限用  
    roles: [], // 权限用
    routes: [] // 权限用
})


/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

  state: (): UserInfoState => ({
    token: getToken() as string,
    userInfo: initUserinfo(),//存储的各种信息
    menuRoutes: []
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        let result = await userinfoApi.reqLogin({ username, password })//验证账号密码
        // console.log(result);
        setToken(result.token)//设置token
        this.token = result.token//赋值给state中的token
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    },

    
    async getInfo () {
      try {
        let result = await userinfoApi.reqGetInfo()//获取到个人信息
        // console.log(result);
        this.userInfo = result// 存储个人信息(包括权限信息)
        // this.menuRoutes = staticRoutes// 根据权限信息展示侧边栏,目前写死
        debugger

        let asyncRoutes = filterRoutes(allAsyncRoutes,result.routes)
        console.log('筛选后',asyncRoutes);
        let allRoutes = staticRoutes.concat(asyncRoutes,anyRoute)
        this.menuRoutes = allRoutes
        
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    },


    async reset(){
      try {
        await userinfoApi.reqLogout()//调用退出登录接口
      } catch (error) {
        console.log(error);
      }finally{
        removeToken()// 删除local中保存的token
        this.token = ''// 提交重置用户信息的mutation
        this.userInfo = initUserinfo()
      }
    }


    // login (username: string, password: string) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       if (username==='admin' && password==='111111') {
    //         const token = 'token-atguigu'
    //         setToken(token) // 把获取到的token存localStorage
    //         this.token = token // 把获取到的token存Store
    //         resolve(token)
    //       } else {
    //         reject(new Error('用户名或密码错误!'))
    //         ElMessage.error('用户名或密码错误!')
    //       }
    //     }, 1000)
    //   })
    // },
    // getInfo () {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       this.name = 'admin'
    //       this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    //       // 给侧边菜单栏渲染的数据进行赋值
    //       // 目前这里也是写死,后期再写权限的时候,需要写成活的
    //       // 为什么要写成活的?
    //       // 因为每个人进入系统看到的侧边菜单栏事不一样的
    //       this.menuRoutes = staticRoutes
    //       resolve({name: this.name, avatar: this.avatar, token: this.token})
    //     }, 1000)
    //   })
    // },

    // reset () {
    //   // 删除local中保存的token
    //   removeToken()
    //   // 提交重置用户信息的mutation
    //   this.token = ''
    //   this.name = ''
    //   this.avatar = ''
    // },
  },
});
