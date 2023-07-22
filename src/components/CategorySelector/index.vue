<template>
    <el-form inline>
  
      <el-form-item label="一级分类">
        <!-- 在select没有写v-model的时候,是选不中的 -->
        <el-select clearable>
          <el-option
            v-for="c1 in categoryStore.category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label="二级分类">
        <el-select clearable>
          <el-option label="北京" :value="1001"></el-option>
          <el-option label="上海" :value="1002"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item label="三级分类">
        <el-select clearable>
          <el-option label="北京" :value="1001"></el-option>
          <el-option label="上海" :value="1002"></el-option>
        </el-select>
      </el-form-item>
  
    </el-form>
  </template>
  
  <script setup lang="ts">
  // #region
  // 三级分类组件
  // 注意: 初始化数据的时候只拿一级的数据,选择一级之后,拿二级的数据,选择二级之后,拿三级的数据
  // 注意: 在咱们后台项目中,没有地方可以使用pinia了,我们就把这个组件的数据,放pinia中
  //         这里是为了用pinia而用pinia
  // 1. 静态搭建
  //    定义、注册(全局注册)、使用
  //    el-form的inline属性是把每一项变成行内的
  // 2. 初始化数据展示
  //    api准备
  //    组件初始化的时候调用api,获取一级分类的数据
  // 3. 交互
  // #endregion
  import { onMounted } from 'vue'
  import useCategoryStore from '@/stores/category'
  const categoryStore = useCategoryStore() // 拿到store
  
  const getCategory1List = () => {
    categoryStore.getCategory1List()
  }
  
  onMounted(() => {
    getCategory1List()
  })
  
  </script>
  
  <style scoped>
  
  </style>