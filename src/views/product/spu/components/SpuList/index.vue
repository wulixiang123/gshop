<template>
  <div>
    <div>SpuList - 主列表</div>
      <el-button type="primary" :icon="Plus" class="mb-10" @click="emits('update:modelValue', STATUS.SKUFORM)">新增SPU</el-button>
      <el-table border class="mb-10">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="SPU名称"></el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row,$index}">
            <el-button type="success" :icon="Plus" size="small" title="添加SKU" @click="emits('update:modelValue', STATUS.SKUFORM)"></el-button>
            <el-button type="warning" :icon="Edit" size="small" title="剪辑SPU"></el-button>
            <el-button type="info" :icon="InfoFilled" size="small" title="查看SKU列表"></el-button>
            <el-button type="danger" :icon="Delete" size="small" title="删除SPU"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper, ->, sizes ,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
  
  <script setup lang="ts">
  import { Delete, Edit, Plus, InfoFilled } from '@element-plus/icons-vue'
  import { STATUS } from '../../index.vue'
  import {ref} from 'vue'
  const emits = defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()

  // 翻页交互
const page = ref(1)
const limit = ref(3)
const total = ref(0)
const handleSizeChange = (val: number) => {
  console.log('改变每页条数,重新发请求', val)
}
const handleCurrentChange = (val: number) => {
  console.log('改变页码,重新发请求', val)
}
  </script>
  
  <style scoped>
  
  </style>