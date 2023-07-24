<template>
    <div>
      <div>SpuForm - 新增SPU</div>
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