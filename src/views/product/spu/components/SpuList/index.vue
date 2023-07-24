<template>
    <div>
      <div>SpuList - 主列表</div>
      <el-button type="primary" @click="emits('update:modelValue', STATUS.SPUFORM)">新增SPU</el-button>
    <el-button type="primary" @click="emits('update:modelValue', STATUS.SKUFORM)">新增SKU</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { STATUS } from '../../index.vue'
  const emits = defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()
  </script>
  
  <style scoped>
  
  </style>