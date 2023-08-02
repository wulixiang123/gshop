<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <KeywordSearch></KeywordSearch>
    </el-col>
    <el-col :span="12">
      <SaleRank></SaleRank>
    </el-col>
  </el-row>
</template>
  
  <script setup lang="ts">
  import KeywordSearch from './KeywordSearch.vue';
  import SaleRank from './SaleRank.vue';

  
  </script>
  
  <style scoped>
  
  </style>