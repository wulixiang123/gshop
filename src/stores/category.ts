import {defineStore} from 'pinia'
import categoryApi,{ type CategoryModel} from '@/api/category'

interface CategoryStateModel{
    category1List:CategoryModel[]
}

const useCategoryStore = defineStore('category',{
    state:():CategoryStateModel=>({
        category1List:[]
    }),
    actions:{
        async getCategory1List(){
            let result = await categoryApi.reqCategory1List()
            this.category1List = result
        }
    },
    getters:{}
})

export default useCategoryStore