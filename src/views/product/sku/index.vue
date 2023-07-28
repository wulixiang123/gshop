<template>
  <div>
    <el-table border :data="skuList">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template #default="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 100px;height: 60px;">
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template #default="{row,$index}">
          <el-button v-if="row.isSale" type="success" size="small" icon="ele-Top" @click="cancelSale(row)" title="下架"></el-button>
          <el-button v-else type="info" size="small" icon="ele-Bottom" @click="onSale(row)" title="上架"></el-button>
          <el-button type="primary" size="small" icon="ele-Edit" title="修改" @click="updateSku(row)"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" title="查看详情"></el-button>
          <el-button type="danger" size="small" icon="ele-Delete" title="删除sku" @click="delete"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination v-model:currentPage="page" v-model:page-size="limit" layout="prev, pager, next, jumper"
      :total="total" @current-change="getSkuList" />


  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import skuApi, { type skuInfoDate } from '@/api/sku'
import { ElMessage } from 'element-plus';

const page = ref(1)
const limit = ref(10)
const total = ref(0)
const skuList = ref<skuInfoDate[]>([])
const isShowSkuInfo = ref(false)
const skuInfo = ref<skuInfoDate>({
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
onMounted(()=>{
  getSkuList()
})



// 编辑
const updateSku = (row: skuInfoDate) => {
  ElMessage.success('正在开发中！！！！')
}



// 上架
const cancelSale = async(row:skuInfoDate) => {
  try {
    await skuApi.cancelSale(row.id as number)
    getSkuList()
    ElMessage.success('下架成功')
  } catch (error) {
    ElMessage.error('下架失败')
  }
}
// 下架
const onSale = async(row:skuInfoDate)=>{
  try {
    await skuApi.onSale(row.id as number)
    getSkuList()
    ElMessage.success('上架成功')
  } catch (error) {
    ElMessage.error('上架失败')
  }
}



const getSkuList = async(pager = 1) => {
  page.value = pager
  const result = await skuApi.reqSkuList(page.value,limit.value)
  console.log(result);
  skuList.value = result.records
  total.value = result.total
}
</script>

<style scoped>
body {
  margin: 0;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>