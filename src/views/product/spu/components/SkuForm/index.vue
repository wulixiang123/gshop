<template>
    <div>
      <div>SkuForm - 新增SKU</div>
      <el-button @click="emits('update:modelValue', STATUS.SPULIST)">取消</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { STATUS } from '../../index.vue'
  const emits =  defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()
  </script>
  
  <style scoped>
  
  </style>