<template>
  <div>
    <el-button type="primary" :icon="Plus" :disabled="!categoryStore.category3Id" class="mb-10" @click="emits('update:modelValue', STATUS.SPUFORM)">新增SPU</el-button>

    <el-table :data="spuList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Plus" size="small" title="添加SKU" @click="emits('update:modelValue', STATUS.SKUFORM)"></el-button>
          <el-button type="warning" :icon="Edit" size="small" title="编辑SPU"></el-button>
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
import { ref, watch } from 'vue'
import spuApi, { type SpuModel } from '@/api/spu'
import useCategoryStore from '@/stores/category'
const categoryStore = useCategoryStore()
const emits = defineEmits<{
  (e: 'update:modelValue', status: number): void
}>()


// 翻页交互
const page = ref(1)
const limit = ref(3)
const total = ref(0)
const handleSizeChange = (val: number) => {
  getPage()
}
const handleCurrentChange = (val: number) => {
  getPage()
}



const spuList = ref<SpuModel[]>([])
const getPage = async () => {
  let result = await spuApi.reqSpuPage(page.value, limit.value, categoryStore.category3Id as number)
  spuList.value = result.records
  total.value = result.total
}


// 初始化数据展示(在三级分类有id的时候获取数据)
watch(() => categoryStore.category3Id, (nval) => {
  if (nval) { // 获取数据
    getPage()
  } else { // 清空列表
    spuList.value = []
    total.value = 0
  }
}, { immediate: true })
</script>

<style scoped>

</style>