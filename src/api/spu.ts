import request from '@/utils/request'

export interface SpuModel{
  id?: number
  spuName: string
  description: string
  category3Id: number
  tmId: number
  spuSaleAttrList: null
  spuImageList: null
}

export interface SpuPageModel{
  records: SpuModel[]
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

export default {
    reqSpuPage(page:number,limit:number,category3Id:number){
        return request.get<any,SpuPageModel>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
    }
}