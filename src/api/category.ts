import request from '@/utils/request'

export interface CategoryModel{
    id:number
    name:string
    category1Id?:number
    category2Id?:number
}

export default {
    reqCategory1List(){
        return request.get<any,CategoryModel[]>(`/admin/product/getCategory1`)
    },
    reqCategory2List(){
        return request.get<any,CategoryModel[]>(`/admin/product/getCategory2/${category1Id}`)
    },
    reqCategory3List(){
        return request.get<any,CategoryModel[]>(`/admin/product/getCategory3/${category2Id}`)
    },
}