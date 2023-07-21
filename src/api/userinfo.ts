// 封装api文件,所有和个人信息相关的接口都放这个文件
import request from '@/utils/request'

// info      GET      /admin/acl/index/info
// login     POST     /admin/acl/index/login
// logout    POST     /admin/acl/index/logout

interface LoginModel{
    username:string,
    password:string
}

export default {
    reqLogin(data:LoginModel){
        return request.post('/admin/acl/index/login',data)
    },
    reqGetInfo(){
        return request.get(`/admin/acl/index/info`)
    }
}