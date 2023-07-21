<template>
  <el-card class="box-card">
    <template #header>
        <el-button type="primary" :icon="Plus">添加</el-button>
    </template>
    <el-table border class="mb-10">
      <el-table-column  label="序号" width="80" align="center"/>
      <el-table-column  label="品牌名称"/>
      <el-table-column  label="品牌LOGO" />
      <el-table-column  label="操作" />
    </el-table>
  </el-card>

  <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper, ->, sizes ,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>

<script setup lang="ts">
// 1. 静态搭建
// 2. 初始化数据展示
// 3. 交互
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue';

// 翻页相关
const page = ref(1)
const limit = ref(3)
const total = ref(0)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>
<style scoped>

</style>