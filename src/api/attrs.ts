import request from '@/utils/request'

export interface AttrsValueModel{
    id:number
    valueName:string
    attrId:number
}

export interface AttrsModel{
    id:number
    attrName:string
    categoryId:number
    categoryLevel:number
    attrValueList:AttrsValueModel[]
}

type AttrsModelList = AttrsModel[]

export default{
    reqAttrsList(category1Id:number,category2Id:number,category3Id:number){
        return request.get<any,AttrsModelList>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    }
}