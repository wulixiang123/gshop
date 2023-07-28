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
          <el-button type="success" size="small" icon="ele-Top"></el-button>
          <el-button type="primary" size="small" icon="ele-Edit"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled"></el-button>
          <el-button type="danger" size="small" icon="ele-Delete"></el-button>
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

const getSkuList = async(pager = 1) => {
  page.value = pager
  const result = await skuApi.reqSkuList(page.value,limit.value)
  console.log(result);
  skuList.value = result.records
  total.value = result.total
}
</script>

<style scoped>

</style>