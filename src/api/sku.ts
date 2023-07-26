import request from '@/utils/request'

export interface SkuModel {
    id?: number
    spuId: number
    price: number
    skuName: string
    skuDesc: string
    weight: string
    tmId: number
    category3Id: number
    skuDefaultImg: string
    isSale: number
    createTime: string
    skuImageList: null // 到时候过来改(新增的时候)
    skuAttrValueList: null // 到时候过来改(新增的时候)
    skuSaleAttrValueList: null // 到时候过来改(新增的时候)
  }
  

export default {
    reqSkuListBySpuId(spuId:number){
        return request.get<any,SkuModel[]>(`/admin/product/findBySpuId/${ spuId }`)
    }
}