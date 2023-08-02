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
        <userTotal></userTotal>
      </el-col>
    </el-row>
  </template>
  
  <script setup lang="ts">
  import TodaySale from './components/TodaySale/index.vue'
  import TodayOrder from './components/TodayOrder/index.vue'
  import UserSale from './components/UserSale/index.vue'
  import userTotal from './components/UserTotal.vue'
  </script>
  
  <style scoped lang="scss">
  // 箭头
::v-deep(.down) {
  margin-top: 5px;
  display: inline-block;
  border: 5px solid blue;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
::v-deep(.up) {
  margin-top: -5px;
  display: inline-block;
  border: 5px solid red;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
}
  </style>