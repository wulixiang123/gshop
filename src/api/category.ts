import request from '@/utils/request'//引入axios的二次封装文件
export interface CategoryModel {//定义类型
  id: number
  name: string
  category1Id?: number // 只有在二级的数据中有
  category2Id?: number // 只有在三级的数据中有
}

export default {
  reqCategory1List() {
    // 发请求获取数据
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory1`)
  },
  reqCategory2List(category1Id: number) {
    // 发请求获取数据需要带上上一级的id
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory2/${category1Id}`)
  },
  reqCategory3List(category2Id: number) {
    return request.get<any, CategoryModel[]>(`/admin/product/getCategory3/${category2Id}`)
  },
}