<template>
    <el-row :gutter="10">
      <el-col :span="6">
        <TodaySale></TodaySale>
      </el-col>
      <el-col :span="6">
        今日订单量
      </el-col>
      <el-col :span="6">
        交易用户数
      </el-col>
      <el-col :span="6">
        累计用户数
      </el-col>
    </el-row>
  </template>
  
  <script setup lang="ts">
  import TodaySale from './components/TodaySale/index.vue'
  </script>
  
  <style scoped>
  
  </style>