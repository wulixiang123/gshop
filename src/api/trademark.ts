import request from '@/utils/request'

export interface TMModel{
    id?:number,
    tmName:string
    logoUrl:string
}

export interface TMPageModel {
    records:TMModel[],
    total:number,
    size:number
    current:number
    searchCount:boolean
    pages:number
}

export default {
    reqPage(page:number,limit:number){
        return request.get<any,TMPageModel>(`/admin/product/baseTrademark/${page}/${limit}`)
    },
    reqSave(data:TMModel){
        return request.post<any,null>(`/admin/product/baseTrademark/save`,data)
    }
}