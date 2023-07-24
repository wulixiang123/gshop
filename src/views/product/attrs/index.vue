<template>
  <div class="attrs">
    <el-card class="mb-10">
      <CategorySelector></CategorySelector>
    </el-card>
    <el-card>
      <el-button type="primary" :icon="Plus">添加属性</el-button>
      <el-table border>
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" prop="attrName" width="160"></el-table-column>
        <el-table-column label="属性值列表">
          <template #default="row,$index">
            <el-tag
            class="mr-10"
            type="success"
            v-for="attrVal in row.attrValueList"
            :key="attrVal.id"
            >{{ attrVal.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="row,$index">
            <el-button type="warning" :icon="Edit" size="small"></el-button>
            <el-button type="danger" :icon="Delete" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 按道理来说,写页面应该按步骤走,但是整个页面分为了上下两块内容
// 上面的内容是一个三级分类,可以作为一个公用组件来用,所以先写三级分类组件,然后返回再写页面
// 三级分类组件的步骤,详情见组件中
// 1. 静态搭建
// 2. 初始化数据展示
// 3. 交互
import { Delete, Edit, Plus } from '@element-plus/icons-vue'

</script>

<style scoped>

</style>