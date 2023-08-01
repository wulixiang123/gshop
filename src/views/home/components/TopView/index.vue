<template>
    <el-row :gutter="10">
      <el-col :span="6">
        <TodaySale></TodaySale>
      </el-col>
      <el-col :span="6">
        <TodayOrder></TodayOrder>
      </el-col>
      <el-col :span="6">
        <UserSale></UserSale>
      </el-col>
      <el-col :span="6">
        累计用户数
      </el-col>
    </el-row>
  </template>
  
  <script setup lang="ts">
  import TodaySale from './components/TodaySale/index.vue'
  import TodayOrder from './components/TodayOrder/index.vue'
  import UserSale from './components/UserSale/index.vue'
  </script>
  
  <style scoped>
  
  </style>