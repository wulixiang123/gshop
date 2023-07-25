<template>
  <div class="spu">
    <el-card class="mb-10">
      <CategorySelector :disabled="status != STATUS.SPULIST"></CategorySelector>
    </el-card>
    <el-card>
      <!--
        <SpuList v-if="status == STATUS.SPULIST" @update:modelValue="status = $event"></SpuList>
        <SpuForm v-if="status == STATUS.SPUFORM" @update:modelValue="status = $event"></SpuForm>
        <SkuForm v-if="status == STATUS.SKUFORM" @update:modelValue="status = $event"></SkuForm>
      -->
      <SpuList v-if="status == STATUS.SPULIST" v-model="status" @receiveSpuInfo="receiveSpuInfo"></SpuList>
      <SpuForm v-if="status == STATUS.SPUFORM" v-model="status" :spuInfo="spuInfo"></SpuForm>
      <SkuForm v-if="status == STATUS.SKUFORM" v-model="status"></SkuForm>
    </el-card>
  </div>
</template>

<script lang="ts">
// 枚举
export enum STATUS {
  SPULIST = 1000,
  SPUFORM = 2000,
  SKUFORM = 3000
}
</script> 
<script setup lang="ts">
// #region
// SPU管理
// 整个页面由三部分组成, 主力表、新增SPU、新增SKU，封装三个组件去做(如果放到一起代码多)
// 一、 先把整个架子搭建起来
// 二、 分页面去写
//      主列表
//      新增SPU
//          添加限制条件:
//            1. 三级分类的禁用,只要不是主列表展示,都要禁用
//            2. 主列表中"新增SPU"按钮,只有在三级分类有值的时候,才能点击
//      新增SKU
// #endregion
import SpuList from './components/SpuList/index.vue'
import SpuForm from './components/SpuForm/index.vue'
import SkuForm from './components/SkuForm/index.vue'
import { ref } from 'vue';
import type { SpuModel } from '@/api/spu';

// 1是主列表  2是新增Spu  3是新增Sku
const status = ref(STATUS.SPULIST) // 默认展示主列表


const initSpuInfo = () => ({
  spuName: '',
  description: '',
  category3Id: undefined,
  tmId: undefined,
  spuSaleAttrList: [],
  spuImageList: []
})
// 用来在编辑的时候,把某一条spu传给父组件,父组件再传给spuForm组件
const spuInfo = ref<SpuModel>( initSpuInfo() )

const receiveSpuInfo = (row: SpuModel) => {
  spuInfo.value = row
}


</script>

<style scoped>

</style>