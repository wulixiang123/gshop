// 封装api文件,所有和个人信息相关的接口都放这个文件
import request from '@/utils/request'

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
    reqLogin(data:LoginModel){//登录
        return request.post<any,TokenModel>('/admin/acl/index/login',data)//data就是username与password
    },
    reqGetInfo(){//获取信息
        return request.get<any,UserInfoModel>(`/admin/acl/index/info`)
    },
    reqLogout(){//退出登录使用post请求
        return request.post<any,null>(`/admin/acl/index/logout`)
    }
}