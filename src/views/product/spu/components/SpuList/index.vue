<template>
    <div>
      <div>SpuList - 主列表</div>
      <el-button type="primary" @click="emits('changeStatus', 2)">新增SPU</el-button>
      <el-button type="primary" @click="emits('changeStatus', 3)">新增SKU</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  const emits = defineEmits<{
    (e: 'changeStatus', status: number): void
  }>()
  </script>
  
  <style scoped>
  
  </style>