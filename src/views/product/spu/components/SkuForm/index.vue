<template>
  <!-- <div>
    <div>SkuForm - 新增SKU</div>
    <el-button @click="emits('update:modelValue', STATUS.SPULIST)">取消</el-button>
  </div> -->
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <div>{{ spuInfo.spuName }}</div>
    </el-form-item>

    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" v-model="skuForm.price"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="skuForm.weight"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述" v-model="skuForm.skuDesc"></el-input>
    </el-form-item>


    <el-form-item label="平台属性">

      <el-form inline>

        <el-form-item
          v-for="attr in attrList"
          :key="attr.id"
          :label="attr.attrName"
        >
          <el-select v-model="attr.attrIdValueId">
            <el-option
              v-for="attrVal in attr.attrValueList"
              :key="attrVal.id"
              :value="`${attr.id}:${attrVal.id}`"
              :label="attrVal.valueName"
            ></el-option>
          </el-select>
        </el-form-item>


      </el-form>

    </el-form-item>


    <el-form-item label="销售属性">

      <el-form inline>

        <el-form-item
          v-for="saleAttr in saleAttrList"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName"
        >
          <el-select v-model="saleAttr.attrIdValueId">
            <el-option
              v-for="saleAttrVal in saleAttr.spuSaleAttrValueList"
              :key="saleAttrVal.id"
              :value="`${saleAttr.id}:${saleAttrVal.id}`"
              :label="saleAttrVal.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>

    </el-form-item>

    <el-form-item label="图片列表">

      <el-table :data="imageList" border>
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row, $index }">
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
// #region
// 1. 静态搭建
// 2. 初始化数据展示
//    展示spu的名称 -- 数据从主列表点击的row(一条spu)传过来
//    展示平台属性 -- 数据调用接口
//    展示销售属性 -- 数据调用接口
//    展示图片列表 -- 数据调用接口
// 3. 交互
//    3.1 先准备api - 目的知道后端要哪些数据(分析参数)
//    3.2 收集数据
//        传过来的数据在保存之前进行组装
//        3.2.1 普通数据的收集  -->  v-model可以收集到的
//        ----------------------------------------
//        3.2.2
//            平台属性收集
//            销售属性收集
//        3.2.3
//            图片列表的收集
//            默认图片的收集
// #endregion
import { onMounted, ref } from "vue";
import { STATUS } from "../../index.vue";
import spuApi, { type SpuModel, type SpuSaleAttrModel, type SpuImageModel } from "@/api/spu";
import attrsApi, { type AttrsModelList } from "@/api/attrs";
import useCategoryStore from "@/stores/category";
import type { SkuModel } from "@/api/sku";
const categoryStore = useCategoryStore()
const emits =  defineEmits<{
  (e: 'update:modelValue', status: number): void
}>()
const props = defineProps<{
  spuInfo: SpuModel
}>()


const initSkuForm = () => ({
  spuId: undefined, // 保存时进行组装
  tmId: undefined, // 保存时进行组装
  category3Id: undefined, // 保存时进行组装
  price: '',  // v-model
  skuName: '', // v-model
  skuDesc: '', // v-model
  weight: '', // v-model
  skuDefaultImg: '', // 默认图片 点击表格右侧"设为默认"选择(排他思想)
  createTime: '', // 不管
  skuImageList: [], // 表格左侧勾选
  skuAttrValueList: [], // 平台属性下拉选中收集
  skuSaleAttrValueList: [] // 销售属性下拉选中收集
})
const skuForm = ref<SkuModel>( initSkuForm() )

// 获取平台属性
const attrList = ref<AttrsModelList>([])
const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore
  let result = await attrsApi.reqAttrsList(category1Id!, category2Id!, category3Id!)
  attrList.value = result
  console.log('平台属性', attrList.value)
}
// 获取销售属性
const saleAttrList = ref<SpuSaleAttrModel[]>([])
const getSaleAttrList = async () => {
  let result = await spuApi.reqSaleAttrListBySpuId(props.spuInfo.id!)
  saleAttrList.value = result
  console.log('销售属性', saleAttrList.value)
}
// 获取图片列表
const imageList = ref<SpuImageModel[]>([])
const getImageList = async () => {
  let result = await spuApi.reqSpuImageListBySpuId(props.spuInfo.id!)
  imageList.value = result
  console.log('图片列表', imageList.value)
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