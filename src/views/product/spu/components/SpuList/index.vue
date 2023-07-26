<template>
  <div>
    <el-button type="primary" :icon="Plus" :disabled="!categoryStore.category3Id" class="mb-10" @click="emits('update:modelValue', STATUS.SPUFORM)">新增SPU</el-button>

    <el-table :data="spuList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Plus" size="small" title="添加SKU" @click="addSku(row)"></el-button>
          <el-button type="warning" :icon="Edit" size="small" title="编辑SPU" @click="editSpu(row)"></el-button>
          <el-button type="info" :icon="InfoFilled" size="small" title="查看SKU列表" @click="showSkuList(row)"></el-button>

          <el-popconfirm :title="`确认要删除[${ row.spuName }]吗?`" @confirm="deleteSpu(row)">
            <template #reference>
              <el-button type="danger" :icon="Delete" size="small" title="删除SPU"></el-button>
            </template>
          </el-popconfirm>

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

    <el-dialog
      v-model="showSkuDialog"
      :title="`[${ currentSpuName }]的sku列表`"
      width="80%"
      @close="clearSkuList"
    >
      
      <el-table :data="skuList" v-loading="loading">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template #default="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
      </el-table>
      
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, Plus, InfoFilled } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import { ref, watch } from 'vue'
import spuApi, { type SpuModel } from '@/api/spu'
import useCategoryStore from '@/stores/category'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import skuApi, { type SkuModel } from '@/api/sku'
const categoryStore = useCategoryStore()
const emits = defineEmits<{
  (e: 'update:modelValue', status: number): void,
  (e: 'receiveSpuInfo', row: SpuModel): void
}>()

const addSku = (row:SpuModel)=>{
  emits('update:modelValue',STATUS.SKUFORM)// 切换成skuForm组件
  emits('receiveSpuInfo',cloneDeep(row))// 将当前的row传给父组件,是一条spu
}


// 查看sku列表
const showSkuDialog = ref(false) // 默认不弹框
const currentSpuName = ref('') // dialog弹框的标题
const skuList = ref<SkuModel[]>([]) // 存表格数据
const loading = ref(false) // 默认不加载
const showSkuList = async (row: SpuModel) => {
  // 弹框展示
  showSkuDialog.value = true
  currentSpuName.value = row.spuName
  loading.value = true
  // 调用接口拿数据
  try {
    let result = await skuApi.reqSkuListBySpuId(row.id!)
    skuList.value = result
    console.log(skuList.value)
  } finally {
    loading.value = false
  }
}
// 弹窗消失,清空列表
const clearSkuList = () => {
  skuList.value = []
}


// 编辑
const editSpu = (row: SpuModel) => {
  emits('update:modelValue', STATUS.SPUFORM) // 切换SpuForm组件展示

  emits('receiveSpuInfo', cloneDeep(row)) // 将当前编辑的spu传给父组件,父组件接收到之后,再次传给SpuForm组件,进行数据回显
}


// 删除
const deleteSpu = async (row: SpuModel) => {
  await spuApi.reqDeleteSpu(row.id!)
  ElMessage.success('删除成功')
  getPage() // 重新获取数据
}


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