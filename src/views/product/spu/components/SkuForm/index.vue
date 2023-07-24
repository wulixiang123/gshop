<template>
    <div>
      <div>SkuForm - 新增SKU</div>
      <el-button @click="emits('changeStatus', 1)">取消</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  const emits =  defineEmits<{
    (e: 'changeStatus', status: number): void
  }>()
  </script>
  
  <style scoped>
  
  </style>