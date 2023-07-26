<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <div>{{ spuInfo.spuName }}</div>
    </el-form-item>

    <el-form-item label="SKU名称">
      <el-input placeholder="SUK名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item 
        v-for="attr in attrList"
        :key="attr.id"
        :label="attr.attrName">
          <el-select>
            <el-option 
            v-for="attrVal in attr.attrValueList"
            :key="attrVal.id"
            :value="attrVal.id!" 
            :label="attrVal.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline>
    <el-form-item 
    v-for="saleAttr in saleAttrList"
    :key="saleAttr.id"
    :label="saleAttr.saleAttrName">
      <el-select>
        <el-option 
        v-for="saleAttrVal in saleAttr.spuSaleAttrValueList"
        :key="saleAttrVal.id"
        :value="saleAttrVal.id!"
        :label="saleAttr.saleAttrName"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</el-form-item>


<el-form-item label="图片列表">
  <el-table border>
    <el-table-column type="selection" width="80" align="center"></el-table-column>
    <el-table-column label="图片">
      <template #default="{row,$index}">
        <img :src="row.imgUrl" style="width: 60px;height: 60px;">
      </template>
    </el-table-column>
    <el-table-column label="名称" prop="imgName"></el-table-column>
    <el-table-column label="操作" width="100">
      <template #default="{ row, $index }">
        <el-button type="primary" size="small">设为默认</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-form-item>


<el-form-item>
  <el-button type="primary">保存</el-button>
  <el-button>取消</el-button>
</el-form-item>
  </el-form>    
</template>
  
  <script setup lang="ts">
import { onMounted, ref } from 'vue';
import { STATUS } from '../../index.vue'
import type { AttrsModelList } from '@/api/attrs';
import useCategoryStore from '@/stores/category';
import attrsApi from "@/api/attrs"
import spuApi, {type SpuImageModel, type SpuModel,type SpuSaleAttrModel } from '@/api/spu';
const categoryStore = useCategoryStore()
  const emits =  defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()
  const props = defineProps<{
    spuInfo:SpuModel
  }>()

  // 获取平台属性
  const attrList = ref<AttrsModelList>([])
  const getAttrList = async () => {
    const { category1Id, category2Id, category3Id } = categoryStore
    let result = await attrsApi.reqAttrsList(category1Id!,category2Id!,category3Id!)
    attrList.value = result
  }

  // 获取销售属性
  const saleAttrList = ref<SpuSaleAttrModel[]>([])
  const getSaleAttrList = async () => {
    let result = await spuApi.reqSaleAttrListBySpuId(props.spuInfo.id!)
    saleAttrList.value = result
  }

  // 获取图片列表
  const imageList = ref<SpuImageModel[]>([])
  const getImageList = async () => {
    let result = await spuApi.reqSpuImageListBySpuId(props.spuInfo.id!)
    imageList.value = result
  }

// 初始化数据展示
onMounted(() => {
  getAttrList() // 获取平台属性
  getSaleAttrList() // 获取销售属性
  getImageList() // 获取图片列表
})
  </script>
  
  <style scoped>
  
  </style>