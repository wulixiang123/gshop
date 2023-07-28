import request from '@/utils/request'
import type { SpuImageModel } from './spu'


export interface SkuImgData {
    id?: number,
    skuId?: number,
    imgName: string,
    imgUrl: string,
    spuImgId: number,
    isDefault?: string
  }


  export interface SkuAttrValueData {
    id?: number,
    attrId: number | string,
    valueId: number | string,
    skuId?: number,
    attrName?: string,
    valueName?: string
  }




  export interface SkuSaleAttrValueData {
    id?: number,
    skuId?: number,
    spuId?: number,
    saleAttrValueId: number | string,
    saleAttrId: number | string,
    saleAttrName?: string,
    saleAttrValueName?: string
  }



export interface SkuAttrValueModel{
    attrId:string
    valueId:string
}

export interface skuSaleAttrValueModel{
    saleAttrId:string
    saleAttrValueId:string
}

export interface SkuModel {
    id?: number
    spuId: number | undefined
    tmId: number| undefined
    category3Id: number| undefined
    price: number | string
    skuName: string
    skuDesc: string
    weight: string
    skuDefaultImg: string
    isSale?: number
    createTime: string
    skuImageList: SpuImageModel[] // 收集到的图片列表
    skuAttrValueList: SkuAttrValueModel[] // 收集到的平台属性
    skuSaleAttrValueList: skuSaleAttrValueModel[] // 收集到的销售属性
  }


export type SkuPageListData = {
    records: skuInfoDate[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
}



export type skuInfoDate={
    id?: number | string
    spuId?: number
    price: number
    skuName: string
    skuDesc: string
    weight: string
    tmId?: number
    category3Id?: number
    skuDefaultImg: string
    isSale?: number
    skuImageList: SkuImgData[]
    createTime?: string
    skuAttrValueList: SkuAttrValueData[]
    skuSaleAttrValueList: SkuSaleAttrValueData[]
}


  

export default {
    // 根据spuId获取sku列表
    reqSkuListBySpuId(spuId:number){
        return request.get<any,SkuModel[]>(`/admin/product/findBySpuId/${ spuId }`)
    },
    // 保存sku
    reqSave(data:SkuModel){
        return request.post<any,null>(`/admin/product/saveSkuInfo`, data)
    },
    // 获取sku分页列表数据
    reqSkuList(page:number,limit:number){
        return request.get<any,SkuPageListData>(`admin/product/list/${page}/${limit}`)
    },
    // 上架接口
    cancelSale(skuId:number){
        return request.get<any,null>(`/admin/product/cancelSale/${skuId}`)
    },
    // 下架
    onSale(skuId: number) {
        return request.get<any, null>(`/admin/product/onSale/${skuId}`)
      },
}