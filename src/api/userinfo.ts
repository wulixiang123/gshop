// 封装api文件,所有和个人信息相关的接口都放这个文件
import request from '@/utils/request'

// info      GET      /admin/acl/index/info
// login     POST     /admin/acl/index/login
// logout    POST     /admin/acl/index/logout

export interface LoginModel{
    username:string,
    password:string
}

export interface TokenModel{
    token:string
}

export interface UserInfoModel {
    avatar: string, // 头像
    name: string, // 名称
    buttons: string[], // 权限用
    roles: string[], // 权限用
    routes: string[] // 权限用
  }

export default {
    reqLogin(data:LoginModel){
        return request.post<any,TokenModel>('/admin/acl/index/login',data)        
    },
    reqGetInfo(){
        return request.get<any,UserInfoModel>(`/admin/acl/index/info`)
    },
    reqLogout(){
        return request.post<any,null>(`/admin/acl/index/logout`)
    }
}