import request from '@/utils/request'

// deleteSpu       DELETE    /admin/product/deleteSpu/{spuId}
// saveSpuInfo     POST    /admin/product/saveSpuInfo
// 更改spu信息     POST    /admin/product/updateSpuInfo
// 获取分页数据    GET     /admin/product/{page}/{limit}

// 销售属性值类型
export interface SpuSaleAttrValueModel {
  id?: number,
  isChecked?: null,
  saleAttrName?: string,
  spuId?: number,
  // -----------------
  baseSaleAttrId: number
  saleAttrValueName: string
}
// 销售属性类型
export interface SpuSaleAttrModel {
  id?: number, // 新增不存在,保存过之后才有id
  spuId?: number, // 新增不存在,保存过之后才有id
  // -----------------
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueModel[]
  // -----------------
  inputVisible?: boolean // 前端使用,后端不需要,切换input和button展示
  inputValue?: string // 前端使用,后端不需要,收集输入销售属性值
  attrIdValueId?:string // 前端使用,收集 `属性id:属性值id`
}
// 图片类型
export interface SpuImageModel {
  id?: number, // 新增不存在,保存过之后才有id
  spuId?: number, // 新增不存在,保存过之后才有id
  // ----------------
  imgName: string
  imgUrl: string,
  // ----------------
  name?: string, // 前端使用,组装数据使用(upload展示必须有)
  response?: any //  前端使用,组装数据使用
  url?: string // 前端使用,组装数据使用(upload展示必须有)
  isDefault?: string // 0是不默认  1是默认
}
// SPU类型
export interface SpuModel {
  id?: number
  spuName: string
  description: string
  category3Id: number | undefined
  tmId: number | undefined
  spuSaleAttrList: SpuSaleAttrModel[]
  spuImageList: SpuImageModel[]
}

export interface SpuPageModel {
  records: SpuModel[]
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

export interface SaleAttrModel { id: number, name: string }

export default {
  // 获取spu分页数据
  reqSpuPage(page: number ,limit: number, category3Id: number) {
    return request.get<any, SpuPageModel>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  },
  // 获取销售属性数据列表
  reqSaleAttrList() {
    return request.get<any, SaleAttrModel[]>(`/admin/product/baseSaleAttrList`)
  },
  //保存spu
  reqSaveSpu(data: SpuModel) {
    return request.post<any, null>(`/admin/product/saveSpuInfo`, data)
  },
  // 编辑根据spu的id获取图片列表
  reqSpuImageListBySpuId(spuId: number) {
    return request.get<any, SpuImageModel[]>(`/admin/product/spuImageList/${ spuId }`)
  },
  // 编辑根据spu的id获取销售属性列表
  reqSaleAttrListBySpuId(spuId: number) {
    return request.get<any, SpuSaleAttrModel[]>(`/admin/product/spuSaleAttrList/${ spuId }`)
  },
  // 编辑保存spu
  reqUpdateSpu(data: SpuModel) {
    return request.post<any,null>(`/admin/product/updateSpuInfo`, data)
  },
  // 删除spu
  reqDeleteSpu(spuId:number){
    return request.delete<any,null>(`/admin/product/deleteSpu/${spuId}`)
  }
}