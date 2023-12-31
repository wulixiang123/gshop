import request from '@/utils/request'

export interface AttrsValueModel{
    id?:number
    valueName:string
    attrId?:number
    inputVisible?: boolean // 后端不用这个数据,给后端传也无所谓,不会解析(前端用)
}

export interface AttrsModel{
    id?:number
    attrName:string
    categoryId:number | undefined
    categoryLevel:number | undefined
    attrValueList:AttrsValueModel[]
    attrIdValueId?:string//前端使用,用来收集数据
}

export type AttrsModelList = AttrsModel[]

export default{
    reqAttrsList(category1Id:number,category2Id:number,category3Id:number){
        return request.get<any,AttrsModelList>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    reqSaveAttrInfo(data:AttrsModel){
        return request.post<any,null>(`/admin/product/saveAttrInfo`, data)
    },
    reqDeleteAttr(attrId: number){
        return request.delete<any,null>(`/admin/product/deleteAttr/${attrId}`)
    }
}