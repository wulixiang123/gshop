<template>
  <div class="spu">
    <el-card class="mb-10">
      <CategorySelector :disabled="false"></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="status == 1" @changeStatus="status = $event"></SpuList>
      <SpuForm v-if="status == 2" @changeStatus="status = $event"></SpuForm>
      <SkuForm v-if="status == 3" @changeStatus="status = $event"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// SPU管理
// 整个页面由三部分组成, 主力表、新增SPU、新增SKU，封装三个组件去做(如果放到一起代码多)
// 一、 先把整个架子搭建起来
// 二、 分页面去写
//      主列表
//      新增SPU
//      新增SKU
import SpuList from './components/SpuList/index.vue'
import SpuForm from './components/SpuFrom/index.vue'
import SkuForm from './components/SkuForm/index.vue'
import { ref } from 'vue';

// 1是主列表  2是新增Spu  3是新增Sku
const status = ref(1) // 默认展示主列表


</script>